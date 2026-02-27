import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings,
  Wind,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Info,
  Maximize2,
  GitCompare,
  Zap,
  Layers,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TurbulenceModelingService, {
  TurbulenceModelConfig,
  TurbulenceResults,
} from '@/services/turbulenceModelingService';
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
  BarChart,
} from 'recharts';
import { BaseCrudService } from '@/integrations';

interface SimulationState {
  isRunning: boolean;
  convergence: number;
  results: TurbulenceResults | null;
  convergenceHistory: Array<{ iteration: number; residual: number; kinetic_energy: number }>;
  service: TurbulenceModelingService | null;
  selectedModel: string;
  comparisonData: Array<{
    model: string;
    accuracy: number;
    speed: number;
    stability: number;
  }>;
}

export default function TurbulenceModelingResearchLabPage() {
  const [state, setState] = useState<SimulationState>({
    isRunning: false,
    convergence: 0,
    results: null,
    convergenceHistory: [],
    service: null,
    selectedModel: 'k-epsilon',
    comparisonData: [
      { model: 'k-epsilon', accuracy: 85, speed: 95, stability: 88 },
      { model: 'k-omega', accuracy: 92, speed: 80, stability: 85 },
      { model: 'LES', accuracy: 98, speed: 40, stability: 75 },
      { model: 'DNS', accuracy: 100, speed: 10, stability: 70 },
    ],
  });

  const [config, setConfig] = useState<TurbulenceModelConfig>({
    model: 'k-epsilon',
    reynoldsNumber: 10000,
    meshResolution: 'medium',
    timeStep: 0.001,
    maxIterations: 1000,
  });

  const [showComparison, setShowComparison] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const service = new TurbulenceModelingService();
    setState(prev => ({ ...prev, service }));
  }, []);

  const startSimulation = async () => {
    if (!state.service) return;

    setState(prev => ({ ...prev, isRunning: true, convergence: 0, convergenceHistory: [] }));

    try {
      const results = await state.service.simulate(config, (progress, iteration, residual) => {
        setState(prev => ({
          ...prev,
          convergence: progress,
          convergenceHistory: [
            ...prev.convergenceHistory,
            {
              iteration,
              residual,
              kinetic_energy: Math.sin(iteration * 0.01) * Math.exp(-iteration * 0.001) + 0.5,
            },
          ],
        }));
      });

      setState(prev => ({
        ...prev,
        results,
        isRunning: false,
        convergence: 100,
      }));

      // Save to CMS
      if (results) {
        await BaseCrudService.create('simulations', {
          _id: crypto.randomUUID(),
          simulationName: `Turbulence Model ${config.model} - ${new Date().toLocaleString()}`,
          simulationType: config.model.toUpperCase(),
          inputParameters: JSON.stringify(config),
          resultSummary: `Reynolds Number: ${config.reynoldsNumber}, Mesh: ${config.meshResolution}`,
          successStatus: true,
          simulationDate: new Date(),
        });
      }
    } catch (error) {
      console.error('Simulation failed:', error);
      setState(prev => ({ ...prev, isRunning: false }));
    }
  };

  const pauseSimulation = () => {
    setState(prev => ({ ...prev, isRunning: false }));
  };

  const resetSimulation = () => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      convergence: 0,
      results: null,
      convergenceHistory: [],
    }));
  };

  const modelDescriptions: Record<string, { description: string; applications: string[] }> = {
    'k-epsilon': {
      description: 'Two-equation model for high Reynolds number flows',
      applications: ['External aerodynamics', 'Industrial flows', 'General purpose'],
    },
    'k-omega': {
      description: 'Two-equation model with superior wall-bounded flow prediction',
      applications: ['Boundary layers', 'Separated flows', 'Wing aerodynamics'],
    },
    LES: {
      description: 'Large Eddy Simulation for transient flow phenomena',
      applications: ['Unsteady flows', 'Vortex dynamics', 'Noise prediction'],
    },
    DNS: {
      description: 'Direct Numerical Simulation for fundamental research',
      applications: ['Turbulence research', 'Validation studies', 'High-fidelity analysis'],
    },
  };

  const radarData = [
    { metric: 'Accuracy', value: state.comparisonData.find(m => m.model === state.selectedModel)?.accuracy || 0 },
    { metric: 'Speed', value: state.comparisonData.find(m => m.model === state.selectedModel)?.speed || 0 },
    { metric: 'Stability', value: state.comparisonData.find(m => m.model === state.selectedModel)?.stability || 0 },
  ];

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
              <Wind className="text-aerospace-blue" size={32} />
              <h1 className="text-5xl font-heading font-bold text-white">
                Turbulence Modeling Research Lab
              </h1>
            </div>
            <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
              Interactive comparison of advanced turbulence models with real-time convergence
              monitoring
            </p>
          </motion.div>

          {/* Model Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            {['k-epsilon', 'k-omega', 'LES', 'DNS'].map(model => (
              <motion.button
                key={model}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setConfig(prev => ({ ...prev, model }));
                  setState(prev => ({ ...prev, selectedModel: model }));
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  state.selectedModel === model
                    ? 'border-aerospace-blue bg-aerospace-blue/10'
                    : 'border-aerospace-blue/30 bg-slate-900 hover:border-aerospace-blue/50'
                }`}
              >
                <h3 className="font-bold text-white mb-2">{model.toUpperCase()}</h3>
                <p className="text-xs text-secondary-foreground">
                  {modelDescriptions[model]?.description}
                </p>
              </motion.button>
            ))}
          </motion.div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-blue/30 p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Reynolds Number
                </label>
                <input
                  type="number"
                  value={config.reynoldsNumber}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      reynoldsNumber: parseInt(e.target.value),
                    }))
                  }
                  disabled={state.isRunning}
                  className="w-full px-4 py-2 bg-aerospace-dark border border-aerospace-blue/30 rounded-lg text-white focus:outline-none focus:border-aerospace-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Mesh Resolution
                </label>
                <select
                  value={config.meshResolution}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      meshResolution: e.target.value,
                    }))
                  }
                  disabled={state.isRunning}
                  className="w-full px-4 py-2 bg-aerospace-dark border border-aerospace-blue/30 rounded-lg text-white focus:outline-none focus:border-aerospace-blue"
                >
                  <option>coarse</option>
                  <option>medium</option>
                  <option>fine</option>
                  <option>ultra-fine</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Time Step
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={config.timeStep}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      timeStep: parseFloat(e.target.value),
                    }))
                  }
                  disabled={state.isRunning}
                  className="w-full px-4 py-2 bg-aerospace-dark border border-aerospace-blue/30 rounded-lg text-white focus:outline-none focus:border-aerospace-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Max Iterations
                </label>
                <input
                  type="number"
                  value={config.maxIterations}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      maxIterations: parseInt(e.target.value),
                    }))
                  }
                  disabled={state.isRunning}
                  className="w-full px-4 py-2 bg-aerospace-dark border border-aerospace-blue/30 rounded-lg text-white focus:outline-none focus:border-aerospace-blue"
                />
              </div>
            </div>

            {/* Progress */}
            {state.isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-aerospace-blue">Convergence</span>
                  <span className="text-sm font-bold text-aerospace-accent">{state.convergence}%</span>
                </div>
                <div className="w-full h-2 bg-aerospace-dark rounded-full overflow-hidden border border-aerospace-blue/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-aerospace-blue to-aerospace-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${state.convergence}%` }}
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
                onClick={state.isRunning ? pauseSimulation : startSimulation}
                disabled={!state.service}
                className="flex items-center gap-2 px-6 py-2 bg-aerospace-blue hover:bg-aerospace-blue/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {state.isRunning ? (
                  <>
                    <Pause size={18} /> Pause
                  </>
                ) : (
                  <>
                    <Play size={18} /> Start Simulation
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetSimulation}
                className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw size={18} /> Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowComparison(!showComparison)}
                className="flex items-center gap-2 px-6 py-2 bg-aerospace-accent/20 hover:bg-aerospace-accent/30 text-aerospace-accent rounded-lg font-medium transition-colors"
              >
                <GitCompare size={18} /> Compare Models
              </motion.button>
            </div>
          </motion.div>

          {/* Results Section */}
          {state.results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              {/* Convergence History */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-blue/30 p-6">
                <h3 className="text-xl font-heading font-bold text-aerospace-blue mb-4">
                  Convergence History
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={state.convergenceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                    <XAxis dataKey="iteration" stroke="rgba(203, 213, 225, 0.5)" />
                    <YAxis stroke="rgba(203, 213, 225, 0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(14, 165, 233, 0.3)',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="residual"
                      fill="rgba(14, 165, 233, 0.1)"
                      stroke="rgba(14, 165, 233, 0.8)"
                      name="Residual"
                    />
                    <Line
                      type="monotone"
                      dataKey="kinetic_energy"
                      stroke="rgba(16, 185, 129, 0.8)"
                      name="Kinetic Energy"
                      yAxisId="right"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Model Performance Radar */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-accent/30 p-6">
                <h3 className="text-xl font-heading font-bold text-aerospace-accent mb-4">
                  Model Performance Profile
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(14, 165, 233, 0.2)" />
                    <PolarAngleAxis dataKey="metric" stroke="rgba(203, 213, 225, 0.5)" />
                    <PolarRadiusAxis stroke="rgba(203, 213, 225, 0.5)" />
                    <Radar
                      name={state.selectedModel.toUpperCase()}
                      dataKey="value"
                      stroke="rgba(14, 165, 233, 0.8)"
                      fill="rgba(14, 165, 233, 0.2)"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Results Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-aerospace-blue/20 to-aerospace-blue/10 rounded-lg border border-aerospace-blue/30 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="text-aerospace-success" size={24} />
                    <span className="text-secondary-foreground">Convergence</span>
                  </div>
                  <p className="text-3xl font-bold text-aerospace-blue">
                    {state.convergence.toFixed(1)}%
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-aerospace-accent/20 to-aerospace-accent/10 rounded-lg border border-aerospace-accent/30 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="text-aerospace-accent" size={24} />
                    <span className="text-secondary-foreground">Residual</span>
                  </div>
                  <p className="text-3xl font-bold text-aerospace-accent">
                    {state.results.residual?.toFixed(6) || 'N/A'}
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-aerospace-success/20 to-aerospace-success/10 rounded-lg border border-aerospace-success/30 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="text-aerospace-success" size={24} />
                    <span className="text-secondary-foreground">Iterations</span>
                  </div>
                  <p className="text-3xl font-bold text-aerospace-success">
                    {state.convergenceHistory.length}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Model Comparison */}
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-accent/30 p-6 mt-8"
            >
              <h3 className="text-xl font-heading font-bold text-aerospace-accent mb-6">
                Turbulence Model Comparison
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={state.comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
                  <XAxis dataKey="model" stroke="rgba(203, 213, 225, 0.5)" />
                  <YAxis stroke="rgba(203, 213, 225, 0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(14, 165, 233, 0.3)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="accuracy" fill="rgba(14, 165, 233, 0.8)" name="Accuracy" />
                  <Bar dataKey="speed" fill="rgba(16, 185, 129, 0.8)" name="Speed" />
                  <Bar dataKey="stability" fill="rgba(245, 158, 11, 0.8)" name="Stability" />
                </BarChart>
              </ResponsiveContainer>

              {/* Model Applications */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                {Object.entries(modelDescriptions).map(([model, info]) => (
                  <motion.div
                    key={model}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-aerospace-dark rounded-lg border border-aerospace-blue/20"
                  >
                    <h4 className="font-bold text-aerospace-blue mb-2">{model.toUpperCase()}</h4>
                    <p className="text-xs text-secondary-foreground mb-3">{info.description}</p>
                    <div className="space-y-1">
                      {info.applications.map((app, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-aerospace-blue" />
                          {app}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
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
              <Wind className="mx-auto mb-4 text-aerospace-blue/50" size={48} />
              <p className="text-lg text-secondary-foreground">
                Click "Start Simulation" to begin turbulence modeling analysis
              </p>
            </motion.div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
