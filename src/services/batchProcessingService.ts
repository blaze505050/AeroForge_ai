/**
 * Professional Batch Processing Service
 * Manages queued operations with progress tracking, error handling, and result persistence
 */

export type BatchJobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'paused';
export type BatchOperationType = 'export' | 'simulation' | 'optimization' | 'analysis' | 'conversion' | 'validation';

export interface BatchJobItem {
  id: string;
  designId: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  result?: any;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
}

export interface BatchJob {
  id: string;
  name: string;
  operationType: BatchOperationType;
  status: BatchJobStatus;
  totalItems: number;
  completedItems: number;
  failedItems: number;
  items: BatchJobItem[];
  progress: number;
  estimatedTimeRemaining: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  priority: 'low' | 'normal' | 'high';
  parameters: Record<string, any>;
  results?: {
    successful: number;
    failed: number;
    averageProcessingTime: number;
    totalProcessingTime: number;
  };
}

export interface BatchProcessingConfig {
  maxConcurrentJobs: number;
  maxItemsPerBatch: number;
  timeoutPerItem: number;
  retryAttempts: number;
  retryDelay: number;
}

class BatchProcessingService {
  private jobs: Map<string, BatchJob> = new Map();
  private queue: string[] = [];
  private activeJobs: Set<string> = new Set();
  private config: BatchProcessingConfig = {
    maxConcurrentJobs: 3,
    maxItemsPerBatch: 100,
    timeoutPerItem: 300000, // 5 minutes
    retryAttempts: 3,
    retryDelay: 5000,
  };

  private jobProgressCallbacks: Map<string, (job: BatchJob) => void> = new Map();
  private itemProgressCallbacks: Map<string, (item: BatchJobItem) => void> = new Map();

  /**
   * Initialize batch processing service
   */
  initialize(config: Partial<BatchProcessingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Create a new batch job
   */
  createBatchJob(
    name: string,
    operationType: BatchOperationType,
    items: Omit<BatchJobItem, 'status' | 'progress'>[],
    parameters: Record<string, any> = {},
    priority: 'low' | 'normal' | 'high' = 'normal'
  ): BatchJob {
    const jobId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const job: BatchJob = {
      id: jobId,
      name,
      operationType,
      status: 'queued',
      totalItems: items.length,
      completedItems: 0,
      failedItems: 0,
      items: items.map((item, index) => ({
        ...item,
        id: `${jobId}-item-${index}`,
        status: 'pending',
        progress: 0,
      })),
      progress: 0,
      estimatedTimeRemaining: 0,
      createdAt: new Date(),
      priority,
      parameters,
    };

    this.jobs.set(jobId, job);
    this.queue.push(jobId);
    this.processQueue();

    return job;
  }

  /**
   * Get job by ID
   */
  getJob(jobId: string): BatchJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs
   */
  getAllJobs(): BatchJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Get jobs by status
   */
  getJobsByStatus(status: BatchJobStatus): BatchJob[] {
    return Array.from(this.jobs.values()).filter(job => job.status === status);
  }

  /**
   * Cancel a batch job
   */
  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    if (job.status === 'processing') {
      job.status = 'cancelled';
      this.activeJobs.delete(jobId);
    } else if (job.status === 'queued') {
      job.status = 'cancelled';
      this.queue = this.queue.filter(id => id !== jobId);
    }

    return true;
  }

