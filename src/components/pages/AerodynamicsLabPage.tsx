import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Zap, Settings, Plus, ChevronRight, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandCenterSidebar from '@/components/CommandCenterSidebar';
import AICopilotSidebar from '@/components/AICopilotSidebar';
import { 
  AerodynamicSolver, 
  AtmosphericModel, 
  PHYSICS_CONSTANTS 
} from '@/services/enhancedPhysicsEngine';

interface LabModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'coming-soon' | 'beta';
  features: string[];
}

export default function AerodynamicsLabPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showCopilot, setShowCopilot] = useState(true);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Real-time physics calculations
  const runPhysicsSimulation = (altitude: number, mach: number, aoa: number) => {
    setIsRunning(true);
    
    // Get atmospheric properties
    const atmo = AtmosphericModel.getAtmosphericProperties(altitude);
    
    // Calculate Reynolds number (simplified)
    const wingChord = 2.5; // meters
    const reynoldsNumber = (atmo.rho * mach * atmo.speedOfSound * wingChord) / atmo.viscosity;
    
    // Calculate aerodynamic coefficients
    const cl = AerodynamicSolver.computeLiftCoefficient(aoa, mach, reynoldsNumber);
    const cd = AerodynamicSolver.computeDragCoefficient(aoa, mach, reynoldsNumber);
    
    // Calculate forces (assuming 50 m² wing area)
    const wingArea = 50;
    const dynamicPressure = 0.5 * atmo.rho * Math.pow(mach * atmo.speedOfSound, 2);
    const lift = cl * dynamicPressure * wingArea;
    const drag = cd * dynamicPressure * wingArea;
    
    setSimulationResults({
      altitude,
      mach,
      aoa,
      temperature: atmo.T - 273.15,
      pressure: atmo.P,
      density: atmo.rho,
      speedOfSound: atmo.speedOfSound,
      reynoldsNumber,
      cl,
      cd,
      lift,
      drag,
      liftToDragRatio: lift / drag,
      timestamp: new Date().toLocaleTimeString(),
    });
    
    setIsRunning(false);
  };

  const modules: LabModule[] = [
    {
      id: 'airfoil-studio',
      name: 'Airfoil Studio',
      description: 'Design and analyze airfoil profiles with real-time aerodynamic feedback',
      icon: <Wind className="w-8 h-8" />,
      status: 'available',
      features: [
        'NACA profile generation',
        'Custom geometry import',
        'Pressure distribution visualization',
        'Polar curve generation',
        'Optimization tools',
      ],
    },
    {
      id: 'cfd-studio',
      name: 'CFD Studio',
      description: 'Advanced computational fluid dynamics simulations with mesh generation',
      icon: <Zap className="w-8 h-8" />,
      status: 'available',
      features: [
        'Automated mesh generation',
        'Turbulence modeling',
        'Boundary layer analysis',
        'Post-processing tools',
        'Convergence monitoring',
      ],
    },
    {
      id: 'wind-tunnel',
      name: 'Virtual Wind Tunnel',
      description: 'Interactive wind tunnel simulations with real-time parameter adjustment',
      icon: <Wind className="w-8 h-8" />,
      status: 'beta',
      features: [
        'Real-time flow visualization',
        'Mach number control',
        'Reynolds number variation',
        'Force coefficient measurement',
        'Flow field export',
      ],
    },
    {
      id: 'optimization',
      name: 'Design Optimizer',
      description: 'Multi-objective optimization for aerodynamic performance',
      icon: <Zap className="w-8 h-8" />,
      status: 'coming-soon',
      features: [
        'Genetic algorithms',
        'Pareto frontier analysis',
        'Constraint handling',
        'Batch processing',
        'Result comparison',
      ],
    },
  ];

  const getStatusColor = (status: LabModule['status']) => {
    switch (status) {
      case 'available':
        return 'bg-aerospace-success/10 text-aerospace-success';
      case 'beta':
        return 'bg-aerospace-warning/10 text-aerospace-warning';
      case 'coming-soon':
        return 'bg-secondary/10 text-secondary-foreground';
    }
  };

  const getStatusLabel = (status: LabModule['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'beta':
        return 'Beta';
      case 'coming-soon':
        return 'Coming Soon';
    }
  };

  return (
    <div className="min-h-screen bg-aerospace-dark flex flex-col">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-5xl font-bold text-foreground font-heading mb-4">
                Aerodynamics Lab
              </h1>
              <p className="text-lg text-secondary-foreground max-w-2xl">
                Advanced aerodynamic analysis and design tools. Explore airfoil design, CFD simulations, and optimization techniques.
              </p>
            </motion.div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {modules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => module.status !== 'coming-soon' && setSelectedModule(module.id)}
                  className={`bg-primary border border-secondary/20 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedModule === module.id ? 'border-aerospace-blue bg-primary/80' : 'hover:border-secondary/40'
                  } ${module.status === 'coming-soon' ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${
                      module.status === 'available'
                        ? 'bg-aerospace-blue/10 text-aerospace-blue'
                        : module.status === 'beta'
                        ? 'bg-aerospace-warning/10 text-aerospace-warning'
                        : 'bg-secondary/10 text-secondary-foreground'
                    }`}>
                      {module.icon}
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(module.status)}`}>
                      {getStatusLabel(module.status)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{module.name}</h3>
                  <p className="text-secondary-foreground text-sm mb-4">{module.description}</p>

                  <div className="space-y-2 mb-4">
                    {module.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-secondary-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-aerospace-blue" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {module.status !== 'coming-soon' && (
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-aerospace-blue/10 hover:bg-aerospace-blue/20 text-aerospace-blue rounded-lg transition-colors text-sm font-medium">
                      Launch Module
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Physics Simulation Panel */}
            {selectedModule === 'airfoil-studio' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary border border-secondary/20 rounded-lg p-8 mb-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle className="w-5 h-5 text-aerospace-blue" />
                  <h3 className="text-2xl font-bold text-foreground">Real-Time Physics Engine</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Input Controls */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Altitude (m): <span className="text-aerospace-blue">10,000</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="35000" 
                        defaultValue="10000"
                        onChange={(e) => runPhysicsSimulation(Number(e.target.value), 0.6, 5)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Mach Number: <span className="text-aerospace-blue">0.6</span>
                      </label>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="2.5" 
                        step="0.1"
                        defaultValue="0.6"
                        onChange={(e) => runPhysicsSimulation(10000, Number(e.target.value), 5)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Angle of Attack (°): <span className="text-aerospace-blue">5</span>
                      </label>
                      <input 
                        type="range" 
                        min="-10" 
                        max="25" 
                        defaultValue="5"
                        onChange={(e) => runPhysicsSimulation(10000, 0.6, Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Atmospheric Data */}
                  {simulationResults && (
                    <div className="bg-aerospace-dark rounded-lg p-4 space-y-3">
                      <h4 className="text-foreground font-semibold mb-4">Atmospheric Properties</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-secondary-foreground">Temperature:</span>
                          <span className="text-aerospace-blue font-mono">{simulationResults.temperature.toFixed(1)}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-foreground">Pressure:</span>
                          <span className="text-aerospace-blue font-mono">{(simulationResults.pressure / 1000).toFixed(1)} kPa</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-foreground">Density:</span>
                          <span className="text-aerospace-blue font-mono">{simulationResults.density.toFixed(4)} kg/m³</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-foreground">Speed of Sound:</span>
                          <span className="text-aerospace-blue font-mono">{simulationResults.speedOfSound.toFixed(1)} m/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-foreground">Reynolds Number:</span>
                          <span className="text-aerospace-blue font-mono">{(simulationResults.reynoldsNumber / 1e6).toFixed(2)}M</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Aerodynamic Results */}
                  {simulationResults && (
                    <div className="bg-aerospace-dark rounded-lg p-4 space-y-3">
                      <h4 className="text-foreground font-semibold mb-4">Aerodynamic Coefficients</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-secondary-foreground">Lift Coefficient (CL):</span>
                          <span className="text-aerospace-success font-mono">{simulationResults.cl.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-foreground">Drag Coefficient (CD):</span>
                          <span className="text-aerospace-warning font-mono">{simulationResults.cd.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-foreground">Lift Force:</span>
                          <span className="text-aerospace-success font-mono">{simulationResults.lift.toFixed(0)} N</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-foreground">Drag Force:</span>
                          <span className="text-aerospace-warning font-mono">{simulationResults.drag.toFixed(0)} N</span>
                        </div>
                        <div className="flex justify-between border-t border-secondary/20 pt-2 mt-2">
                          <span className="text-secondary-foreground font-semibold">L/D Ratio:</span>
                          <span className="text-aerospace-accent font-mono font-bold">{simulationResults.liftToDragRatio.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-aerospace-dark/50 border border-aerospace-blue/20 rounded-lg p-4">
                  <p className="text-xs text-secondary-foreground">
                    <span className="text-aerospace-blue font-semibold">Physics Engine:</span> US Standard Atmosphere 1976 model with Prandtl-Mach compressibility corrections, 
                    thin airfoil theory, and Sutherland viscosity model. Accurate for subsonic to supersonic flow regimes.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Module Details */}
            {selectedModule && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary border border-secondary/20 rounded-lg p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-foreground">
                    {modules.find(m => m.id === selectedModule)?.name}
                  </h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg transition-colors">
                    <Plus className="w-4 h-4" />
                    Start New Project
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Module Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Module Overview</h3>
                    <p className="text-secondary-foreground mb-6">
                      {modules.find(m => m.id === selectedModule)?.description}
                    </p>

                    <h4 className="text-lg font-semibold text-foreground mb-4">Key Features</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {modules.find(m => m.id === selectedModule)?.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-aerospace-dark rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-aerospace-blue flex-shrink-0" />
                          <span className="text-foreground text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <div className="bg-aerospace-dark rounded-lg p-4">
                      <h4 className="text-foreground font-semibold mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg transition-colors text-sm font-medium">
                          Launch Module
                        </button>
                        <button className="w-full px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-foreground rounded-lg transition-colors text-sm font-medium">
                          View Documentation
                        </button>
                        <button className="w-full px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-foreground rounded-lg transition-colors text-sm font-medium">
                          View Examples
                        </button>
                      </div>
                    </div>

                    <div className="bg-aerospace-dark rounded-lg p-4">
                      <h4 className="text-foreground font-semibold mb-3">Resources</h4>
                      <ul className="space-y-2 text-sm text-secondary-foreground">
                        <li className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-aerospace-blue" />
                          Tutorial Videos
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-aerospace-blue" />
                          API Reference
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-aerospace-blue" />
                          Example Projects
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-aerospace-blue" />
                          Community Forum
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>

        {/* AI Copilot Sidebar */}
        <AICopilotSidebar
          projectId="aerodynamics-lab"
          isOpen={showCopilot}
          onToggle={setShowCopilot}
        />
      </div>
      <Footer />
    </div>
  );
}
