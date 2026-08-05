import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wind,
  Zap,
  BarChart3,
  Settings,
  Plus,
  Grid3x3,
  Layers,
  TrendingUp,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandCenterSidebar from '@/components/CommandCenterSidebar';

interface AerodynamicsModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'active' | 'coming-soon';
}

const MODULES: AerodynamicsModule[] = [
  {
    id: 'airfoil-studio',
    name: 'Airfoil Studio',
    description: '2D airfoil design and analysis',
    icon: <Wind className="w-6 h-6" />,
    status: 'available',
  },
  {
    id: 'wing-studio',
    name: 'Wing Studio',
    description: '3D wing design and optimization',
    icon: <Wind className="w-6 h-6" />,
    status: 'available',
  },
  {
    id: 'cfd-studio',
    name: 'CFD Studio',
    description: 'Mesh generation and solver setup',
    icon: <Grid3x3 className="w-6 h-6" />,
    status: 'available',
  },
  {
    id: 'wind-tunnel',
    name: 'Virtual Wind Tunnel',
    description: 'Real-time aerodynamic analysis',
    icon: <Zap className="w-6 h-6" />,
    status: 'available',
  },
  {
    id: 'flow-viz',
    name: 'Flow Visualization',
    description: 'Streamlines, pressure fields, vorticity',
    icon: <BarChart3 className="w-6 h-6" />,
    status: 'available',
  },
  {
    id: 'boundary-layer',
    name: 'Boundary Layer Analysis',
    description: 'Boundary layer separation and transition',
    icon: <Layers className="w-6 h-6" />,
    status: 'coming-soon',
  },
  {
    id: 'compressible',
    name: 'Compressible Flow',
    description: 'High-speed aerodynamics',
    icon: <TrendingUp className="w-6 h-6" />,
    status: 'coming-soon',
  },
  {
    id: 'hypersonics',
    name: 'Hypersonics',
    description: 'Hypersonic flow analysis',
    icon: <Rocket className="w-6 h-6" />,
    status: 'coming-soon',
  },
];

import { Rocket } from 'lucide-react';

export default function AerodynamicsLabPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-aerospace-dark flex flex-col">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Lab Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-aerospace-blue/10 rounded-lg">
                  <Wind className="w-8 h-8 text-aerospace-blue" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground font-heading">
                    Aerodynamics Lab
                  </h1>
                  <p className="text-secondary-foreground mt-2">
                    Comprehensive aerodynamic design and analysis tools
                  </p>
                </div>
              </div>

              {/* Lab Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-primary border border-secondary/20 rounded-lg p-4">
                  <p className="text-secondary-foreground text-sm mb-1">Available Modules</p>
                  <p className="text-2xl font-bold text-aerospace-blue">5</p>
                </div>
                <div className="bg-primary border border-secondary/20 rounded-lg p-4">
                  <p className="text-secondary-foreground text-sm mb-1">Coming Soon</p>
                  <p className="text-2xl font-bold text-aerospace-warning">3</p>
                </div>
                <div className="bg-primary border border-secondary/20 rounded-lg p-4">
                  <p className="text-secondary-foreground text-sm mb-1">Active Projects</p>
                  <p className="text-2xl font-bold text-aerospace-success">2</p>
                </div>
                <div className="bg-primary border border-secondary/20 rounded-lg p-4">
                  <p className="text-secondary-foreground text-sm mb-1">Compute Hours</p>
                  <p className="text-2xl font-bold text-aerospace-accent">24.5</p>
                </div>
              </div>
            </motion.div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MODULES.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => module.status !== 'coming-soon' && setActiveModule(module.id)}
                  className={`group rounded-lg border transition-all cursor-pointer ${
                    module.status === 'coming-soon'
                      ? 'bg-primary/50 border-secondary/10 opacity-60 cursor-not-allowed'
                      : 'bg-primary border-secondary/20 hover:border-aerospace-blue/50 hover:shadow-lg'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${
                        module.status === 'coming-soon'
                          ? 'bg-secondary/10 text-secondary-foreground'
                          : 'bg-aerospace-blue/10 text-aerospace-blue group-hover:bg-aerospace-blue/20'
                      } transition-colors`}>
                        {module.icon}
                      </div>
                      {module.status === 'coming-soon' && (
                        <span className="text-xs font-medium px-2 py-1 bg-aerospace-warning/10 text-aerospace-warning rounded">
                          Coming Soon
                        </span>
                      )}
                      {module.status === 'active' && (
                        <span className="text-xs font-medium px-2 py-1 bg-aerospace-success/10 text-aerospace-success rounded">
                          Active
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-aerospace-blue transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-secondary-foreground text-sm mb-4">
                      {module.description}
                    </p>

                    {module.status !== 'coming-soon' && (
                      <button className="w-full px-4 py-2 bg-aerospace-blue/10 hover:bg-aerospace-blue/20 text-aerospace-blue rounded-lg font-medium transition-colors">
                        Open Module
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Start Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 bg-gradient-to-br from-aerospace-blue/10 to-aerospace-accent/10 border border-aerospace-blue/30 rounded-lg p-8"
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-aerospace-blue text-white flex items-center justify-center font-bold">
                      1
                    </div>
                    <h3 className="font-bold text-foreground">Design Your Geometry</h3>
                  </div>
                  <p className="text-secondary-foreground text-sm">
                    Start with Airfoil Studio or Wing Studio to design your aerodynamic shape.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-aerospace-blue text-white flex items-center justify-center font-bold">
                      2
                    </div>
                    <h3 className="font-bold text-foreground">Generate Mesh</h3>
                  </div>
                  <p className="text-secondary-foreground text-sm">
                    Use CFD Studio to create an optimized mesh for your geometry.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-aerospace-blue text-white flex items-center justify-center font-bold">
                      3
                    </div>
                    <h3 className="font-bold text-foreground">Run Analysis</h3>
                  </div>
                  <p className="text-secondary-foreground text-sm">
                    Launch simulations in the Virtual Wind Tunnel and visualize results.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
