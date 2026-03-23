import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { performanceMetrics } from '@/services/performanceOptimization';

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const stats = performanceMetrics.getAllStats();
      setMetrics(stats);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-aerospace-blue/20 border border-aerospace-blue/40 rounded-lg text-aerospace-blue hover:bg-aerospace-blue/30 transition-colors z-40"
        title="Show Performance Metrics"
      >
        <Activity className="w-5 h-5" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 w-80 bg-primary border border-aerospace-blue/30 rounded-lg p-4 shadow-lg z-50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-aerospace-blue" />
          <h3 className="font-heading font-bold text-foreground">Performance</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-foreground/50 hover:text-foreground transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {Object.entries(metrics).length === 0 ? (
          <p className="text-sm text-foreground/50 font-mono">No metrics recorded</p>
        ) : (
          Object.entries(metrics).map(([label, stats]: [string, any]) => (
            <div key={label} className="p-3 bg-aerospace-dark/50 rounded border border-secondary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-aerospace-blue uppercase">
                  {label}
                </span>
                <span className="text-xs font-mono text-foreground/70">
                  {stats?.count || 0} calls
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-foreground/50">Avg:</span>
                  <span className="ml-1 text-aerospace-accent font-mono">
                    {stats?.avg || 0}ms
                  </span>
                </div>
                <div>
                  <span className="text-foreground/50">Max:</span>
                  <span className="ml-1 text-aerospace-warning font-mono">
                    {stats?.max || 0}ms
                  </span>
                </div>
                <div>
                  <span className="text-foreground/50">P95:</span>
                  <span className="ml-1 text-aerospace-accent font-mono">
                    {stats?.p95 || 0}ms
                  </span>
                </div>
                <div>
                  <span className="text-foreground/50">P99:</span>
                  <span className="ml-1 text-aerospace-warning font-mono">
                    {stats?.p99 || 0}ms
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-secondary/20 flex gap-2">
        <button
          onClick={() => {
            performanceMetrics.clear();
            setMetrics({});
          }}
          className="flex-1 px-3 py-2 bg-aerospace-blue/10 border border-aerospace-blue/30 text-aerospace-blue hover:bg-aerospace-blue/20 transition-colors rounded text-xs font-mono font-bold"
        >
          Clear
        </button>
      </div>
    </motion.div>
  );
}
