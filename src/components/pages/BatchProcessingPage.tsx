import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  X,
  Download,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  TrendingUp,
  FileJson,
  FileText,
  Settings,
  BarChart3,
  Layers,
  Activity,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  batchProcessingService,
  BatchJob,
  BatchJobItem,
  BatchOperationType,
  ParametricStudyConfig,
  ParameterDefinition,
} from '@/services/batchProcessingService';

const OPERATION_TYPES: { type: BatchOperationType; label: string; color: string; icon: React.ReactNode }[] = [
  { type: 'export', label: 'Export', color: 'bg-blue-500', icon: '📤' },
  { type: 'simulation', label: 'Simulation', color: 'bg-purple-500', icon: '⚙️' },
  { type: 'optimization', label: 'Optimization', color: 'bg-green-500', icon: '✨' },
  { type: 'analysis', label: 'Analysis', color: 'bg-orange-500', icon: '📊' },
  { type: 'conversion', label: 'Conversion', color: 'bg-cyan-500', icon: '🔄' },
  { type: 'validation', label: 'Validation', color: 'bg-red-500', icon: '✓' },
  { type: 'parametric-study', label: 'Parametric Study', color: 'bg-indigo-500', icon: '🔬' },
];

export default function BatchProcessingPage() {
  const [jobs, setJobs] = useState<BatchJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<BatchJob | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showParametricModal, setShowParametricModal] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<BatchOperationType>('export');
  const [itemCount, setItemCount] = useState(10);
  const [jobName, setJobName] = useState('');
  const [enableParametricStudy, setEnableParametricStudy] = useState(false);
  const [parametricParams, setParametricParams] = useState<ParameterDefinition[]>([
    { name: 'thickness', type: 'range', min: 1, max: 10, steps: 5 },
  ]);
  const [statistics, setStatistics] = useState<any>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout>();

  // Initialize service
  useEffect(() => {
    batchProcessingService.initialize({
      maxConcurrentJobs: 3,
      maxItemsPerBatch: 100,
      timeoutPerItem: 300000,
      retryAttempts: 3,
      queueStrategy: 'adaptive',
      enablePersistence: true,
      enableMetrics: true,
    });
  }, []);

  // Update jobs and statistics
  useEffect(() => {
    const updateJobs = () => {
      const allJobs = batchProcessingService.getAllJobs();
      setJobs(allJobs);
      setStatistics(batchProcessingService.getStatistics());

      if (selectedJob) {
        const updated = allJobs.find(j => j.id === selectedJob.id);
        if (updated) {
          setSelectedJob(updated);
        }
      }
    };

    updateJobs();
    updateIntervalRef.current = setInterval(updateJobs, 500);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [selectedJob]);

  const createBatchJob = () => {
    if (!jobName.trim()) {
      alert('Please enter a job name');
      return;
    }

    const items = Array.from({ length: itemCount }, (_, i) => ({
      designId: `design-${i + 1}`,
      name: `Design ${i + 1}`,
    }));

    let parametricConfig: ParametricStudyConfig | undefined;
    if (enableParametricStudy) {
      parametricConfig = {
        parameters: parametricParams,
        baselineParameters: {},
        aggregationMethod: 'mean',
      };
    }

    const job = batchProcessingService.createBatchJob(
      jobName,
      selectedOperation,
      items,
      { priority: 'normal' },
      'normal',
      parametricConfig,
      { tags: ['user-created'], description: `${selectedOperation} batch job` }
    );

    setSelectedJob(job);
    setShowCreateModal(false);
    setShowParametricModal(false);
    setJobName('');
    setItemCount(10);
    setEnableParametricStudy(false);
  };

  const handlePauseResume = (jobId: string) => {
    const job = batchProcessingService.getJob(jobId);
    if (!job) return;

    if (job.status === 'processing') {
      batchProcessingService.pauseJob(jobId);
    } else if (job.status === 'paused') {
      batchProcessingService.resumeJob(jobId);
    }
  };

  const handleCancel = (jobId: string) => {
    if (confirm('Are you sure you want to cancel this job?')) {
      batchProcessingService.cancelJob(jobId);
    }
  };

  const handleExportResults = (jobId: string, format: 'json' | 'csv') => {
    try {
      const blob = batchProcessingService.exportResults(jobId, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `batch-results-${jobId}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting results');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'processing':
        return 'text-blue-400';
      case 'paused':
        return 'text-yellow-400';
      case 'queued':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10';
      case 'failed':
        return 'bg-red-500/10';
      case 'processing':
        return 'bg-blue-500/10';
      case 'paused':
        return 'bg-yellow-500/10';
      case 'queued':
        return 'bg-gray-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading text-5xl font-bold mb-4">Enterprise Batch Processing</h1>
          <p className="text-secondary-foreground text-lg max-w-2xl">
            Production-Grade Batch Processing with Parametric Studies, Adaptive Queuing, Result Aggregation & Analytics.
          </p>
        </motion.div>

        {/* Statistics Cards */}
        {statistics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          >
            <Card className="bg-primary/50 border-secondary/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground text-sm mb-2">Total Jobs</p>
                  <p className="text-3xl font-bold text-aerospace-blue">{statistics.totalJobs}</p>
                </div>
                <Zap className="w-8 h-8 text-aerospace-blue opacity-50" />
              </div>
            </Card>

            <Card className="bg-primary/50 border-secondary/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground text-sm mb-2">Active Jobs</p>
                  <p className="text-3xl font-bold text-aerospace-accent">{statistics.activeJobs}</p>
                </div>
                <Activity className="w-8 h-8 text-aerospace-accent opacity-50" />
              </div>
            </Card>

            <Card className="bg-primary/50 border-secondary/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground text-sm mb-2">Completed</p>
                  <p className="text-3xl font-bold text-aerospace-success">{statistics.completedJobs}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-aerospace-success opacity-50" />
              </div>
            </Card>

            <Card className="bg-primary/50 border-secondary/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground text-sm mb-2">Items Processed</p>
                  <p className="text-3xl font-bold text-aerospace-warning">{statistics.totalItemsProcessed}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-aerospace-warning opacity-50" />
              </div>
            </Card>

            <Card className="bg-primary/50 border-secondary/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground text-sm mb-2">Throughput</p>
                  <p className="text-3xl font-bold text-aerospace-accent">{statistics.totalThroughput.toFixed(1)}</p>
                  <p className="text-xs text-secondary-foreground">items/sec</p>
                </div>
                <BarChart3 className="w-8 h-8 text-aerospace-accent opacity-50" />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Create Job Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-aerospace-blue hover:bg-aerospace-blue/80 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Batch Job
          </Button>
        </motion.div>

        {/* Jobs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {jobs.length === 0 ? (
            <Card className="bg-primary/50 border-secondary/30 p-12 text-center">
              <p className="text-secondary-foreground">No batch jobs yet. Create one to get started.</p>
            </Card>
          ) : (
            jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedJob(job)}
                className="cursor-pointer"
              >
                <Card className={`${getStatusBgColor(job.status)} border-secondary/30 p-6 hover:border-secondary/50 transition-all`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {OPERATION_TYPES.find(op => op.type === job.operationType)?.icon}
                        </span>
                        <h3 className="font-heading text-xl font-semibold">{job.name}</h3>
                        <span className={`text-sm font-semibold ${getStatusColor(job.status)}`}>
                          {job.status.toUpperCase()}
                        </span>
                        {job.parametricStudyConfig && (
                          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">
                            Parametric Study
                          </span>
                        )}
                      </div>
                      <p className="text-secondary-foreground text-sm">
                        {job.completedItems} / {job.totalItems} items processed
                        {job.failedItems > 0 && ` • ${job.failedItems} failed`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {job.status === 'processing' && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePauseResume(job.id);
                          }}
                          className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-3 py-2 rounded"
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      {job.status === 'paused' && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePauseResume(job.id);
                          }}
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      {(job.status === 'queued' || job.status === 'processing' || job.status === 'paused') && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(job.id);
                          }}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-secondary-foreground">Progress</span>
                      <span className="text-sm font-semibold text-aerospace-blue">{job.progress}%</span>
                    </div>
                    <div className="w-full bg-primary/50 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-aerospace-blue to-aerospace-accent h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${job.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-secondary-foreground text-xs mb-1">Operation</p>
                      <p className="font-semibold capitalize">{job.operationType}</p>
                    </div>
                    <div>
                      <p className="text-secondary-foreground text-xs mb-1">Created</p>
                      <p className="font-semibold">{new Date(job.createdAt).toLocaleTimeString()}</p>
                    </div>
                    {job.estimatedTimeRemaining > 0 && (
                      <div>
                        <p className="text-secondary-foreground text-xs mb-1">Est. Time Left</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.estimatedTimeRemaining}s
                        </p>
                      </div>
                    )}
                    {job.results && (
                      <div>
                        <p className="text-secondary-foreground text-xs mb-1">Duration</p>
                        <p className="font-semibold">
                          {(job.results.totalProcessingTime / 1000).toFixed(1)}s
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Job Detail Panel */}
        <AnimatePresence>
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12 pt-12 border-t border-secondary/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-3xl font-bold">Job Details: {selectedJob.name}</h2>
                {(selectedJob.status === 'completed' || selectedJob.status === 'failed') && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleExportResults(selectedJob.id, 'json')}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded flex items-center gap-2"
                    >
                      <FileJson className="w-4 h-4" />
                      JSON
                    </Button>
                    <Button
                      onClick={() => handleExportResults(selectedJob.id, 'csv')}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      CSV
                    </Button>
                  </div>
                )}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {selectedJob.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className={`${getStatusBgColor(item.status)} border-secondary/30 p-4`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-sm mb-1">{item.name}</p>
                          <p className="text-xs text-secondary-foreground">{item.designId}</p>
                        </div>
                        {item.status === 'completed' && (
                          <CheckCircle2 className="w-5 h-5 text-aerospace-success flex-shrink-0" />
                        )}
                        {item.status === 'failed' && (
                          <AlertCircle className="w-5 h-5 text-aerospace-danger flex-shrink-0" />
                        )}
                        {item.status === 'processing' && (
                          <div className="w-5 h-5 flex-shrink-0">
                            <LoadingSpinner />
                          </div>
                        )}
                      </div>

                      {item.status === 'processing' && (
                        <div className="mb-3">
                          <div className="w-full bg-primary/50 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                              className="bg-aerospace-blue h-full"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-secondary-foreground">Status:</span>
                          <span className={`font-semibold capitalize ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        {item.duration && (
                          <div className="flex justify-between">
                            <span className="text-secondary-foreground">Duration:</span>
                            <span className="font-semibold">{(item.duration / 1000).toFixed(2)}s</span>
                          </div>
                        )}
                        {item.retryCount !== undefined && item.retryCount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-secondary-foreground">Retries:</span>
                            <span className="font-semibold">{item.retryCount}</span>
                          </div>
                        )}
                        {item.error && (
                          <div className="flex justify-between">
                            <span className="text-secondary-foreground">Error:</span>
                            <span className="font-semibold text-aerospace-danger text-right">{item.error}</span>
                          </div>
                        )}
                      </div>

                      {item.result && (
                        <div className="mt-3 pt-3 border-t border-secondary/20 text-xs">
                          <p className="text-secondary-foreground mb-2">Metrics:</p>
                          <div className="space-y-1">
                            {Object.entries(item.result.metrics || {}).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-secondary-foreground capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className="font-semibold">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Summary Stats */}
              {selectedJob.results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                >
                  <Card className="bg-primary/50 border-secondary/30 p-6">
                    <p className="text-secondary-foreground text-sm mb-2">Successful</p>
                    <p className="text-3xl font-bold text-aerospace-success">
                      {selectedJob.results.successful}
                    </p>
                  </Card>
                  <Card className="bg-primary/50 border-secondary/30 p-6">
                    <p className="text-secondary-foreground text-sm mb-2">Failed</p>
                    <p className="text-3xl font-bold text-aerospace-danger">
                      {selectedJob.results.failed}
                    </p>
                  </Card>
                  <Card className="bg-primary/50 border-secondary/30 p-6">
                    <p className="text-secondary-foreground text-sm mb-2">Success Rate</p>
                    <p className="text-3xl font-bold text-aerospace-success">
                      {selectedJob.results.successRate?.toFixed(1)}%
                    </p>
                  </Card>
                  <Card className="bg-primary/50 border-secondary/30 p-6">
                    <p className="text-secondary-foreground text-sm mb-2">Avg Time</p>
                    <p className="text-3xl font-bold text-aerospace-blue">
                      {(selectedJob.results.averageProcessingTime / 1000).toFixed(2)}s
                    </p>
                  </Card>
                </motion.div>
              )}

              {/* Aggregated Results for Parametric Studies */}
              {selectedJob.aggregatedResults && selectedJob.aggregatedResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <h3 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
                    <Layers className="w-6 h-6" />
                    Aggregated Results
                  </h3>
                  <div className="space-y-4">
                    {selectedJob.aggregatedResults.map((result, idx) => (
                      <Card key={idx} className="bg-primary/50 border-secondary/30 p-6">
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-aerospace-blue mb-2">Parameter Set:</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(result.parameterSet).map(([key, value]) => (
                              <span key={key} className="text-xs bg-secondary/30 px-2 py-1 rounded">
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-secondary-foreground text-xs mb-1">Items</p>
                            <p className="font-semibold">{result.itemCount}</p>
                          </div>
                          <div>
                            <p className="text-secondary-foreground text-xs mb-1">Success Rate</p>
                            <p className="font-semibold text-aerospace-success">{result.successRate.toFixed(1)}%</p>
                          </div>
                          {Object.entries(result.metrics).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-secondary-foreground text-xs mb-1 capitalize">{key}</p>
                              <p className="font-semibold">{typeof value === 'number' ? value.toFixed(2) : value}</p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Job Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-primary border border-secondary/30 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="font-heading text-2xl font-bold mb-6">Create Batch Job</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Job Name</label>
                  <input
                    type="text"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    placeholder="e.g., Export Q1 Designs"
                    className="w-full bg-primary/50 border border-secondary/30 rounded px-3 py-2 text-foreground placeholder-secondary-foreground focus:outline-none focus:border-aerospace-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Operation Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {OPERATION_TYPES.map((op) => (
                      <button
                        key={op.type}
                        onClick={() => setSelectedOperation(op.type)}
                        className={`p-3 rounded border transition-all ${
                          selectedOperation === op.type
                            ? 'border-aerospace-blue bg-aerospace-blue/10'
                            : 'border-secondary/30 hover:border-secondary/50'
                        }`}
                      >
                        <span className="text-xl block mb-1">{op.icon}</span>
                        <span className="text-xs font-semibold">{op.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Number of Items</label>
                  <input
                    type="number"
                    value={itemCount}
                    onChange={(e) => setItemCount(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="1000"
                    className="w-full bg-primary/50 border border-secondary/30 rounded px-3 py-2 text-foreground focus:outline-none focus:border-aerospace-blue"
                  />
                </div>

                <div className="border-t border-secondary/20 pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableParametricStudy}
                      onChange={(e) => setEnableParametricStudy(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Enable Parametric Study</span>
                  </label>
                </div>

                {enableParametricStudy && (
                  <div className="bg-secondary/10 p-4 rounded space-y-3">
                    <p className="text-sm text-secondary-foreground">Configure parametric parameters:</p>
                    {parametricParams.map((param, idx) => (
                      <div key={idx} className="space-y-2 p-3 bg-primary/50 rounded">
                        <input
                          type="text"
                          value={param.name}
                          onChange={(e) => {
                            const newParams = [...parametricParams];
                            newParams[idx].name = e.target.value;
                            setParametricParams(newParams);
                          }}
                          placeholder="Parameter name"
                          className="w-full bg-primary/50 border border-secondary/30 rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-aerospace-blue"
                        />
                        <select
                          value={param.type}
                          onChange={(e) => {
                            const newParams = [...parametricParams];
                            newParams[idx].type = e.target.value as any;
                            setParametricParams(newParams);
                          }}
                          className="w-full bg-primary/50 border border-secondary/30 rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-aerospace-blue"
                        >
                          <option value="range">Range</option>
                          <option value="list">List</option>
                          <option value="logarithmic">Logarithmic</option>
                          <option value="geometric">Geometric</option>
                        </select>
                        {param.type === 'range' && (
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={param.min || 0}
                              onChange={(e) => {
                                const newParams = [...parametricParams];
                                newParams[idx].min = parseFloat(e.target.value);
                                setParametricParams(newParams);
                              }}
                              placeholder="Min"
                              className="bg-primary/50 border border-secondary/30 rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-aerospace-blue"
                            />
                            <input
                              type="number"
                              value={param.max || 10}
                              onChange={(e) => {
                                const newParams = [...parametricParams];
                                newParams[idx].max = parseFloat(e.target.value);
                                setParametricParams(newParams);
                              }}
                              placeholder="Max"
                              className="bg-primary/50 border border-secondary/30 rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-aerospace-blue"
                            />
                            <input
                              type="number"
                              value={param.steps || 5}
                              onChange={(e) => {
                                const newParams = [...parametricParams];
                                newParams[idx].steps = parseInt(e.target.value);
                                setParametricParams(newParams);
                              }}
                              placeholder="Steps"
                              className="bg-primary/50 border border-secondary/30 rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-aerospace-blue"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-secondary/20 hover:bg-secondary/30 text-foreground px-4 py-2 rounded"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createBatchJob}
                  className="flex-1 bg-aerospace-blue hover:bg-aerospace-blue/80 text-white px-4 py-2 rounded"
                >
                  Create Job
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
