import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, AlertTriangle, Eye } from 'lucide-react';
import { Satellite as SatelliteIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Satellite {
  id: string;
  name: string;
  lat: number;
  lon: number;
  altitude: number;
  type: 'LEO' | 'MEO' | 'GEO';
  velocity: number;
  period: number;
  color: string;
}

export default function AstroLabSatelliteConstellationPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const [satellites, setSatellites] = useState<Satellite[]>([
    // LEO Satellites
    { id: 'iss', name: 'ISS', lat: 0, lon: 0, altitude: 408, type: 'LEO', velocity: 7.66, period: 92.68, color: '#3B82F6' },
    { id: 'hubble', name: 'Hubble', lat: 10, lon: 45, altitude: 547, type: 'LEO', velocity: 7.54, period: 96.97, color: '#8B5CF6' },
    { id: 'starlink1', name: 'Starlink-1', lat: -20, lon: 90, altitude: 550, type: 'LEO', velocity: 7.54, period: 97, color: '#10B981' },
    { id: 'starlink2', name: 'Starlink-2', lat: 30, lon: 180, altitude: 550, type: 'LEO', velocity: 7.54, period: 97, color: '#10B981' },
    // MEO Satellites
    { id: 'gps1', name: 'GPS-1', lat: 0, lon: 0, altitude: 20200, type: 'MEO', velocity: 3.87, period: 718, color: '#F59E0B' },
    { id: 'gps2', name: 'GPS-2', lat: 0, lon: 120, altitude: 20200, type: 'MEO', velocity: 3.87, period: 718, color: '#F59E0B' },
    // GEO Satellites
    { id: 'goes16', name: 'GOES-16', lat: 0, lon: -75, altitude: 35786, type: 'GEO', velocity: 3.07, period: 1436, color: '#EF4444' },
    { id: 'goes17', name: 'GOES-17', lat: 0, lon: -137, altitude: 35786, type: 'GEO', velocity: 3.07, period: 1436, color: '#EF4444' },
  ]);

  const propagateSatellite = (sat: Satellite, timeStep: number): Satellite => {
    const meanMotion = (2 * Math.PI) / (sat.period * 60);
    const newLon = (sat.lon + (360 * timeStep) / (sat.period * 60)) % 360;
    const latVariation = Math.sin((meanMotion * timeStep) % (2 * Math.PI)) * (sat.type === 'LEO' ? 30 : 5);

    return {
      ...sat,
      lon: newLon,
      lat: latVariation,
    };
  };

  // Draw constellation map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2.5;

    // Clear canvas
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    ctx.fillStyle = '#E2E8F0';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5;
      ctx.fillRect(x, y, size, size);
    }

    // Draw Earth
    ctx.fillStyle = '#1E40AF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw continents
    ctx.fillStyle = '#10B981';
    const continents = [
      { x: 0.3, y: 0.4, w: 0.2, h: 0.15 },
      { x: 0.6, y: 0.3, w: 0.25, h: 0.2 },
      { x: 0.1, y: 0.6, w: 0.15, h: 0.2 },
    ];
    continents.forEach(cont => {
      ctx.fillRect(
        centerX + (cont.x - 0.5) * radius * 2,
        centerY + (cont.y - 0.5) * radius * 2,
        cont.w * radius * 2,
        cont.h * radius * 2
      );
    });

    // Draw grid
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    for (let lat = -90; lat <= 90; lat += 30) {
      for (let lon = -180; lon <= 180; lon += 30) {
        const x = centerX + (lon / 180) * radius;
        const y = centerY + (lat / 90) * radius;
        ctx.fillStyle = '#0EA5E9';
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }
    ctx.globalAlpha = 1;

    // Draw satellites
    satellites.forEach((sat) => {
      const x = centerX + (sat.lon / 180) * radius;
      const y = centerY + (sat.lat / 90) * radius;

      // Orbital shell (for reference)
      if (sat === satellites[0]) {
        ctx.strokeStyle = '#0EA5E9';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * (sat.altitude / 35786), 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Satellite trail
      ctx.strokeStyle = sat.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(x, y, sat.altitude / 5000, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Satellite point
      ctx.fillStyle = sat === selectedSatellite ? '#F59E0B' : sat.color;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Glow
      ctx.strokeStyle = sat.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Label
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '11px monospace';
      ctx.fillText(sat.name, x + 10, y - 10);
    });

    // Draw info
    ctx.fillStyle = '#0EA5E9';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`Satellites: ${satellites.length} | Time: ${Math.floor(time)} min`, 20, 30);

    // Draw legend
    const legendY = height - 80;
    ctx.font = '11px monospace';
    ctx.fillStyle = '#3B82F6';
    ctx.fillText('● LEO', 20, legendY);
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('● MEO', 100, legendY);
    ctx.fillStyle = '#EF4444';
    ctx.fillText('● GEO', 180, legendY);
  }, [time, satellites, selectedSatellite]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime(prev => prev + 1);
      setSatellites(prev => prev.map(sat => propagateSatellite(sat, time + 1)));
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, time]);

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full flex flex-col">
        {/* Header */}
        <section className="w-full bg-primary border-b border-secondary/20 py-8">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-aerospace-blue hover:text-aerospace-accent transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Satellite Constellation Mapper
                </h1>
                <p className="font-paragraph text-lg text-secondary-foreground max-w-3xl">
                  Real-time mapping of LEO, MEO, and GEO satellites. Track constellations, detect collisions, and analyze orbital debris.
                </p>
              </div>
              <SatelliteIcon className="w-12 h-12 text-aerospace-blue hidden lg:block" />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="flex-1 w-full bg-aerospace-dark py-12">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Canvas */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6 hover:border-aerospace-blue/60 transition-all duration-300 shadow-lg"
                >
                  <canvas
                    ref={canvasRef}
                    width={700}
                    height={600}
                    className="w-full bg-aerospace-dark rounded-lg"
                  />
                </motion.div>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                {/* Playback */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6"
                >
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Playback</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-aerospace-blue text-white rounded-lg hover:bg-aerospace-accent transition-colors"
                    >
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isRunning ? 'Pause' : 'Play'}
                    </button>
                    <button
                      onClick={() => {
                        setTime(0);
                        setSatellites(prev => prev.map(sat => ({ ...sat, lon: 0, lat: 0 })));
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/40 text-aerospace-blue border border-aerospace-blue/20 rounded-lg hover:bg-primary/60 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                </motion.div>

                {/* Statistics */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6"
                >
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Constellation Stats</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Total Satellites</span>
                      <span className="text-aerospace-blue font-bold">{satellites.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">LEO Satellites</span>
                      <span className="text-blue-400 font-bold">{satellites.filter(s => s.type === 'LEO').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">MEO Satellites</span>
                      <span className="text-amber-400 font-bold">{satellites.filter(s => s.type === 'MEO').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">GEO Satellites</span>
                      <span className="text-red-400 font-bold">{satellites.filter(s => s.type === 'GEO').length}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Satellites List */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6 max-h-96 overflow-y-auto"
                >
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Satellites</h3>
                  <div className="space-y-2">
                    {satellites.map((sat) => (
                      <button
                        key={sat.id}
                        onClick={() => setSelectedSatellite(selectedSatellite?.id === sat.id ? null : sat)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedSatellite?.id === sat.id
                            ? 'bg-aerospace-blue/30 border border-aerospace-blue'
                            : 'bg-primary/40 border border-aerospace-blue/20 hover:border-aerospace-blue/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: sat.color }}
                          />
                          <p className="font-mono text-sm font-bold text-aerospace-blue">{sat.name}</p>
                          <span className="text-xs text-foreground/60 ml-auto">{sat.type}</span>
                        </div>
                        <p className="text-xs text-foreground/60 mt-1">Alt: {sat.altitude} km</p>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Selected Details */}
                {selectedSatellite && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-aerospace-blue/20 to-aerospace-accent/20 border border-aerospace-blue/50 rounded-lg p-6"
                  >
                    <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                      {selectedSatellite.name}
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-foreground/60">Type</p>
                        <p className="font-mono text-aerospace-blue">{selectedSatellite.type}</p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Altitude</p>
                        <p className="font-mono text-aerospace-blue">{selectedSatellite.altitude} km</p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Velocity</p>
                        <p className="font-mono text-aerospace-blue">{selectedSatellite.velocity.toFixed(2)} km/s</p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Period</p>
                        <p className="font-mono text-aerospace-blue">{selectedSatellite.period.toFixed(2)} min</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
