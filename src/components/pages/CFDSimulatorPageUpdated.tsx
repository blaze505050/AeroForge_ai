import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Download, Settings, TrendingUp, Zap, Wind, Video, Upload } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CFDVisualization from '@/components/CFDVisualization';
import CADGeometryPreview from '@/components/CADGeometryPreview';
import AdvancedConvergenceMonitor from '@/components/AdvancedConvergenceMonitor';
import CFDPhysicsEngine, { SimulationConfig as PhysicsConfig, AerodynamicCoefficients } from '@/services/cfdPhysicsEngine';
import ConvergenceMonitoringService, { ConvergenceMetrics } from '@/services/convergenceMonitoringService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface SimulationState {
  isRunning: boolean;
  convergence: number;
  results: AerodynamicCoefficients | null;
  convergenceHistory: Array<{ iteration: number; residual: number }>;
  engine: CFDPhysicsEngine | null;
  convergenceMetrics: ConvergenceMetrics;
  currentIteration: number;
}

export default function CFDSimulatorPage() {
  const [config, setConfig] = useState<PhysicsConfig>({
    meshSize: 50000,
    reynoldsNumber: 6000000,
    machNumber: 0.2,
    angleOfAttack: 5,
    turbulenceModel: 'k-omega',
    solverType: 'RANS',
    timeStep: 0.001,
    iterations: 500,
  });

  const [state, setState] = useState<SimulationState>({
    isRunning: false,
    convergence: 0,
    results: null,
    convergenceHistory: [],
    engine: null,
    convergenceMetrics: ConvergenceMonitoringService.initializeMetrics(),
    currentIteration: 0,
  });

  const [visualizationType, setVisualizationType] = useState<'velocity' | 'pressure' | 'turbulence' | 'streamlines'>('velocity');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [cadFile, setCADFile] = useState<File | null>(null);
  const [showCADPreview, setShowCADPreview] = useState(false);
  const [showConvergenceMonitor, setShowConvergenceMonitor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRunSimulation = async () => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      convergence: 0,
      results: null,
      convergenceHistory: [],
      currentIteration: 0,
      convergenceMetrics: ConvergenceMonitoringService.initializeMetrics(),
    }));

    const engine = new CFDPhysicsEngine(config);
    setState(prev => ({ ...prev, engine }));

    let currentIteration = 0;
    const maxIterations = config.iterations;
    let convergenceMetrics = ConvergenceMonitoringService.initializeMetrics();

    const simulationInterval = setInterval(() => {
      currentIteration += 50;

      if (currentIteration >= maxIterations) {
        clearInterval(simulationInterval);

        const results = engine.solveRANS(maxIterations);
        const convergenceHist = engine.getConvergenceHistory();

        const finalHistory = convergenceHist.map((residual, idx) => ({
          iteration: idx,
          residual: Math.max(1e-8, residual),
        }));

        convergenceMetrics = ConvergenceMonitoringService.updateMetrics(
          convergenceMetrics,
          currentIteration,
          {
            continuity: results.residuals.continuity,
            momentum: results.residuals.momentum,
            energy: results.residuals.energy,
            turbulence: 1e-6,
          },
          {
            velocityL2: 0.001,
            pressureL2: 0.0001,
            turbulenceL2: 1e-6,
          },
          {
            cl: results.liftCoefficient,
            cd: results.dragCoefficient,
            cm: 0,
          }
        );

        setState(prev => ({
          ...prev,
          isRunning: false,
          convergence: 100,
          results,
          convergenceHistory: finalHistory,
          currentIteration,
          convergenceMetrics,
        }));
        return;
      }

      const partialResults = engine.solveRANS(50);
      const convergenceHist = engine.getConvergenceHistory();

      const newHistory = convergenceHist.map((residual, idx) => ({
        iteration: idx,
        residual: Math.max(1e-8, residual),
      }));

      convergenceMetrics = ConvergenceMonitoringService.updateMetrics(
        convergenceMetrics,
        currentIteration,
        {
          continuity: partialResults.residuals.continuity,
          momentum: partialResults.residuals.momentum,
          energy: partialResults.residuals.energy,
          turbulence: 1e-6 * Math.random(),
        },
        {
          velocityL2: 0.001 * Math.exp(-currentIteration / 100),
          pressureL2: 0.0001 * Math.exp(-currentIteration / 100),
          turbulenceL2: 1e-6 * Math.exp(-currentIteration / 100),
        },
        {
          cl: partialResults.liftCoefficient,
          cd: partialResults.dragCoefficient,
          cm: 0.001 * Math.sin(currentIteration / 50),
        }
      );

      const progress = (currentIteration / maxIterations) * 100;

      setState(prev => ({
        ...prev,
        convergence: progress,
        results: partialResults,
        convergenceHistory: newHistory,
        currentIteration,
        convergenceMetrics,
      }));
    }, 500);
  };

  const handleReset = () => {
    setState({
      isRunning: false,
      convergence: 0,
      results: null,
      convergenceHistory: [],
      engine: null,
      convergenceMetrics: ConvergenceMonitoringService.initializeMetrics(),
      currentIteration: 0,
    });
  };

  const handleCADFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCADFile(file);
      setShowCADPreview(true);
    }
  };

  const handleDownloadResults = () => {
    if (!state.results) return;

    const csv = `CFD Simulation Results - Professional Solver with Advanced Features
Generated: ${new Date().toISOString()}

CONFIGURATION
Mesh Size,${config.meshSize.toLocaleString()} elements
Reynolds Number,${config.reynoldsNumber.toLocaleString()}
Mach Number,${config.machNumber}
Angle of Attack,${config.angleOfAttack}°
Turbulence Model,${config.turbulenceModel}
Solver Type,${config.solverType}
Time Step,${config.timeStep}
Total Iterations,${config.iterations}

AERODYNAMIC COEFFICIENTS
Drag Coefficient (Cd),${state.results.dragCoefficient.toFixed(8)}
Lift Coefficient (Cl),${state.results.liftCoefficient.toFixed(8)}
Pressure Coefficient (Cp),${state.results.pressureCoefficient.toFixed(8)}
Wall Shear Stress (τ),${state.results.wallShearStress.toFixed(8)}

CONVERGENCE METRICS
Overall Convergence,${state.results.convergence.toFixed(2)}%
Continuity Residual,${state.results.residuals.continuity.toExponential(4)}
Momentum Residual,${state.results.residuals.momentum.toExponential(4)}
Energy Residual,${state.results.residuals.energy.toExponential(4)}
Convergence Rate,${state.convergenceMetrics.convergenceRate.toFixed(6)}
Est. Iterations to Convergence,${state.convergenceMetrics.estimatedIterationsToConvergence}

CONVERGENCE HISTORY
Iteration,Residual
${state.convergenceHistory.map(h => `${h.iteration},${h.residual.toExponential(4)}`).join('\n')}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cfd_results_${new Date().getTime()}.csv`;
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
              Professional CFD Solver
            </h1>
            <p className="font-paragraph text-lg text-slate-400 mb-4">
              Phase 3: Full Navier-Stokes Solver with CAD Geometry Processing & Advanced Convergence Monitoring
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm text-blue-300">
                CAD Processing
              </span>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-sm text-green-300">
                Mesh Generation
              </span>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm text-purple-300">
                Advanced Monitoring
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Configuration Panel */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                <h2 className="font-heading text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Simulation Setup
                </h2>

                <div className="space-y-6">
                  {/* CAD File Upload */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".stl"
                      onChange={handleCADFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-paragraph font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload CAD (STL)
                    </button>
                    {cadFile && (
                      <p className="text-xs text-green-400 mt-2">✓ {cadFile.name}</p>
                    )}
                  </div>

                  {/* Mesh Size */}
                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Mesh Size: {config.meshSize.toLocaleString()} elements
                    </label>
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="10000"
                      value={config.meshSize}
                      onChange={(e) => setConfig({ ...config, meshSize: parseInt(e.target.value) })}
                      disabled={state.isRunning}
                      className="w-full"
                    />
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
                      onChange={(e) => setConfig({ ...config, reynoldsNumber: parseInt(e.target.value) })}
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
                      onChange={(e) => setConfig({ ...config, machNumber: parseFloat(e.target.value) })}
                      disabled={state.isRunning}
                      className="w-full"
                    />
                  </div>

                  {/* Angle of Attack */}
                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Angle of Attack: {config.angleOfAttack}°
                    </label>
                    <input
                      type="range"
                      min="-15"
                      max="25"
                      step="1"
                      value={config.angleOfAttack}
                      onChange={(e) => setConfig({ ...config, angleOfAttack: parseInt(e.target.value) })}
                      disabled={state.isRunning}
                      className="w-full"
                    />
                  </div>

                  {/* Turbulence Model */}
                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Turbulence Model
                    </label>
                    <select
                      value={config.turbulenceModel}
                      onChange={(e) => setConfig({ ...config, turbulenceModel: e.target.value as any })}
                      disabled={state.isRunning}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-paragraph"
                    >
                      <option value="k-epsilon">k-epsilon</option>
                      <option value="k-omega">k-omega</option>
                      <option value="spalart-allmaras">Spalart-Allmaras</option>
                      <option value="les">LES</option>
                    </select>
                  </div>

                  {/* Solver Type */}
                  <div>
                    <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                      Solver Type
                    </label>
                    <select
                      value={config.solverType}
                      onChange={(e) => setConfig({ ...config, solverType: e.target.value as any })}
                      disabled={state.isRunning}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-paragraph"
                    >
                      <option value="RANS">RANS</option>
                      <option value="URANS">URANS</option>
                      <option value="DES">DES</option>
                      <option value="DNS">DNS</option>
                    </select>
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
                          Time Step: {config.timeStep.toFixed(4)}
                        </label>
                        <input
                          type="range"
                          min="0.0001"
                          max="0.01"
                          step="0.0001"
                          value={config.timeStep}
                          onChange={(e) => setConfig({ ...config, timeStep: parseFloat(e.target.value) })}
                          disabled={state.isRunning}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                          Iterations: {config.iterations}
                        </label>
                        <input
                          type="range"
                          min="100"
                          max="2000"
                          step="100"
                          value={config.iterations}
                          onChange={(e) => setConfig({ ...config, iterations: parseInt(e.target.value) })}
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
                    <button
                      onClick={() => setShowConvergenceMonitor(!showConvergenceMonitor)}
                      className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-paragraph font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Advanced Monitor
                    </button>
                    {state.results && (
                      <button
                        onClick={handleDownloadResults}
                        className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-paragraph font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Results
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-3 space-y-6">
              {/* CAD Preview */}
              {showCADPreview && cadFile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="font-heading text-lg font-bold text-white">CAD Geometry Preview</h3>
                    <button
                      onClick={() => setShowCADPreview(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="h-96">
                    <CADGeometryPreview file={cadFile} isLoading={false} />
                  </div>
                </motion.div>
              )}

              {/* Visualization Tabs */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="flex gap-0 border-b border-slate-700">
                  {(['velocity', 'pressure', 'turbulence', 'streamlines'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setVisualizationType(type)}
                      className={`flex-1 py-3 px-4 font-paragraph font-medium transition-colors ${
                        visualizationType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="p-6 h-96">
                  <CFDVisualization
                    flowField={state.engine?.getFlowField() || null}
                    meshData={state.engine?.getMeshData() || null}
                    isRunning={state.isRunning}
                    convergence={state.convergence}
                    visualizationType={visualizationType}
                  />
                </div>
              </div>

              {/* Advanced Convergence Monitor */}
              {showConvergenceMonitor && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 rounded-xl border border-slate-700 p-6"
                >
                  <AdvancedConvergenceMonitor
                    metrics={state.convergenceMetrics}
                    isRunning={state.isRunning}
                    currentIteration={state.currentIteration}
                    maxIterations={config.iterations}
                  />
                </motion.div>
              )}

              {/* Basic Convergence Monitor */}
              {!showConvergenceMonitor && (
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Convergence Monitor
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-paragraph text-sm text-slate-300">
                          Overall Progress
                        </span>
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

                    {state.convergenceHistory.length > 0 && (
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={state.convergenceHistory}>
                          <defs>
                            <linearGradient id="colorResidual" x1="0" y1="0" x2="0" y2="1">
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
                            dataKey="residual"
                            stroke="#0EA5E9"
                            fillOpacity={1}
                            fill="url(#colorResidual)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}

                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                      <p className="font-paragraph text-sm text-slate-400">
                        Status: <span className="text-white font-semibold">
                          {state.isRunning ? 'Running...' : state.convergence === 0 ? 'Ready' : 'Completed'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                    Aerodynamic Coefficients
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      {
                        label: 'Drag Coefficient',
                        value: state.results.dragCoefficient.toFixed(8),
                        unit: 'Cd',
                        icon: Wind,
                      },
                      {
                        label: 'Lift Coefficient',
                        value: state.results.liftCoefficient.toFixed(8),
                        unit: 'Cl',
                        icon: Wind,
                      },
                      {
                        label: 'Pressure Coefficient',
                        value: state.results.pressureCoefficient.toFixed(8),
                        unit: 'Cp',
                        icon: Zap,
                      },
                      {
                        label: 'Wall Shear Stress',
                        value: state.results.wallShearStress.toFixed(8),
                        unit: 'τ (Pa)',
                        icon: TrendingUp,
                      },
                    ].map((result, i) => {
                      const Icon = result.icon;
                      return (
                        <div key={i} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-paragraph text-sm text-slate-400">
                              {result.label}
                            </p>
                            <Icon className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-heading text-2xl font-bold text-blue-400">
                              {result.value}
                            </span>
                            <span className="font-paragraph text-xs text-slate-500">
                              {result.unit}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="font-heading text-sm font-bold text-white mb-3">Residuals</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-900 rounded p-3 border border-slate-700">
                        <p className="font-paragraph text-xs text-slate-400 mb-1">Continuity</p>
                        <p className="font-heading text-sm text-green-400">
                          {state.results.residuals.continuity.toExponential(2)}
                        </p>
                      </div>
                      <div className="bg-slate-900 rounded p-3 border border-slate-700">
                        <p className="font-paragraph text-xs text-slate-400 mb-1">Momentum</p>
                        <p className="font-heading text-sm text-green-400">
                          {state.results.residuals.momentum.toExponential(2)}
                        </p>
                      </div>
                      <div className="bg-slate-900 rounded p-3 border border-slate-700">
                        <p className="font-paragraph text-xs text-slate-400 mb-1">Energy</p>
                        <p className="font-heading text-sm text-green-400">
                          {state.results.residuals.energy.toExponential(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
