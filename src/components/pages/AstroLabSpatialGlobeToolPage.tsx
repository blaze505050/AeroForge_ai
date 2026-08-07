import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Zap, Eye, Map, Download, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Satellite {
  id: string;
  name: string;
  lat: number;
  lon: number;
  altitude: number;
  velocity: number;
  inclination: number;
  period: number;
  color: string;
}

export default function AstroLabSpatialGlobeToolPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const [showTrails, setShowTrails] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [satellites, setSatellites] = useState<Satellite[]>([
    { id: 'iss', name: 'ISS', lat: 0, lon: 0, altitude: 408, velocity: 7.66, inclination: 51.6, period: 92.68, color: '#00F0FF' },
    { id: 'hubble', name: 'Hubble', lat: 10, lon: 45, altitude: 547, velocity: 7.54, inclination: 28.47, period: 96.97, color: '#FF007A' },
    { id: 'goes16', name: 'GOES-16', lat: 0, lon: -75, altitude: 35786, velocity: 3.07, inclination: 0.03, period: 1436, color: '#F59E0B' },
    { id: 'jwst', name: 'JWST', lat: 5, lon: 120, altitude: 1500000, velocity: 0.5, inclination: 0, period: 180, color: '#A78BFA' },
  ]);

  const propagateSatellite = (sat: Satellite, timeStep: number): Satellite => {
    const meanMotion = (2 * Math.PI) / (sat.period * 60);
    const newLon = (sat.lon + (360 * timeStep) / (sat.period * 60)) % 360;
    const latVariation = Math.sin((meanMotion * timeStep) % (2 * Math.PI)) * sat.inclination;
    
    return {
      ...sat,
      lon: newLon > 180 ? newLon - 360 : newLon,
      lat: latVariation,
    };
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTime(t => t + 1);
      setSatellites(sats => sats.map(sat => propagateSatellite(sat, 1)));
    }, 50);
    return () => clearInterval(interval);
  }, [isRunning]);

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
    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5;
      ctx.fillRect(x, y, size, size);
    }

    // Draw Earth
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, '#1a3a52');
    gradient.addColorStop(0.5, '#0d5a3d');
    gradient.addColorStop(1, '#051f2e');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw grid
    ctx.strokeStyle = '#00F0FF';
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    for (let lat = -90; lat <= 90; lat += 30) {
      const y = centerY - (lat / 90) * radius;
      ctx.beginPath();
      ctx.moveTo(centerX - radius, y);
      ctx.lineTo(centerX + radius, y);
      ctx.stroke();
    }
    for (let lon = -180; lon <= 180; lon += 30) {
      const x = centerX + (lon / 180) * radius;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Draw satellites
    satellites.forEach((sat) => {
      const x = centerX + (sat.lon / 180) * radius;
      const y = centerY - (sat.lat / 90) * radius;

      // Draw trail
      if (showTrails) {
        ctx.strokeStyle = sat.color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * (1 + sat.altitude / 40000), 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw satellite
      ctx.fillStyle = sat.color;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw glow
      ctx.strokeStyle = sat.color;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Draw border
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }, [satellites, showTrails]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[120rem] mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/astrolab')} className="p-2 hover:bg-[#131924] rounded-lg transition">
                <ArrowLeft size={20} className="text-[#00F0FF]" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Spatial Globe Engine</h1>
                <p className="text-secondary-foreground text-sm">Real-time satellite tracking & orbital visualization</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#131924] rounded-lg transition" title="Download data">
                <Download size={20} className="text-[#00F0FF]" />
              </button>
              <button className="p-2 hover:bg-[#131924] rounded-lg transition" title="Settings">
                <Settings size={20} className="text-[#00F0FF]" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Canvas */}
            <div className="lg:col-span-3 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
              <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="w-full border border-[#00F0FF33] rounded-lg"
              />
              
              {/* Controls */}
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center gap-2 ${
                    isRunning
                      ? 'bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A]'
                      : 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]'
                  }`}
                >
                  {isRunning ? <Pause size={16} /> : <Play size={16} />}
                  {isRunning ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => { setTime(0); setSatellites(satellites); }}
                  className="px-4 py-2 bg-[#131924] text-secondary-foreground border border-[#00F0FF33] rounded-lg font-mono text-sm hover:border-[#00F0FF] transition-all flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button
                  onClick={() => setShowTrails(!showTrails)}
                  className={`px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center gap-2 ${
                    showTrails
                      ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]'
                      : 'bg-[#131924] text-secondary-foreground border border-[#00F0FF33]'
                  }`}
                >
                  <Eye size={16} />
                  Trails
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Status */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-3">Status</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#FF007A]">Time:</span>
                    <span className="text-[#00F0FF]">{time}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#FF007A]">Satellites:</span>
                    <span className="text-[#00F0FF]">{satellites.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#FF007A]">Status:</span>
                    <span className={`${isRunning ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                      {isRunning ? 'LIVE' : 'PAUSED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Satellites List */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-3">Satellites</h3>
                <div className="space-y-2">
                  {satellites.map((sat) => (
                    <button
                      key={sat.id}
                      onClick={() => setSelectedSatellite(sat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                        selectedSatellite?.id === sat.id
                          ? 'bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF]'
                          : 'bg-[#0B0E14] border border-[#00F0FF33] text-secondary-foreground hover:border-[#00F0FF]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sat.color }} />
                        {sat.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              {selectedSatellite && (
                <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                  <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-3">{selectedSatellite.name}</h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div><span className="text-[#FF007A]">LAT:</span> <span className="text-[#00F0FF]">{selectedSatellite.lat.toFixed(2)}°</span></div>
                    <div><span className="text-[#FF007A]">LON:</span> <span className="text-[#00F0FF]">{selectedSatellite.lon.toFixed(2)}°</span></div>
                    <div><span className="text-[#FF007A]">ALT:</span> <span className="text-[#00F0FF]">{selectedSatellite.altitude} km</span></div>
                    <div><span className="text-[#FF007A]">VEL:</span> <span className="text-[#00F0FF]">{selectedSatellite.velocity.toFixed(2)} km/s</span></div>
                    <div><span className="text-[#FF007A]">INC:</span> <span className="text-[#00F0FF]">{selectedSatellite.inclination.toFixed(2)}°</span></div>
                    <div><span className="text-[#FF007A]">PERIOD:</span> <span className="text-[#00F0FF]">{selectedSatellite.period.toFixed(2)} min</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