  /**
   * Pause a batch job
   */
  pauseJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'processing') return false;

    job.status = 'paused';
    return true;
  }

  /**
   * Resume a paused job
   */
  resumeJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'paused') return false;

    job.status = 'processing';
    this.processQueue();
    return true;
  }

  /**
   * Subscribe to job progress updates
   */
  onJobProgress(jobId: string, callback: (job: BatchJob) => void): () => void {
    this.jobProgressCallbacks.set(jobId, callback);
    return () => this.jobProgressCallbacks.delete(jobId);
  }

  /**
   * Subscribe to item progress updates
   */
  onItemProgress(itemId: string, callback: (item: BatchJobItem) => void): () => void {
    this.itemProgressCallbacks.set(itemId, callback);
    return () => this.itemProgressCallbacks.delete(itemId);
  }

  /**
   * Process queue - manages concurrent job execution
   */
  private async processQueue(): Promise<void> {
    while (this.queue.length > 0 && this.activeJobs.size < this.config.maxConcurrentJobs) {
      const jobId = this.queue.shift();
      if (!jobId) break;

      const job = this.jobs.get(jobId);
      if (!job) continue;

      this.activeJobs.add(jobId);
      job.status = 'processing';
      job.startedAt = new Date();

      this.executeJob(job).catch(error => {
        console.error(`Job ${jobId} failed:`, error);
        job.status = 'failed';
      });
    }
  }

  /**
   * Execute a batch job
   */
  private async executeJob(job: BatchJob): Promise<void> {
    const startTime = Date.now();
    let successCount = 0;
    let failureCount = 0;
    const processingTimes: number[] = [];

    for (let i = 0; i < job.items.length; i++) {
      if (job.status === 'cancelled') break;
      if (job.status === 'paused') {
        await this.waitForResume(job.id);
      }

      const item = job.items[i];
      item.status = 'processing';
      item.startTime = new Date();

      try {
        const itemStartTime = Date.now();
        const result = await this.processItem(item, job);
        const itemDuration = Date.now() - itemStartTime;

        item.status = 'completed';
        item.progress = 100;
        item.result = result;
        item.duration = itemDuration;
        item.endTime = new Date();
        processingTimes.push(itemDuration);
        successCount++;
      } catch (error) {
        item.status = 'failed';
        item.error = error instanceof Error ? error.message : 'Unknown error';
        failureCount++;
      }

      // Update job progress
      job.completedItems = successCount + failureCount;
      job.failedItems = failureCount;
      job.progress = Math.round((job.completedItems / job.totalItems) * 100);
      job.estimatedTimeRemaining = this.estimateRemainingTime(
        processingTimes,
        job.totalItems - job.completedItems
      );

      this.notifyItemProgress(item);
      this.notifyJobProgress(job);
    }

    // Finalize job
    job.status = job.failedItems > 0 ? 'completed' : 'completed';
    job.completedAt = new Date();
    job.progress = 100;

    const totalTime = Date.now() - startTime;
    job.results = {
      successful: successCount,
      failed: failureCount,
      averageProcessingTime: processingTimes.length > 0 
        ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length 
        : 0,
      totalProcessingTime: totalTime,
    };

    this.activeJobs.delete(job.id);
    this.notifyJobProgress(job);
    this.processQueue();
  }

  /**
   * Process individual item
   */
  private async processItem(item: BatchJobItem, job: BatchJob): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
      try {
        return await this.executeOperation(item, job, attempt);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < this.config.retryAttempts - 1) {
          await new Promise(resolve => 
            setTimeout(resolve, this.config.retryDelay * Math.pow(2, attempt))
          );
        }
      }
    }

    throw lastError || new Error('Operation failed after all retry attempts');
  }

  /**
   * Execute the actual operation based on type
   */
  private async executeOperation(
    item: BatchJobItem,
    job: BatchJob,
    attempt: number
  ): Promise<any> {
    // Simulate operation execution with realistic timing
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Operation timeout after ${this.config.timeoutPerItem}ms`));
      }, this.config.timeoutPerItem);

      // Simulate processing based on operation type
      const processingTime = this.getProcessingTime(job.operationType);
      
      setTimeout(() => {
        clearTimeout(timeout);

        // Simulate occasional failures for retry testing
        if (Math.random() < 0.05 && attempt === 0) {
          reject(new Error('Simulated transient failure'));
          return;
        }

        resolve({
          itemId: item.id,
          designId: item.designId,
          operationType: job.operationType,
          timestamp: new Date(),
          metrics: this.generateMetrics(job.operationType),
          attempt,
        });
      }, processingTime);
    });
  }

  /**
   * Get estimated processing time for operation type
   */
  private getProcessingTime(operationType: BatchOperationType): number {
    const times: Record<BatchOperationType, number> = {
      export: 2000,
      simulation: 8000,
      optimization: 12000,
      analysis: 5000,
      conversion: 3000,
      validation: 1500,
    };
    return times[operationType] + Math.random() * 2000;
  }

  /**
   * Generate metrics for operation result
   */
  private generateMetrics(operationType: BatchOperationType): Record<string, any> {
    const metrics: Record<BatchOperationType, Record<string, any>> = {
      export: {
        fileSize: Math.floor(Math.random() * 50) + 10,
        format: 'STEP',
        validationPassed: true,
      },
      simulation: {
        maxStress: (Math.random() * 500 + 100).toFixed(2),
        maxDeflection: (Math.random() * 5 + 0.5).toFixed(2),
        convergence: (Math.random() * 0.3 + 0.7).toFixed(3),
      },
      optimization: {
        weightReduction: (Math.random() * 30 + 5).toFixed(1),
        costSavings: (Math.random() * 40 + 10).toFixed(1),
        performanceGain: (Math.random() * 25 + 5).toFixed(1),
      },
      analysis: {
        criticalAreas: Math.floor(Math.random() * 5) + 1,
        riskScore: (Math.random() * 100).toFixed(1),
        recommendations: Math.floor(Math.random() * 8) + 2,
      },
      conversion: {
        sourceFormat: 'IGES',
        targetFormat: 'STEP',
        geometryPreserved: (Math.random() * 5 + 95).toFixed(1),
      },
      validation: {
        checksRun: Math.floor(Math.random() * 50) + 20,
        checksPassed: Math.floor(Math.random() * 45) + 20,
        dfmCompliant: Math.random() > 0.1,
      },
    };
    return metrics[operationType];
  }

  /**
   * Estimate remaining time
   */
  private estimateRemainingTime(processingTimes: number[], remainingItems: number): number {
    if (processingTimes.length === 0) return 0;
    const avgTime = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
    return Math.ceil((avgTime * remainingItems) / 1000); // Return in seconds
  }

  /**
   * Wait for job to resume
   */
  private waitForResume(jobId: string): Promise<void> {
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        const job = this.jobs.get(jobId);
        if (job && job.status !== 'paused') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  /**
   * Notify job progress
   */
  private notifyJobProgress(job: BatchJob): void {
    const callback = this.jobProgressCallbacks.get(job.id);
    if (callback) {
      callback(job);
    }
  }

  /**
   * Notify item progress
   */
  private notifyItemProgress(item: BatchJobItem): void {
    const callback = this.itemProgressCallbacks.get(item.id);
    if (callback) {
      callback(item);
    }
  }

  /**
   * Export job results
   */
  exportResults(jobId: string, format: 'json' | 'csv'): Blob {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error('Job not found');

    if (format === 'json') {
      return new Blob([JSON.stringify(job, null, 2)], { type: 'application/json' });
    } else {
      // CSV format
      const headers = ['Item ID', 'Design ID', 'Status', 'Progress', 'Duration (ms)', 'Error'];
      const rows = job.items.map(item => [
        item.id,
        item.designId,
        item.status,
        item.progress,
        item.duration || '',
        item.error || '',
      ]);

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      return new Blob([csv], { type: 'text/csv' });
    }
  }

  /**
   * Clear completed jobs
   */
  clearCompletedJobs(): number {
    let cleared = 0;
    for (const [jobId, job] of this.jobs.entries()) {
      if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
        this.jobs.delete(jobId);
        cleared++;
      }
    }
    return cleared;
  }

  /**
   * Get service statistics
   */
  getStatistics(): {
    totalJobs: number;
    activeJobs: number;
    queuedJobs: number;
    completedJobs: number;
    failedJobs: number;
    totalItemsProcessed: number;
    averageJobDuration: number;
  } {
    const allJobs = Array.from(this.jobs.values());
    const completedJobs = allJobs.filter(j => j.status === 'completed' || j.status === 'failed');
    
    const totalItemsProcessed = completedJobs.reduce((sum, job) => sum + job.completedItems, 0);
    const totalDuration = completedJobs.reduce((sum, job) => {
      if (job.startedAt && job.completedAt) {
        return sum + (job.completedAt.getTime() - job.startedAt.getTime());
      }
      return sum;
    }, 0);

    return {
      totalJobs: allJobs.length,
      activeJobs: this.activeJobs.size,
      queuedJobs: this.queue.length,
      completedJobs: allJobs.filter(j => j.status === 'completed').length,
      failedJobs: allJobs.filter(j => j.status === 'failed').length,
      totalItemsProcessed,
      averageJobDuration: completedJobs.length > 0 ? totalDuration / completedJobs.length : 0,
    };
  }
}

export const batchProcessingService = new BatchProcessingService();
