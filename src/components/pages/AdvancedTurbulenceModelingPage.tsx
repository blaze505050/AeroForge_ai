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
  Wind,
  BarChart3,
  LineChart as LineChartIcon,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TurbulenceModelingService, {
  TurbulenceModelConfig,
  TurbulenceResults,
  TurbulenceProfile,
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
} from 'recharts';
import { BaseCrudService } from '@/integrations';

interface SimulationState {
  isRunning: boolean;
  convergence: number;
  results: TurbulenceResults | null;
  convergenceHistory: Array<{ iteration: number; metric: number }>;
  service: TurbulenceModelingService | null;
  profileData: TurbulenceProfile | null;
}

interface PlotData {
  kineticEnergyProfile: Array<{ position: number; k: number }>;
  dissipationProfile: Array<{ position: number; epsilon: number }>;
  viscosityProfile: Array<{ position: number; nu_t: number }>;
  velocityProfile: Array<{ position: number; velocity: number }>;
  convergenceHistory: Array<{ iteration: number; metric: number }>;
  modelComparison: Array<{ model: string; accuracy: number; cost: number }>;
}

export default function AdvancedTurbulenceModelingPage() {
  const [config, setConfig] = useState<TurbulenceModelConfig>({
    modelType: 'k-omega',
    reynoldsNumber: 6000000,
    machNumber: 0.2,
    wallDistance: 0.001,
    flowVelocity: 30,
    viscosity: 1.81e-5,
    density: 1.225,
    meshResolution: 100000,
  });

  const [state, setState] = useState<SimulationState>({
    isRunning: false,
    convergence: 0,
    results: null,
    convergenceHistory: [],
    service: null,
    profileData: null,
  });

  const [plotData, setPlotData] = useState<PlotData | null>(null);
  const [activeTab, setActiveTab] = useState<'setup' | 'results' | 'analysis'>('setup');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Get model recommendations
  useEffect(() => {
    const service = new TurbulenceModelingService(config);
    setRecommendations(service.getModelRecommendations());
  }, [config]);

  const generatePlotData = (
    results: TurbulenceResults,
    profileData: TurbulenceProfile,
    convergenceHist: Array<{ iteration: number; metric: number }>
  ): PlotData => {
    const kineticEnergyProfile = profileData.position.map((pos, i) => ({
      position: pos,
      k: profileData.kineticEnergy[i],
    }));

    const dissipationProfile = profileData.position.map((pos, i) => ({
      position: pos,
      epsilon: profileData.dissipationRate[i],
    }));

    const viscosityProfile = profileData.position.map((pos, i) => ({
      position: pos,
      nu_t: profileData.turbulentViscosity[i],
    }));

    const velocityProfile = profileData.position.map((pos, i) => ({
      position: pos,
      velocity: profileData.velocity[i],
    }));

    const modelComparison = [
      { model: 'k-epsilon', accuracy: 0.85, cost: 1 },
      { model: 'k-omega', accuracy: 0.92, cost: 1.2 },
      { model: 'Spalart-Allmaras', accuracy: 0.88, cost: 0.8 },
      { model: 'LES', accuracy: 0.98, cost: 3.5 },
    ];

    return {
      kineticEnergyProfile,
      dissipationProfile,
      viscosityProfile,
      velocityProfile,
      convergenceHistory: convergenceHist,
      modelComparison,
    };
  };

  const handleRunSimulation = async () => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      convergence: 0,
      results: null,
      convergenceHistory: [],
    }));

    const service = new TurbulenceModelingService(config);
    setState((prev) => ({ ...prev, service }));

    let currentIteration = 0;
    const maxIterations = 10;
    const historyData: Array<{ iteration: number; metric: number }> = [];

    const simulationInterval = setInterval(() => {
      currentIteration += 1;

      if (currentIteration >= maxIterations) {
        clearInterval(simulationInterval);

        const results = service.solve();
        const profileData = service.getProfileData();
        const convergenceHist = service.getConvergenceHistory();

        const finalHistory = convergenceHist.map((metric, idx) => ({
          iteration: idx,
          metric: Math.max(1e-8, metric),
        }));

        if (profileData) {
          const plots = generatePlotData(results, profileData, finalHistory);
          setPlotData(plots);
        }

        setState((prev) => ({
          ...prev,
          isRunning: false,
          convergence: 100,
          results,
          convergenceHistory: finalHistory,
          profileData,
        }));

        return;
      }

      const progress = (currentIteration / maxIterations) * 100;

      setState((prev) => ({
        ...prev,
        convergence: progress,
      }));
    }, 300);
  };

  const handleReset = () => {
    setState({
      isRunning: false,
      convergence: 0,
      results: null,
      convergenceHistory: [],
      service: null,
      profileData: null,
    });
    setPlotData(null);
  };

  const handleSaveResults = async () => {
    if (!state.results) return;

    setIsSaving(true);
    try {
      await BaseCrudService.create('simulations', {
        _id: crypto.randomUUID(),
        simulationName: `Turbulence Model: ${config.modelType}`,
        simulationType: 'Advanced Turbulence Modeling',
        inputParameters: JSON.stringify({
          modelType: config.modelType,
          reynoldsNumber: config.reynoldsNumber,
          machNumber: config.machNumber,
          wallDistance: config.wallDistance,
          flowVelocity: config.flowVelocity,
        }),
        resultSummary: JSON.stringify({
          turbulenceIntensity: state.results.turbulenceIntensity,
          yPlus: state.results.yPlus,
          modelAccuracy: state.results.modelAccuracy,
          turbulentViscosity: state.results.turbulentViscosity,
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
    if (!state.results || !plotData) return;

    const csv = `Advanced Turbulence Modeling Results
Generated: ${new Date().toISOString()}
Model Type: ${config.modelType}

CONFIGURATION
Reynolds Number,${config.reynoldsNumber.toLocaleString()}
Mach Number,${config.machNumber}
Wall Distance,${config.wallDistance}
Flow Velocity,${config.flowVelocity} m/s
Viscosity,${config.viscosity}
Density,${config.density} kg/m³
Mesh Resolution,${config.meshResolution.toLocaleString()}

TURBULENCE RESULTS
Kinetic Energy,${state.results.kineticEnergy.toFixed(8)}
Dissipation Rate,${state.results.dissipationRate.toFixed(8)}
Turbulent Viscosity,${state.results.turbulentViscosity.toFixed(8)}
Turbulence Intensity,${(state.results.turbulenceIntensity * 100).toFixed(4)}%
y+,${state.results.yPlus.toFixed(4)}
Wall Shear Stress,${state.results.wallShearStress.toFixed(8)}
Model Accuracy,${(state.results.modelAccuracy * 100).toFixed(2)}%

KINETIC ENERGY PROFILE
Position (m),Kinetic Energy (m²/s²)
${plotData.kineticEnergyProfile.map((d) => `${d.position.toFixed(6)},${d.k.toFixed(8)}`).join('\n')}

DISSIPATION PROFILE
Position (m),Dissipation Rate (m²/s³)
${plotData.dissipationProfile.map((d) => `${d.position.toFixed(6)},${d.epsilon.toFixed(8)}`).join('\n')}

VISCOSITY PROFILE
Position (m),Turbulent Viscosity (Pa·s)
${plotData.viscosityProfile.map((d) => `${d.position.toFixed(6)},${d.nu_t.toFixed(8)}`).join('\n')}

VELOCITY PROFILE
Position (m),Velocity (m/s)
${plotData.velocityProfile.map((d) => `${d.position.toFixed(6)},${d.velocity.toFixed(4)}`).join('\n')}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `turbulence_modeling_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
              Advanced Turbulence Modeling
            </h1>
            <p className="font-paragraph text-lg text-slate-400 mb-4">
              Production-grade turbulence model solver with k-epsilon, k-omega, Spalart-Allmaras, and LES
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm text-blue-300">
                Multi-Model Support
              </span>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-sm text-green-300">
                Boundary Layer Analysis
              </span>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm text-purple-300">
                CMS Integration
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 border-b border-slate-700">
            {(['setup', 'results', 'analysis'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-paragraph font-semibold transition-colors ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                    {/* Turbulence Model */}
                    <div>
                      <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                        Turbulence Model
                      </label>
                      <select
                        value={config.modelType}
                        onChange={(e) =>
                          setConfig({ ...config, modelType: e.target.value as any })
                        }
                        disabled={state.isRunning}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-paragraph"
                      >
                        <option value="k-epsilon">k-epsilon</option>
                        <option value="k-omega">k-omega</option>
                        <option value="spalart-allmaras">Spalart-Allmaras</option>
                        <option value="les">LES</option>
                      </select>
                    </div>

                    {/* Reynolds Number */}
                    <div>
                      <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                        Reynolds Number: {config.reynoldsNumber.toLocaleString()}
                      </label>
                      <input
                        type="range"
                        min="1000000"
                        max="50000000"
                        step="1000000"
                        value={config.reynoldsNumber}
                        onChange={(e) =>
                          setConfig({ ...config, reynoldsNumber: parseInt(e.target.value) })
                        }
                        disabled={state.isRunning}
                        className="w-full"
                      />
                    </div>

                    {/* Mach Number */}
                    <div>
                      <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                        Mach Number: {config.machNumber.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={config.machNumber}
                        onChange={(e) =>
                          setConfig({ ...config, machNumber: parseFloat(e.target.value) })
                        }
                        disabled={state.isRunning}
                        className="w-full"
                      />
                    </div>

                    {/* Flow Velocity */}
                    <div>
                      <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                        Flow Velocity: {config.flowVelocity.toFixed(1)} m/s
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        step="1"
                        value={config.flowVelocity}
                        onChange={(e) =>
                          setConfig({ ...config, flowVelocity: parseFloat(e.target.value) })
                        }
                        disabled={state.isRunning}
                        className="w-full"
                      />
                    </div>

                    {/* Wall Distance */}
                    <div>
                      <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                        Wall Distance: {config.wallDistance.toExponential(2)} m
                      </label>
                      <input
                        type="range"
                        min="-5"
                        max="-2"
                        step="0.1"
                        value={Math.log10(config.wallDistance)}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            wallDistance: Math.pow(10, parseFloat(e.target.value)),
                          })
                        }
                        disabled={state.isRunning}
                        className="w-full"
                      />
                    </div>

                    {/* Advanced Options */}
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors"
                    >
                      {showAdvanced ? '▼ Advanced Options' : '▶ Advanced Options'}
                    </button>

                    {showAdvanced && (
                      <>
                        <div>
                          <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                            Mesh Resolution: {config.meshResolution.toLocaleString()}
                          </label>
                          <input
                            type="range"
                            min="10000"
                            max="1000000"
                            step="10000"
                            value={config.meshResolution}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                meshResolution: parseInt(e.target.value),
                              })
                            }
                            disabled={state.isRunning}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                            Viscosity: {config.viscosity.toExponential(2)} Pa·s
                          </label>
                          <input
                            type="range"
                            min="-6"
                            max="-4"
                            step="0.1"
                            value={Math.log10(config.viscosity)}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                viscosity: Math.pow(10, parseFloat(e.target.value)),
                              })
                            }
                            disabled={state.isRunning}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                            Density: {config.density.toFixed(3)} kg/m³
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={config.density}
                            onChange={(e) =>
                              setConfig({ ...config, density: parseFloat(e.target.value) })
                            }
                            disabled={state.isRunning}
                            className="w-full"
                          />
                        </div>
                      </>
                    )}

                    {/* Control Buttons */}
                    <div className="space-y-3 pt-4 border-t border-slate-700">
                      <button
                        onClick={handleRunSimulation}
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
                            Run Simulation
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

              {/* Results Panel */}
              <div className="lg:col-span-3 space-y-6">
                {/* Recommendations */}
                {recommendations && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                  >
                    <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-400" />
                      Model Recommendations
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-paragraph font-semibold text-white">
                            Recommended: {recommendations.recommendedModel}
                          </p>
                          <p className="font-paragraph text-sm text-slate-400">
                            {recommendations.reason}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                          <p className="font-paragraph text-xs text-slate-400 mb-1">Mesh Requirements</p>
                          <p className="font-heading text-sm font-semibold text-white">
                            {recommendations.meshRequirements}
                          </p>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                          <p className="font-paragraph text-xs text-slate-400 mb-1">Computational Cost</p>
                          <p className="font-heading text-sm font-semibold text-white">
                            {recommendations.computationalCost}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Convergence Monitor */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Convergence Monitor
                  </h3>

                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-paragraph text-sm text-slate-300">Overall Progress</span>
                        <span className="font-heading font-bold text-blue-400">
                          {state.convergence.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${state.convergence}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Convergence Chart */}
                    {state.convergenceHistory.length > 0 && (
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={state.convergenceHistory}>
                          <defs>
                            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="iteration" stroke="#94a3b8" />
                          <YAxis scale="log" stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                            labelStyle={{ color: '#e2e8f0' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="metric"
                            stroke="#0EA5E9"
                            fillOpacity={1}
                            fill="url(#colorMetric)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Results Display */}
                {state.results && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                  >
                    <h3 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Turbulence Results
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: 'Kinetic Energy',
                          value: state.results.kineticEnergy.toFixed(6),
                          unit: 'm²/s²',
                        },
                        {
                          label: 'Dissipation Rate',
                          value: state.results.dissipationRate.toFixed(6),
                          unit: 'm²/s³',
                        },
                        {
                          label: 'Turbulent Viscosity',
                          value: state.results.turbulentViscosity.toFixed(6),
                          unit: 'Pa·s',
                        },
                        {
                          label: 'Turbulence Intensity',
                          value: (state.results.turbulenceIntensity * 100).toFixed(4),
                          unit: '%',
                        },
                        {
                          label: 'y+ (Wall Distance)',
                          value: state.results.yPlus.toFixed(4),
                          unit: '-',
                        },
                        {
                          label: 'Wall Shear Stress',
                          value: state.results.wallShearStress.toFixed(6),
                          unit: 'Pa',
                        },
                        {
                          label: 'Model Accuracy',
                          value: (state.results.modelAccuracy * 100).toFixed(2),
                          unit: '%',
                        },
                        {
                          label: 'Convergence Metric',
                          value: state.results.convergenceMetric.toFixed(6),
                          unit: '-',
                        },
                      ].map((result, i) => (
                        <div key={i} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                          <p className="font-paragraph text-sm text-slate-400 mb-2">{result.label}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="font-heading text-2xl font-bold text-blue-400">
                              {result.value}
                            </span>
                            <span className="font-paragraph text-xs text-slate-500">{result.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View Analysis Button */}
                    {plotData && (
                      <button
                        onClick={() => setActiveTab('analysis')}
                        className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-paragraph font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <BarChart3 className="w-5 h-5" />
                        View Detailed Analysis
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && plotData && (
            <div className="space-y-8">
              {/* Kinetic Energy Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Wind className="w-5 h-5" />
                  Kinetic Energy Profile
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={plotData.kineticEnergyProfile}>
                    <defs>
                      <linearGradient id="kGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="position" stroke="#94a3b8" label={{ value: 'Position (m)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="#94a3b8" label={{ value: 'Kinetic Energy (m²/s²)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Area type="monotone" dataKey="k" stroke="#0EA5E9" fill="url(#kGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Dissipation Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Dissipation Rate Profile
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={plotData.dissipationProfile}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="position" stroke="#94a3b8" label={{ value: 'Position (m)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis scale="log" stroke="#94a3b8" label={{ value: 'Dissipation Rate (m²/s³)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Line type="monotone" dataKey="epsilon" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Turbulent Viscosity Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5" />
                  Turbulent Viscosity Profile
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={plotData.viscosityProfile}>
                    <defs>
                      <linearGradient id="nuGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="position" stroke="#94a3b8" label={{ value: 'Position (m)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis scale="log" stroke="#94a3b8" label={{ value: 'Turbulent Viscosity (Pa·s)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Area type="monotone" dataKey="nu_t" stroke="#10B981" fill="url(#nuGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Velocity Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Wind className="w-5 h-5" />
                  Velocity Profile (Boundary Layer)
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={plotData.velocityProfile}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="position" stroke="#94a3b8" label={{ value: 'Position (m)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="#94a3b8" label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Line type="monotone" dataKey="velocity" stroke="#06B6D4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Model Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Turbulence Model Comparison
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={plotData.modelComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="model" stroke="#94a3b8" />
                    <YAxis yAxisId="left" stroke="#94a3b8" label={{ value: 'Accuracy', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" label={{ value: 'Computational Cost', angle: 90, position: 'insideRight' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="accuracy" fill="#0EA5E9" name="Accuracy" />
                    <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#F59E0B" strokeWidth={2} name="Cost" />
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>

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

          {/* Results Tab (Empty State) */}
          {activeTab === 'results' && !state.results && (
            <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="font-heading text-lg font-bold text-white mb-2">No Results Yet</h3>
              <p className="font-paragraph text-slate-400">
                Run a simulation to see detailed results and analysis
              </p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
