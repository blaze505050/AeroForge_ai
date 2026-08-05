import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Pause, Trash2, Download, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Simulation {
  id: string;
  name: string;
  type: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  cpuUsage: number;
  gpuUsage: number;
  estimatedTime: number;
  elapsedTime: number;
  createdAt: Date;
}

interface SimulationManagerProps {
  projectId: string;
}

export default function SimulationManager({ projectId }: SimulationManagerProps) {
  const [simulations, setSimulations] = useState<Simulation[]>([
    {
      id: '1',
      name: 'Airfoil CFD Analysis',
      type: 'CFD',
      status: 'running',
      progress: 65,
      cpuUsage: 78,
      gpuUsage: 92,
      estimatedTime: 3600,
      elapsedTime: 2340,
      createdAt: new Date(Date.now() - 2340000),
    },
    {
      id: '2',
      name: 'Structural Analysis',
      type: 'FEA',
      status: 'queued',
      progress: 0,
      cpuUsage: 0,
      gpuUsage: 0,
      estimatedTime: 1800,
      elapsedTime: 0,
      createdAt: new Date(),
    },
  ]);

  const [showNewSimDialog, setShowNewSimDialog] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);

  const getStatusIcon = (status: Simulation['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-aerospace-success" />;
      case 'running':
        return <Clock className="w-5 h-5 text-aerospace-blue animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-aerospace-danger" />;
      case 'queued':
        return <Clock className="w-5 h-5 text-aerospace-warning" />;
    }
  };

  const getStatusColor = (status: Simulation['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-aerospace-success/10 text-aerospace-success';
      case 'running':
        return 'bg-aerospace-blue/10 text-aerospace-blue';
      case 'failed':
        return 'bg-aerospace-danger/10 text-aerospace-danger';
      case 'queued':
        return 'bg-aerospace-warning/10 text-aerospace-warning';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-primary border border-secondary/20 rounded-lg p-4"
      >
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <p className="text-secondary-foreground">Active Simulations</p>
            <p className="text-2xl font-bold text-foreground">
              {simulations.filter(s => s.status === 'running').length}
            </p>
          </div>
          <div className="w-px h-8 bg-secondary/20" />
          <div className="text-sm">
            <p className="text-secondary-foreground">Queue</p>
            <p className="text-2xl font-bold text-foreground">
              {simulations.filter(s => s.status === 'queued').length}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewSimDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Simulation
        </button>
      </motion.div>

      {/* Simulations List */}
      <div className="space-y-4">
        {simulations.map((sim, index) => (
          <motion.div
            key={sim.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedSimulation(sim.id)}
            className={`bg-primary border border-secondary/20 rounded-lg p-6 cursor-pointer transition-all ${
              selectedSimulation === sim.id ? 'border-aerospace-blue bg-primary/80' : 'hover:border-secondary/40'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1">
                  {getStatusIcon(sim.status)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{sim.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-secondary-foreground">
                    <span className={`px-2 py-1 rounded ${getStatusColor(sim.status)}`}>
                      {sim.status.charAt(0).toUpperCase() + sim.status.slice(1)}
                    </span>
                    <span>{sim.type}</span>
                    <span>Created {new Date(sim.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {sim.status === 'running' && (
                  <button className="p-2 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground">
                    <Pause className="w-5 h-5" />
                  </button>
                )}
                {sim.status === 'queued' && (
                  <button className="p-2 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground">
                    <Play className="w-5 h-5" />
                  </button>
                )}
                {sim.status === 'completed' && (
                  <button className="p-2 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground">
                    <Download className="w-5 h-5" />
                  </button>
                )}
                <button className="p-2 hover:bg-aerospace-danger/20 rounded transition-colors text-secondary-foreground hover:text-aerospace-danger">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {sim.status !== 'queued' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-secondary-foreground">Progress</span>
                  <span className="text-sm font-semibold text-foreground">{sim.progress}%</span>
                </div>
                <Progress value={sim.progress} className="h-2" />
              </div>
            )}

            {/* Resource Usage */}
            {sim.status === 'running' && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-aerospace-dark rounded p-3">
                  <p className="text-xs text-secondary-foreground mb-1">CPU Usage</p>
                  <p className="text-lg font-bold text-aerospace-blue">{sim.cpuUsage}%</p>
                  <Progress value={sim.cpuUsage} className="h-1 mt-2" />
                </div>
                <div className="bg-aerospace-dark rounded p-3">
                  <p className="text-xs text-secondary-foreground mb-1">GPU Usage</p>
                  <p className="text-lg font-bold text-aerospace-accent">{sim.gpuUsage}%</p>
                  <Progress value={sim.gpuUsage} className="h-1 mt-2" />
                </div>
                <div className="bg-aerospace-dark rounded p-3">
                  <p className="text-xs text-secondary-foreground mb-1">Time Remaining</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatTime(sim.estimatedTime - sim.elapsedTime)}
                  </p>
                </div>
              </div>
            )}

            {/* Queued Info */}
            {sim.status === 'queued' && (
              <div className="bg-aerospace-dark rounded p-3">
                <p className="text-sm text-secondary-foreground">
                  Estimated duration: {formatTime(sim.estimatedTime)}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* New Simulation Dialog */}
      {showNewSimDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowNewSimDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-primary border border-secondary/20 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Create New Simulation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Simulation Name</label>
                <input
                  type="text"
                  placeholder="e.g., Airfoil Analysis v2"
                  className="w-full bg-aerospace-dark text-foreground px-3 py-2 rounded border border-secondary/20 focus:border-aerospace-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Simulation Type</label>
                <select className="w-full bg-aerospace-dark text-foreground px-3 py-2 rounded border border-secondary/20 focus:border-aerospace-blue focus:outline-none">
                  <option>CFD Analysis</option>
                  <option>Structural Analysis (FEA)</option>
                  <option>Thermal Analysis</option>
                  <option>Optimization</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowNewSimDialog(false)}
                  className="flex-1 px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-foreground rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowNewSimDialog(false)}
                  className="flex-1 px-4 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
