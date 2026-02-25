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
  LineChart as LineChartIcon,
  AlertCircle,
  CheckCircle2,
  Info,
  Grid3x3,
  Maximize2,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  ScatterChart,
  Scatter,
  ComposedChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import { BaseCrudService } from '@/integrations';

interface OptimizationState {
  isRunning: boolean;
  progress: number;
  results: OptimizationResults | null;
  service: MultiObjectiveOptimizationService | null;
  currentGeneration: number;
}

export default function MultiObjectiveOptimizationPage() {
  const [config, setConfig] = useState<OptimizationConfig>({
    populationSize: 100,
    generations: 50,
    crossoverRate: 0.9,
    mutationRate: 0.1,
    objectives: [
      { name: 'Drag', type: 'minimize', weight: 1 },
      { name: 'Lift', type: 'maximize', weight: 1 },
      { name: 'Weight', type: 'minimize', weight: 0.8 },
      { name: 'Efficiency', type: 'maximize', weight: 1.2 },
    ],
    variables: [
      { name: 'Wing Area', min: 50, max: 200, value: 120 },
      { name: 'Aspect Ratio', min: 5, max: 15, value: 9 },
      { name: 'Sweep Angle', min: 0, max: 45, value: 25 },
      { name: 'Thickness', min: 8, max: 18, value: 12 },
    ],
  });

  const [state, setState] = useState<OptimizationState>({
    isRunning: false,
    progress: 0,
    results: null,
    service: null,
    currentGeneration: 0,
  });

  const [activeTab, setActiveTab] = useState<'setup' | 'pareto' | 'analysis'>('setup');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);

  const handleRunOptimization = async () => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      progress: 0,
      currentGeneration: 0,
    }));

    const service = new MultiObjectiveOptimizationService(config);
    setState((prev) => ({ ...prev, service }));

    // Simulate generation-by-generation progress
    let currentGen = 0;
    const maxGen = config.generations;

    const progressInterval = setInterval(() => {
      currentGen += 1;
      const progress = (currentGen / maxGen) * 100;

      setState((prev) => ({
        ...prev,
        progress,
        currentGeneration: currentGen,
      }));

      if (currentGen >= maxGen) {
        clearInterval(progressInterval);

        const results = service.optimize();

        setState((prev) => ({
          ...prev,
          isRunning: false,
          progress: 100,
          results,
        }));

        setActiveTab('pareto');
      }
    }, 100);
  };

  const handleReset = () => {
    setState({
      isRunning: false,
      progress: 0,
      results: null,
      service: null,
      currentGeneration: 0,
    });
    setSelectedSolution(null);
  };

  const handleSaveResults = async () => {
    if (!state.results) return;

    setIsSaving(true);
    try {
      const paretoFrontData = state.results.paretoFront.map((sol) => ({
        variables: sol.variables.map((v) => `${v.name}: ${v.value.toFixed(2)}`).join(', '),
        objectives: Object.entries(sol.objectives)
          .map(([k, v]) => `${k}: ${v.toFixed(4)}`)
          .join(', '),
      }));

      await BaseCrudService.create('simulations', {
        _id: crypto.randomUUID(),
        simulationName: `Multi-Objective Optimization - ${state.results.paretoFront.length} Solutions`,
        simulationType: 'Multi-Objective Optimization',
        inputParameters: JSON.stringify({
          populationSize: config.populationSize,
          generations: config.generations,
          objectives: config.objectives,
        }),
        resultSummary: JSON.stringify({
          paretoFrontSize: state.results.paretoFront.length,
          statistics: state.results.statistics,
          topSolutions: paretoFrontData.slice(0, 5),
        }),
        successStatus: true,
        simulationDate: new Date().toISOString(),
      });

      alert('Results saved successfully!');
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Failed to save results');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadResults = () => {
    if (!state.results) return;

    const csv = `Multi-Objective Optimization Results
Generated: ${new Date().toISOString()}
Population Size: ${config.populationSize}
Generations: ${config.generations}

PARETO FRONT SOLUTIONS
${state.results.paretoFront
  .map(
    (sol) =>
      `${sol.variables.map((v) => v.value.toFixed(2)).join(',')}|${Object.values(sol.objectives)
        .map((v) => v.toFixed(4))
        .join(',')}`
  )
  .join('\n')}

OPTIMIZATION STATISTICS
Best Fitness,${state.results.statistics.bestFitness.toFixed(6)}
Average Fitness,${state.results.statistics.averageFitness.toFixed(6)}
Diversity Metric,${state.results.statistics.diversity.toFixed(6)}
Spread Metric,${state.results.statistics.spreadMetric.toFixed(6)}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moo_results_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Prepare Pareto front data for 2D scatter plot
  const paretoScatterData =
    state.results?.paretoFront.map((sol, idx) => ({
      id: idx,
      drag: sol.objectives['Drag'],
      lift: sol.objectives['Lift'],
      weight: sol.objectives['Weight'],
      efficiency: sol.objectives['Efficiency'],
      rank: sol.rank,
    })) || [];

  // Prepare design space data
  const designSpaceData =
    state.results?.getDesignSpace?.().map((sol, idx) => ({
      id: idx,
      wingArea: sol.variables[0].value,
      aspectRatio: sol.variables[1].value,
      paretoFront: sol.paretoFront,
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="w-full max-w-[120rem] mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-2">
              Multi-Objective Optimization
            </h1>
            <p className="font-paragraph text-lg text-slate-400 mb-4">
              NSGA-II based Pareto optimization for aerospace design with advanced visualization
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm text-blue-300">
                Genetic Algorithm
              </span>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-sm text-green-300">
                Pareto Front
              </span>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm text-purple-300">
                Design Space Exploration
              </span>
              <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-sm text-orange-300">
                Production Grade
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 border-b border-slate-700">
            {(['setup', 'pareto', 'analysis'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-paragraph font-semibold transition-colors ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'setup' && 'Setup'}
                {tab === 'pareto' && 'Pareto Front'}
                {tab === 'analysis' && 'Analysis'}
              </button>
            ))}
          </div>

          {/* Setup Tab */}
          {activeTab === 'setup' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Configuration Panel */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
                  <h2 className="font-heading text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuration
                  </h2>

                  <div className="space-y-6">
                    {/* Population Size */}
                    <div>
                      <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                        Population Size: {config.populationSize}
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        step="10"
                        value={config.populationSize}
                        onChange={(e) =>
                          setConfig({ ...config, populationSize: parseInt(e.target.value) })
                        }
                        disabled={state.isRunning}
                        className="w-full"
                      />
                    </div>

                    {/* Generations */}
                    <div>
                      <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                        Generations: {config.generations}
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={config.generations}
                        onChange={(e) =>
                          setConfig({ ...config, generations: parseInt(e.target.value) })
                        }
                        disabled={state.isRunning}
                        className="w-full"
                      />
                    </div>

                    {/* Crossover Rate */}
                    <div>
                      <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                        Crossover Rate: {config.crossoverRate.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="1"
                        step="0.05"
                        value={config.crossoverRate}
                        onChange={(e) =>
                          setConfig({ ...config, crossoverRate: parseFloat(e.target.value) })
                        }
                        disabled={state.isRunning}
                        className="w-full"
                      />
                    </div>

                    {/* Mutation Rate */}
                    <div>
                      <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                        Mutation Rate: {config.mutationRate.toFixed(3)}
                      </label>
                      <input
                        type="range"
                        min="0.01"
                        max="0.3"
                        step="0.01"
                        value={config.mutationRate}
                        onChange={(e) =>
                          setConfig({ ...config, mutationRate: parseFloat(e.target.value) })
                        }
                        disabled={state.isRunning}
                        className="w-full"
                      />
                    </div>

                    {/* Design Variables */}
                    <div className="border-t border-slate-700 pt-4">
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors"
                      >
                        {showAdvanced ? '▼ Design Variables' : '▶ Design Variables'}
                      </button>

                      {showAdvanced && (
                        <div className="mt-4 space-y-3">
                          {config.variables.map((v, idx) => (
                            <div key={idx}>
                              <label className="font-paragraph text-xs font-semibold text-slate-400 block mb-1">
                                {v.name}: {v.value.toFixed(2)}
                              </label>
                              <input
                                type="range"
                                min={v.min}
                                max={v.max}
                                step={(v.max - v.min) / 100}
                                value={v.value}
                                onChange={(e) => {
                                  const newVars = [...config.variables];
                                  newVars[idx].value = parseFloat(e.target.value);
                                  setConfig({ ...config, variables: newVars });
                                }}
                                disabled={state.isRunning}
                                className="w-full"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Control Buttons */}
                    <div className="space-y-3 pt-4 border-t border-slate-700">
                      <button
                        onClick={handleRunOptimization}
                        disabled={state.isRunning}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-lg font-paragraph font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        {state.isRunning ? (
                          <>
                            <Pause className="w-5 h-5" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Run Optimization
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleReset}
                        className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-paragraph font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                      {state.results && (
                        <>
                          <button
                            onClick={handleSaveResults}
                            disabled={isSaving}
                            className="w-full py-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 text-white rounded-lg font-paragraph font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {isSaving ? 'Saving...' : 'Save to CMS'}
                          </button>
                          <button
                            onClick={handleDownloadResults}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-paragraph font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download CSV
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Panel */}
              <div className="lg:col-span-3 space-y-6">
                {/* Progress Monitor */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                >
                  <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Optimization Progress
                  </h3>

                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-paragraph text-sm text-slate-300">Overall Progress</span>
                        <span className="font-heading font-bold text-blue-400">
                          {state.progress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${state.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Generation Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                        <p className="font-paragraph text-xs text-slate-400 mb-1">Current Generation</p>
                        <p className="font-heading text-2xl font-bold text-blue-400">
                          {state.currentGeneration}/{config.generations}
                        </p>
                      </div>
                      <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                        <p className="font-paragraph text-xs text-slate-400 mb-1">Population Size</p>
                        <p className="font-heading text-2xl font-bold text-green-400">
                          {config.populationSize}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Algorithm Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                >
                  <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Algorithm Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-paragraph text-slate-400">Algorithm:</span>
                      <span className="font-paragraph font-semibold text-white">NSGA-II</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-paragraph text-slate-400">Objectives:</span>
                      <span className="font-paragraph font-semibold text-white">
                        {config.objectives.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-paragraph text-slate-400">Design Variables:</span>
                      <span className="font-paragraph font-semibold text-white">
                        {config.variables.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-paragraph text-slate-400">Crossover Operator:</span>
                      <span className="font-paragraph font-semibold text-white">SBX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-paragraph text-slate-400">Mutation Operator:</span>
                      <span className="font-paragraph font-semibold text-white">Polynomial</span>
                    </div>
                  </div>
                </motion.div>

                {/* Objectives */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                >
                  <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Optimization Objectives
                  </h3>
                  <div className="space-y-2">
                    {config.objectives.map((obj, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-900 rounded">
                        <span className="font-paragraph text-sm text-slate-300">{obj.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-paragraph text-xs text-slate-500">
                            {obj.type === 'minimize' ? '↓ Minimize' : '↑ Maximize'}
                          </span>
                          <span className="font-heading text-sm font-bold text-blue-400">
                            w={obj.weight.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Pareto Front Tab */}
          {activeTab === 'pareto' && state.results && (
            <div className="space-y-8">
              {/* Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                {[
                  {
                    label: 'Pareto Front Size',
                    value: state.results.paretoFront.length,
                    icon: Target,
                  },
                  {
                    label: 'Best Fitness',
                    value: state.results.statistics.bestFitness.toFixed(4),
                    icon: Zap,
                  },
                  {
                    label: 'Diversity',
                    value: state.results.statistics.diversity.toFixed(2),
                    icon: Grid3x3,
                  },
                  {
                    label: 'Spread',
                    value: state.results.statistics.spreadMetric.toFixed(4),
                    icon: Maximize2,
                  },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-paragraph text-sm text-slate-400">{stat.label}</span>
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="font-heading text-3xl font-bold text-white">{stat.value}</p>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Pareto Front 2D Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Pareto Front: Drag vs Lift
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="drag"
                      type="number"
                      stroke="#94a3b8"
                      label={{ value: 'Drag Coefficient', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis
                      dataKey="lift"
                      stroke="#94a3b8"
                      label={{ value: 'Lift Coefficient', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Scatter
                      name="Pareto Front"
                      data={paretoScatterData}
                      fill="#0EA5E9"
                      fillOpacity={0.8}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Weight vs Efficiency */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5" />
                  Pareto Front: Weight vs Efficiency
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="weight"
                      type="number"
                      stroke="#94a3b8"
                      label={{ value: 'Weight (kg)', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis
                      dataKey="efficiency"
                      stroke="#94a3b8"
                      label={{ value: 'Efficiency (L/D)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Scatter
                      name="Pareto Front"
                      data={paretoScatterData}
                      fill="#10B981"
                      fillOpacity={0.8}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Convergence History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Hypervolume Convergence
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={state.results.convergenceHistory}>
                    <defs>
                      <linearGradient id="hvGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="generation"
                      stroke="#94a3b8"
                      label={{ value: 'Generation', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      label={{ value: 'Hypervolume', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="hypervolume"
                      stroke="#0EA5E9"
                      fill="url(#hvGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Pareto Front Solutions Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 overflow-x-auto"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4">
                  Top Pareto Front Solutions
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 font-paragraph font-semibold text-slate-300">
                          ID
                        </th>
                        <th className="text-left py-3 px-4 font-paragraph font-semibold text-slate-300">
                          Drag
                        </th>
                        <th className="text-left py-3 px-4 font-paragraph font-semibold text-slate-300">
                          Lift
                        </th>
                        <th className="text-left py-3 px-4 font-paragraph font-semibold text-slate-300">
                          Weight
                        </th>
                        <th className="text-left py-3 px-4 font-paragraph font-semibold text-slate-300">
                          Efficiency
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.results.paretoFront.slice(0, 10).map((sol, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors"
                          onClick={() => setSelectedSolution(sol)}
                        >
                          <td className="py-3 px-4 font-paragraph text-slate-300">{idx + 1}</td>
                          <td className="py-3 px-4 font-paragraph text-blue-400">
                            {sol.objectives['Drag'].toFixed(4)}
                          </td>
                          <td className="py-3 px-4 font-paragraph text-green-400">
                            {sol.objectives['Lift'].toFixed(4)}
                          </td>
                          <td className="py-3 px-4 font-paragraph text-yellow-400">
                            {sol.objectives['Weight'].toFixed(2)}
                          </td>
                          <td className="py-3 px-4 font-paragraph text-purple-400">
                            {sol.objectives['Efficiency'].toFixed(4)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && state.results && (
            <div className="space-y-8">
              {/* Design Space Exploration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Grid3x3 className="w-5 h-5" />
                  Design Space Exploration
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="wingArea"
                      type="number"
                      stroke="#94a3b8"
                      label={{ value: 'Wing Area (m²)', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis
                      dataKey="aspectRatio"
                      stroke="#94a3b8"
                      label={{ value: 'Aspect Ratio', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Scatter
                      name="All Solutions"
                      data={designSpaceData.filter((d) => !d.paretoFront)}
                      fill="#475569"
                      fillOpacity={0.3}
                    />
                    <Scatter
                      name="Pareto Front"
                      data={designSpaceData.filter((d) => d.paretoFront)}
                      fill="#0EA5E9"
                      fillOpacity={0.9}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Selected Solution Details */}
              {selectedSolution && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                >
                  <h3 className="font-heading text-lg font-bold text-white mb-4">
                    Selected Solution Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Design Variables */}
                    <div>
                      <h4 className="font-paragraph font-semibold text-white mb-3">Design Variables</h4>
                      <div className="space-y-2">
                        {selectedSolution.variables.map((v, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between p-2 bg-slate-900 rounded border border-slate-700"
                          >
                            <span className="font-paragraph text-slate-400">{v.name}</span>
                            <span className="font-heading font-bold text-blue-400">
                              {v.value.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Objectives */}
                    <div>
                      <h4 className="font-paragraph font-semibold text-white mb-3">Objectives</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedSolution.objectives).map(([name, value], idx) => (
                          <div
                            key={idx}
                            className="flex justify-between p-2 bg-slate-900 rounded border border-slate-700"
                          >
                            <span className="font-paragraph text-slate-400">{name}</span>
                            <span className="font-heading font-bold text-green-400">
                              {(value as number).toFixed(4)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Export Options */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="font-heading text-lg font-bold text-white mb-4">Export Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleDownloadResults}
                    className="py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-paragraph font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV
                  </button>
                  <button
                    onClick={handleSaveResults}
                    disabled={isSaving}
                    className="py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 text-white rounded-lg font-paragraph font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save to CMS'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!state.results && activeTab !== 'setup' && (
            <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="font-heading text-lg font-bold text-white mb-2">No Results Yet</h3>
              <p className="font-paragraph text-slate-400">
                Run an optimization to see Pareto front and analysis
              </p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
