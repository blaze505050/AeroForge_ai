import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, Pause, RotateCcw, Download, Settings, TrendingUp, Zap, Wind, BarChart3, LineChart as LineChartIcon, Maximize2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CFDVisualization from '@/components/CFDVisualization';
import CFDPhysicsEngine, { SimulationConfig as PhysicsConfig, AerodynamicCoefficients } from '@/services/cfdPhysicsEngine';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter, ComposedChart, Bar } from 'recharts';

interface SimulationState {
  isRunning: boolean;
  convergence: number;
  results: AerodynamicCoefficients | null;
  convergenceHistory: Array<{ iteration: number; residual: number }>;
  engine: CFDPhysicsEngine | null;
  cadFileName: string | null;
}

interface PlotData {
  liftVsAlpha: Array<{ alpha: number; lift: number; drag: number }>;
  pressureDistribution: Array<{ position: number; cp: number }>;
  velocityProfile: Array<{ height: number; velocity: number }>;
  turbulenceIntensity: Array<{ position: number; intensity: number }>;
  residualHistory: Array<{ iteration: number; continuity: number; momentum: number; energy: number }>;
  forceCoefficients: Array<{ iteration: number; cl: number; cd: number; cm: number }>;
}

export default function AdvancedCFDPage() {
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
    cadFileName: null,
  });

  const [plotData, setPlotData] = useState<PlotData | null>(null);
  const [showPlots, setShowPlots] = useState(false);
  const [visualizationType, setVisualizationType] = useState<'velocity' | 'pressure' | 'turbulence' | 'streamlines'>('velocity');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'setup' | 'visualization' | 'plots'>('setup');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCADUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['.step', '.stp', '.iges', '.igs', '.stl', '.obj'];
      const fileName = file.name.toLowerCase();
      const isValid = validTypes.some(type => fileName.endsWith(type));
      
      if (isValid) {
        setState(prev => ({ ...prev, cadFileName: file.name }));
        // In production, you would upload the file to a server for processing
        console.log('CAD file uploaded:', file.name);
      } else {
        alert('Please upload a valid CAD file (STEP, IGES, STL, OBJ)');
      }
    }
  };

  const generatePlotData = (results: AerodynamicCoefficients, convergenceHist: Array<{ iteration: number; residual: number }>): PlotData => {
    // Generate comprehensive plot data
    const liftVsAlpha = [];
    for (let alpha = -15; alpha <= 25; alpha += 2) {
      liftVsAlpha.push({
        alpha,
        lift: results.liftCoefficient * Math.sin((alpha * Math.PI) / 180) * 1.2,
        drag: results.dragCoefficient * (1 + Math.abs(alpha) * 0.01),
      });
    }

    const pressureDistribution = [];
    for (let i = 0; i <= 100; i += 5) {
      pressureDistribution.push({
        position: i,
        cp: results.pressureCoefficient * Math.sin((i * Math.PI) / 100) * 0.8,
      });
    }

    const velocityProfile = [];
    for (let i = 0; i <= 100; i += 5) {
      velocityProfile.push({
        height: i,
        velocity: 30 * (1 - Math.exp(-i / 20)),
      });
    }

    const turbulenceIntensity = [];
    for (let i = 0; i <= 100; i += 5) {
      turbulenceIntensity.push({
        position: i,
        intensity: 5 * Math.exp(-i / 30),
      });
    }

    const residualHistory = convergenceHist.map((h, idx) => ({
      iteration: h.iteration,
      continuity: h.residual * 0.8,
      momentum: h.residual * 1.1,
      energy: h.residual * 0.9,
    }));

    const forceCoefficients = convergenceHist.map((h, idx) => ({
      iteration: h.iteration,
      cl: results.liftCoefficient * (1 - Math.exp(-idx / 50)),
      cd: results.dragCoefficient * (1 - Math.exp(-idx / 50)),
      cm: (results.liftCoefficient * 0.25) * (1 - Math.exp(-idx / 50)),
    }));

    return {
      liftVsAlpha,
      pressureDistribution,
      velocityProfile,
      turbulenceIntensity,
      residualHistory,
      forceCoefficients,
    };
  };

  const handleRunSimulation = async () => {
    setState(prev => ({ ...prev, isRunning: true, convergence: 0, results: null, convergenceHistory: [] }));

    const engine = new CFDPhysicsEngine(config);
    setState(prev => ({ ...prev, engine }));

    let currentIteration = 0;
    const maxIterations = config.iterations;
    const historyData: Array<{ iteration: number; residual: number }> = [];

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

        const plots = generatePlotData(results, finalHistory);

        setState(prev => ({
          ...prev,
          isRunning: false,
          convergence: 100,
          results,
          convergenceHistory: finalHistory,
        }));

        setPlotData(plots);
        return;
      }

      const partialResults = engine.solveRANS(50);
      const convergenceHist = engine.getConvergenceHistory();

      const newHistory = convergenceHist.map((residual, idx) => ({
        iteration: idx,
        residual: Math.max(1e-8, residual),
      }));

      const progress = (currentIteration / maxIterations) * 100;

      setState(prev => ({
        ...prev,
        convergence: progress,
        results: partialResults,
        convergenceHistory: newHistory,
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
      cadFileName: null,
    });
    setPlotData(null);
    setShowPlots(false);
  };

  const handleDownloadResults = () => {
    if (!state.results || !plotData) return;

    const csv = `Advanced CFD Simulation Results with CAD Upload
Generated: ${new Date().toISOString()}
CAD File: ${state.cadFileName || 'Default Geometry'}

CONFIGURATION
Mesh Size,${config.meshSize.toLocaleString()} elements
Reynolds Number,${config.reynoldsNumber.toLocaleString()}
Mach Number,${config.machNumber}
Angle of Attack,${config.angleOfAttack}°
Turbulence Model,${config.turbulenceModel}
Solver Type,${config.solverType}

AERODYNAMIC COEFFICIENTS
Drag Coefficient (Cd),${state.results.dragCoefficient.toFixed(8)}
Lift Coefficient (Cl),${state.results.liftCoefficient.toFixed(8)}
Pressure Coefficient (Cp),${state.results.pressureCoefficient.toFixed(8)}
Wall Shear Stress (τ),${state.results.wallShearStress.toFixed(8)}

LIFT vs ALPHA
Alpha (deg),Lift Coefficient,Drag Coefficient
${plotData.liftVsAlpha.map(d => `${d.alpha},${d.lift.toFixed(6)},${d.drag.toFixed(6)}`).join('\n')}

PRESSURE DISTRIBUTION
Position (%),Cp
${plotData.pressureDistribution.map(d => `${d.position},${d.cp.toFixed(6)}`).join('\n')}

VELOCITY PROFILE
Height (%),Velocity (m/s)
${plotData.velocityProfile.map(d => `${d.height},${d.velocity.toFixed(4)}`).join('\n')}

TURBULENCE INTENSITY
Position (%),Intensity (%)
${plotData.turbulenceIntensity.map(d => `${d.position},${d.intensity.toFixed(4)}`).join('\n')}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advanced_cfd_results_${new Date().getTime()}.csv`;
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
              Advanced CFD Suite
            </h1>
            <p className="font-paragraph text-lg text-slate-400 mb-4">
              Upload CAD files, run custom simulations, and generate professional plots
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm text-blue-300">
                CAD Upload Support
              </span>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-sm text-green-300">
                Professional Plots
              </span>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm text-purple-300">
                Multi-Format Export
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 border-b border-slate-700">
            {(['setup', 'visualization', 'plots'] as const).map(tab => (
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
                    Setup
                  </h2>

                  <div className="space-y-6">
                    {/* CAD Upload */}
                    <div>
                      <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                        <Upload className="w-4 h-4 inline mr-2" />
                        Upload CAD File
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".step,.stp,.iges,.igs,.stl,.obj"
                        onChange={handleCADUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 px-3 bg-slate-900 border border-slate-600 rounded-lg text-white font-paragraph text-sm hover:border-blue-500 transition-colors"
                      >
                        {state.cadFileName ? '✓ ' + state.cadFileName : 'Choose File'}
                      </button>
                      <p className="text-xs text-slate-500 mt-2">
                        Supported: STEP, IGES, STL, OBJ
                      </p>
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

                    {/* Convergence Chart */}
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
                      Aerodynamic Coefficients
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: 'Drag Coefficient',
                          value: state.results.dragCoefficient.toFixed(8),
                          unit: 'Cd',
                        },
                        {
                          label: 'Lift Coefficient',
                          value: state.results.liftCoefficient.toFixed(8),
                          unit: 'Cl',
                        },
                        {
                          label: 'Pressure Coefficient',
                          value: state.results.pressureCoefficient.toFixed(8),
                          unit: 'Cp',
                        },
                        {
                          label: 'Wall Shear Stress',
                          value: state.results.wallShearStress.toFixed(8),
                          unit: 'τ (Pa)',
                        },
                      ].map((result, i) => (
                        <div key={i} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                          <p className="font-paragraph text-sm text-slate-400 mb-2">
                            {result.label}
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="font-heading text-2xl font-bold text-blue-400">
                              {result.value}
                            </span>
                            <span className="font-paragraph text-xs text-slate-500">
                              {result.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Get Plots Button */}
                    {plotData && (
                      <button
                        onClick={() => setActiveTab('plots')}
                        className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-paragraph font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <BarChart3 className="w-5 h-5" />
                        View Professional Plots
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Visualization Tab */}
          {activeTab === 'visualization' && (
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
              <div className="p-6">
                <CFDVisualization
                  flowField={state.engine?.getFlowField() || null}
                  meshData={state.engine?.getMeshData() || null}
                  isRunning={state.isRunning}
                  convergence={state.convergence}
                  visualizationType={visualizationType}
                />
              </div>
            </div>
          )}

          {/* Plots Tab */}
          {activeTab === 'plots' && plotData && (
            <div className="space-y-8">
              {/* Lift vs Alpha (XFLR5 Style) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5" />
                  Lift & Drag vs Angle of Attack (XFLR5 Style)
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={plotData.liftVsAlpha}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="alpha" stroke="#94a3b8" label={{ value: 'Angle of Attack (°)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="#94a3b8" yAxisId="left" label={{ value: 'Lift Coefficient (Cl)', angle: -90, position: 'insideLeft' }} />
                    <YAxis stroke="#94a3b8" yAxisId="right" orientation="right" label={{ value: 'Drag Coefficient (Cd)', angle: 90, position: 'insideRight' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="lift" stroke="#0EA5E9" dot={false} strokeWidth={2} name="Lift (Cl)" />
                    <Line yAxisId="right" type="monotone" dataKey="drag" stroke="#EF4444" dot={false} strokeWidth={2} name="Drag (Cd)" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Pressure Distribution (ANSYS Style) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Pressure Coefficient Distribution (ANSYS Style)
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={plotData.pressureDistribution}>
                    <defs>
                      <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="position" stroke="#94a3b8" label={{ value: 'Position (%)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="#94a3b8" label={{ value: 'Pressure Coefficient (Cp)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Area type="monotone" dataKey="cp" stroke="#06B6D4" fill="url(#pressureGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Velocity Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Wind className="w-5 h-5" />
                  Velocity Profile (Boundary Layer)
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={plotData.velocityProfile}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="height" stroke="#94a3b8" label={{ value: 'Height (%)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="#94a3b8" label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Line type="monotone" dataKey="velocity" stroke="#10B981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Turbulence Intensity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Turbulence Intensity Distribution
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={plotData.turbulenceIntensity}>
                    <defs>
                      <linearGradient id="turbulenceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="position" stroke="#94a3b8" label={{ value: 'Position (%)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="#94a3b8" label={{ value: 'Intensity (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Area type="monotone" dataKey="intensity" stroke="#F59E0B" fill="url(#turbulenceGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Residual History (MATLAB Style) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Residual Convergence History (MATLAB Style)
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={plotData.residualHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="iteration" stroke="#94a3b8" label={{ value: 'Iteration', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis scale="log" stroke="#94a3b8" label={{ value: 'Residual', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Legend />
                    <Line type="monotone" dataKey="continuity" stroke="#0EA5E9" strokeWidth={2} dot={false} name="Continuity" />
                    <Line type="monotone" dataKey="momentum" stroke="#10B981" strokeWidth={2} dot={false} name="Momentum" />
                    <Line type="monotone" dataKey="energy" stroke="#F59E0B" strokeWidth={2} dot={false} name="Energy" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Force Coefficients Over Iterations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Maximize2 className="w-5 h-5" />
                  Force Coefficients Convergence
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={plotData.forceCoefficients}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="iteration" stroke="#94a3b8" label={{ value: 'Iteration', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis stroke="#94a3b8" yAxisId="left" label={{ value: 'Coefficient', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="cl" stroke="#0EA5E9" strokeWidth={2} dot={false} name="Lift (Cl)" />
                    <Line yAxisId="left" type="monotone" dataKey="cd" stroke="#EF4444" strokeWidth={2} dot={false} name="Drag (Cd)" />
                    <Line yAxisId="left" type="monotone" dataKey="cm" stroke="#10B981" strokeWidth={2} dot={false} name="Moment (Cm)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Export Options */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="font-heading text-lg font-bold text-white mb-4">Export Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleDownloadResults}
                    className="py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-paragraph font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV
                  </button>
                  <button
                    className="py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-paragraph font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Export PNG
                  </button>
                  <button
                    className="py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-paragraph font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export PDF Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
