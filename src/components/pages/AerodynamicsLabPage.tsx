import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Zap, Settings, Plus, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandCenterSidebar from '@/components/CommandCenterSidebar';
import AICopilotSidebar from '@/components/AICopilotSidebar';

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
