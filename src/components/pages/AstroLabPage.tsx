import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Globe, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AstroLabPage: React.FC = () => {
  const navigate = useNavigate();
  const [utcTime, setUtcTime] = useState(new Date());
  const [orbitStatus, setOrbitStatus] = useState('LIVE');

  useEffect(() => {
    const timer = setInterval(() => setUtcTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const modules = [
    {
      id: 'spatial-globe',
      label: 'Spatial Globe',
      icon: '🌍',
      description: 'Real-time satellite tracking & orbital visualization',
      path: '/astrolab/spatial-globe',
      color: '#00F0FF',
    },
    {
      id: 'deep-space',
      label: 'Deep Space Observation',
      icon: '🔭',
      description: 'Catalog of celestial objects & deep-sky mapping',
      path: '/astrolab/deep-space-observation',
      color: '#FF007A',
    },
    {
      id: 'photometry',
      label: 'Photometry Suite',
      icon: '📊',
      description: 'Professional stellar photometry & aperture analysis',
      path: '/astrolab/photometry-suite',
      color: '#F59E0B',
    },
    {
      id: 'astrodynamics',
      label: 'Astrodynamics Sandbox',
      icon: '⚛️',
      description: 'N-body gravitational simulation engine',
      path: '/astrolab/astrodynamics-sandbox',
      color: '#A78BFA',
    },
    {
      id: 'dual-mode',
      label: 'Dual-Mode Experience',
      icon: '🔄',
      description: 'Switch between Student and Professional modes',
      path: '/astrolab/dual-mode',
      color: '#10B981',
    },
    {
      id: 'constellation',
      label: 'Satellite Constellation',
      icon: '🛰️',
      description: 'Real-time orbital shell visualization',
      path: '/astrolab/satellite-constellation',
      color: '#06B6D4',
    },
    {
      id: 'celestial',
      label: 'Celestial Coordinates',
      icon: '📐',
      description: 'Ephemeris calculations & coordinate transformations',
      path: '/astrolab/celestial-coordinate',
      color: '#EC4899',
    },
    {
      id: 'orbital',
      label: 'Orbital Mechanics',
      icon: '🔢',
      description: 'Keplerian elements & orbital dynamics',
      path: '/astrolab/orbital-mechanics',
      color: '#8B5CF6',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-foreground flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[120rem] mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-lg border border-[#00F0FF33] bg-gradient-to-br from-[#131924]/60 to-[#0B0E14]/60 backdrop-blur-md p-8">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F0FF] rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-5xl font-bold text-[#00F0FF] font-mono mb-2">AstroLab Suite</h1>
                  <p className="text-lg text-secondary-foreground">Professional-grade astronomical research & simulation platform</p>
                </div>
                <div className="text-5xl">🚀</div>
              </div>

              {/* Status Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#00F0FF33]">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-[#00F0FF]" />
                  <div>
                    <div className="text-xs text-secondary-foreground">UTC Time</div>
                    <div className="text-sm font-mono text-[#00F0FF]">{utcTime.toUTCString().split(' ')[4]}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse" />
                  <div>
                    <div className="text-xs text-secondary-foreground">Orbit Feed</div>
                    <div className="text-sm font-mono text-[#10B981]">{orbitStatus}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap size={18} className="text-[#F59E0B]" />
                  <div>
                    <div className="text-xs text-secondary-foreground">Engine Status</div>
                    <div className="text-sm font-mono text-[#F59E0B]">WebGL Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modules Grid */}
          <div>
            <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Available Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map((module, idx) => (
                <motion.button
                  key={module.id}
                  onClick={() => navigate(module.path)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-left p-6 rounded-lg border border-[#00F0FF33] bg-[#131924]/40 backdrop-blur-md hover:border-[#00F0FF] hover:bg-[#131924]/60 transition-all group"
                >
                  <div className="text-4xl mb-3">{module.icon}</div>
                  <h3 className="text-lg font-bold text-foreground font-mono mb-2 group-hover:text-[#00F0FF] transition">{module.label}</h3>
                  <p className="text-xs text-secondary-foreground mb-4">{module.description}</p>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] opacity-0 group-hover:opacity-100 transition">
                    <LinkIcon size={12} />
                    Launch Module
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-foreground mb-2">Professional Grade</h3>
              <p className="text-sm text-secondary-foreground">
                Industry-standard algorithms and real-time data processing for accurate astronomical calculations.
              </p>
            </div>
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-foreground mb-2">Advanced Analytics</h3>
              <p className="text-sm text-secondary-foreground">
                Comprehensive data visualization, export capabilities, and statistical analysis tools.
              </p>
            </div>
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-bold text-foreground mb-2">Real-Time Simulation</h3>
              <p className="text-sm text-secondary-foreground">
                Live orbital tracking, N-body simulations, and interactive 3D visualization engine.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Platform Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0B0E14] p-4 rounded border border-[#00F0FF33]">
                <div className="text-2xl font-bold text-[#00F0FF] font-mono">8</div>
                <div className="text-xs text-secondary-foreground mt-1">Research Modules</div>
              </div>
              <div className="bg-[#0B0E14] p-4 rounded border border-[#00F0FF33]">
                <div className="text-2xl font-bold text-[#FF007A] font-mono">9000+</div>
                <div className="text-xs text-secondary-foreground mt-1">Tracked Satellites</div>
              </div>
              <div className="bg-[#0B0E14] p-4 rounded border border-[#00F0FF33]">
                <div className="text-2xl font-bold text-[#F59E0B] font-mono">2</div>
                <div className="text-xs text-secondary-foreground mt-1">Experience Modes</div>
              </div>
              <div className="bg-[#0B0E14] p-4 rounded border border-[#00F0FF33]">
                <div className="text-2xl font-bold text-[#A78BFA] font-mono">Real-time</div>
                <div className="text-xs text-secondary-foreground mt-1">Data Updates</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-8">
            <p className="text-secondary-foreground mb-4">Select a module above to begin your astronomical research</p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-2 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] rounded-lg font-mono text-sm hover:bg-[#00F0FF]/30 transition-all">
                Documentation
              </button>
              <button className="px-6 py-2 bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A] rounded-lg font-mono text-sm hover:bg-[#FF007A]/30 transition-all">
                API Reference
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default AstroLabPage;
