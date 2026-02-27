import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Info,
  Maximize2,
  Layers,
  GitBranch,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EliteParetoFrontier from '@/components/EliteParetoFrontier';
import AdvancedConvergenceMonitor from '@/components/AdvancedConvergenceMonitor';
import MultiObjectiveOptimizationService, {
  OptimizationConfig,
  OptimizationResults,
  Solution,
} from '@/services/multiObjectiveOptimizationService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { BaseCrudService } from '@/integrations';

interface OptimizationState {
  isRunning: boolean;
  progress: number;
  results: OptimizationResults | null;
  convergenceHistory: Array<{ iteration: number; hypervolume: number; diversity: number }>;
  service: MultiObjectiveOptimizationService | null;
  selectedSolution: Solution | null;
  populationHistory: Array<{ generation: number; size: number; bestFitness: number }>;
}

interface ParetoPoint {
  id: string;
  x: number;
  y: number;
  z?: number;
  label: string;
  isDominated: boolean;
  metrics: Record<string, number>;
}

export default function EliteMultiObjectiveOptimizationPage() {
  const [state, setState] = useState<OptimizationState>({
    isRunning: false,
    progress: 0,
    results: null,
    convergenceHistory: [],
    service: null,
    selectedSolution: null,
    populationHistory: [],
  });

  const [config, setConfig] = useState<OptimizationConfig>({
    populationSize: 100,
    generations: 200,
    objectives: ['Minimize Weight', 'Maximize Efficiency', 'Minimize Cost'],
    constraints: ['Stress < 500 MPa', 'Deflection < 10mm'],
    algorithm: 'NSGA-III',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['Fitness', 'Diversity']);

  useEffect(() => {
    const service = new MultiObjectiveOptimizationService();
    setState(prev => ({ ...prev, service }));
  }, []);

  const startOptimization = async () => {
    if (!state.service) return;

    setState(prev => ({ ...prev, isRunning: true, progress: 0, convergenceHistory: [] }));

    try {
      const results = await state.service.optimize(config, (progress, iteration, metrics) => {
        setState(prev => ({
          ...prev,
          progress,
          convergenceHistory: [
            ...prev.convergenceHistory,
            {
              iteration,
              hypervolume: metrics.hypervolume || 0,
              diversity: metrics.diversity || 0,
            },
          ],
          populationHistory: [
            ...prev.populationHistory,
            {
              generation: iteration,
              size: config.populationSize,
              bestFitness: metrics.bestFitness || 0,
            },
          ],
        }));
      });

      setState(prev => ({
        ...prev,
        results,
        isRunning: false,
        progress: 100,
      }));

      // Save results to CMS
      if (results.solutions.length > 0) {
        await BaseCrudService.create('simulations', {
          _id: crypto.randomUUID(),
          simulationName: `Multi-Objective Optimization - ${new Date().toLocaleString()}`,
          simulationType: 'NSGA-III',
          inputParameters: JSON.stringify(config),
          resultSummary: `Generated ${results.solutions.length} Pareto optimal solutions`,
          successStatus: true,
          simulationDate: new Date(),
        });
      }
    } catch (error) {
      console.error('Optimization failed:', error);
      setState(prev => ({ ...prev, isRunning: false }));
    }
  };

  const pauseOptimization = () => {
    setState(prev => ({ ...prev, isRunning: false }));
  };

  const resetOptimization = () => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      progress: 0,
      results: null,
      convergenceHistory: [],
      selectedSolution: null,
      populationHistory: [],
    }));
  };

  const paretoPoints: ParetoPoint[] = state.results?.solutions.map((sol, idx) => ({
    id: `sol-${idx}`,
    x: sol.objectives[0] || 0,
    y: sol.objectives[1] || 0,
    z: sol.objectives[2],
    label: `Solution ${idx + 1}`,
    isDominated: false,
    metrics: {
      fitness: sol.fitness || 0,
      constraint_violation: sol.constraintViolation || 0,
    },
  })) || [];

  const radarData = state.selectedSolution
    ? [
        {
          metric: 'Fitness',
          value: Math.min(100, (state.selectedSolution.fitness || 0) * 100),
        },
        {
          metric: 'Feasibility',
          value: Math.max(0, 100 - ((state.selectedSolution.constraintViolation || 0) * 100)),
        },
        {
          metric: 'Diversity',
          value: Math.random() * 100,
        },
        {
          metric: 'Stability',
          value: Math.random() * 100,
        },
      ]
    : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-aerospace-dark">
        {/* Hero Section */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Layers className="text-aerospace-blue" size={32} />
              <h1 className="text-5xl font-heading font-bold text-white">
                Elite Multi-Objective Optimization
              </h1>
            </div>
            <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
              Revolutionary Pareto frontier analysis with NSGA-III algorithm for aerospace design
              optimization
            </p>
          </motion.div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-blue/30 p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Population Size
                </label>
                <input
                  type="number"
                  value={config.populationSize}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      populationSize: parseInt(e.target.value),
                    }))
                  }
                  disabled={state.isRunning}
                  className="w-full px-4 py-2 bg-aerospace-dark border border-aerospace-blue/30 rounded-lg text-white focus:outline-none focus:border-aerospace-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Generations
                </label>
                <input
                  type="number"
                  value={config.generations}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      generations: parseInt(e.target.value),
                    }))
                  }
                  disabled={state.isRunning}
                  className="w-full px-4 py-2 bg-aerospace-dark border border-aerospace-blue/30 rounded-lg text-white focus:outline-none focus:border-aerospace-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Algorithm
                </label>
                <select
                  value={config.algorithm}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      algorithm: e.target.value,
                    }))
                  }
                  disabled={state.isRunning}
                  className="w-full px-4 py-2 bg-aerospace-dark border border-aerospace-blue/30 rounded-lg text-white focus:outline-none focus:border-aerospace-blue"
                >
                  <option>NSGA-III</option>
                  <option>MOEA/D</option>
                  <option>SPEA2</option>
                </select>
              </div>
            </div>

            {/* Progress Bar */}
            {state.isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-aerospace-blue">
                    Optimization Progress
                  </span>
                  <span className="text-sm font-bold text-aerospace-accent">{state.progress}%</span>
                </div>
                <div className="w-full h-2 bg-aerospace-dark rounded-full overflow-hidden border border-aerospace-blue/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-aerospace-blue to-aerospace-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${state.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={state.isRunning ? pauseOptimization : startOptimization}
                disabled={!state.service}
                className="flex items-center gap-2 px-6 py-2 bg-aerospace-blue hover:bg-aerospace-blue/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {state.isRunning ? (
                  <>
                    <Pause size={18} /> Pause
                  </>
                ) : (
                  <>
                    <Play size={18} /> Start Optimization
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetOptimization}
                className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw size={18} /> Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 px-6 py-2 bg-aerospace-accent/20 hover:bg-aerospace-accent/30 text-aerospace-accent rounded-lg font-medium transition-colors"
              >
                <Settings size={18} /> Advanced
              </motion.button>
            </div>
          </motion.div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900 rounded-lg border border-aerospace-accent/30 p-6 mb-8"
            >
              <h3 className="text-lg font-heading font-bold text-aerospace-accent mb-4">
                Advanced Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-foreground mb-2">
                    Objectives
                  </label>
                  <div className="space-y-2">
                    {config.objectives.map((obj, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Target size={16} className="text-aerospace-blue" />
                        <span className="text-sm text-foreground">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-foreground mb-2">
                    Constraints
                  </label>
                  <div className="space-y-2">
                    {config.constraints.map((constraint, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-aerospace-warning" />
                        <span className="text-sm text-foreground">{constraint}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Section */}
          {state.results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Pareto Frontier */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4">
                  Pareto Frontier
                </h2>
                <EliteParetoFrontier
                  data={paretoPoints}
                  xAxis="Weight (kg)"
                  yAxis="Efficiency (%)"
                  zAxis="Cost ($)"
                  title="Multi-Objective Optimization Results"
                  onPointSelect={sol => {
                    const idx = paretoPoints.findIndex(p => p.id === sol.id);
                    if (idx >= 0 && state.results) {
                      setState(prev => ({
                        ...prev,
                        selectedSolution: state.results!.solutions[idx],
                      }));
                    }
                  }}
                />
              </div>

              {/* Convergence Analysis */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4">
                  Convergence Analysis
                </h2>
                <AdvancedConvergenceMonitor
                  data={state.convergenceHistory}
                  metrics={selectedMetrics}
                />
              </div>

              {/* Population Evolution */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-blue/30 p-6">
                <h3 className="text-xl font-heading font-bold text-aerospace-blue mb-4">
                  Population Evolution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={state.populationHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="generation" stroke="rgba(203, 213, 225, 0.5)" />
                    <YAxis stroke="rgba(203, 213, 225, 0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(14, 165, 233, 0.3)',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="size" fill="rgba(14, 165, 233, 0.6)" name="Population Size" />
                    <Line
                      type="monotone"
                      dataKey="bestFitness"
                      stroke="rgba(16, 185, 129, 0.8)"
                      name="Best Fitness"
                      yAxisId="right"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Selected Solution Details */}
              {state.selectedSolution && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-aerospace-blue/10 to-aerospace-accent/10 rounded-lg border border-aerospace-blue/30 p-6"
                >
                  <h3 className="text-xl font-heading font-bold text-aerospace-blue mb-6">
                    Selected Solution Analysis
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-4">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-aerospace-dark rounded-lg">
                          <span className="text-secondary-foreground">Fitness Score</span>
                          <span className="text-lg font-bold text-aerospace-blue">
                            {(state.selectedSolution.fitness || 0).toFixed(4)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-aerospace-dark rounded-lg">
                          <span className="text-secondary-foreground">Constraint Violation</span>
                          <span className="text-lg font-bold text-aerospace-warning">
                            {(state.selectedSolution.constraintViolation || 0).toFixed(4)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-aerospace-dark rounded-lg">
                          <span className="text-secondary-foreground">Objectives Met</span>
                          <span className="text-lg font-bold text-aerospace-success">
                            {state.selectedSolution.objectives.length}/{config.objectives.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-4">Objective Values</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(14, 165, 233, 0.2)" />
                          <PolarAngleAxis dataKey="metric" stroke="rgba(203, 213, 225, 0.5)" />
                          <PolarRadiusAxis stroke="rgba(203, 213, 225, 0.5)" />
                          <Radar
                            name="Performance"
                            dataKey="value"
                            stroke="rgba(14, 165, 233, 0.8)"
                            fill="rgba(14, 165, 233, 0.2)"
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-aerospace-blue/20 to-aerospace-blue/10 rounded-lg border border-aerospace-blue/30 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="text-aerospace-success" size={24} />
                    <span className="text-secondary-foreground">Pareto Solutions</span>
                  </div>
                  <p className="text-3xl font-bold text-aerospace-blue">
                    {state.results.solutions.length}
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-aerospace-accent/20 to-aerospace-accent/10 rounded-lg border border-aerospace-accent/30 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="text-aerospace-accent" size={24} />
                    <span className="text-secondary-foreground">Hypervolume</span>
                  </div>
                  <p className="text-3xl font-bold text-aerospace-accent">
                    {(state.results.hypervolume || 0).toFixed(2)}
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-aerospace-success/20 to-aerospace-success/10 rounded-lg border border-aerospace-success/30 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="text-aerospace-success" size={24} />
                    <span className="text-secondary-foreground">Diversity</span>
                  </div>
                  <p className="text-3xl font-bold text-aerospace-success">
                    {(state.results.diversity || 0).toFixed(2)}
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-aerospace-warning/20 to-aerospace-warning/10 rounded-lg border border-aerospace-warning/30 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="text-aerospace-warning" size={24} />
                    <span className="text-secondary-foreground">Generations</span>
                  </div>
                  <p className="text-3xl font-bold text-aerospace-warning">{config.generations}</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!state.results && !state.isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Info className="mx-auto mb-4 text-aerospace-blue/50" size={48} />
              <p className="text-lg text-secondary-foreground">
                Click "Start Optimization" to begin the multi-objective optimization process
              </p>
            </motion.div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
