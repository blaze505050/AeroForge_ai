import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Download, Settings, BarChart3, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface OrbitalElements {
  a: number; // Semi-major axis (km)
  e: number; // Eccentricity
  i: number; // Inclination (degrees)
  Ω: number; // Right ascension of ascending node (degrees)
  ω: number; // Argument of perigee (degrees)
  M: number; // Mean anomaly (degrees)
}

interface OrbitalPosition {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

export default function AstroLabOrbitalMechanicsPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [elements, setElements] = useState<OrbitalElements>({
    a: 42164, // GEO altitude
    e: 0.0002,
    i: 0.1,
    Ω: 0,
    ω: 0,
    M: 0,
  });
  const [selectedOrbit, setSelectedOrbit] = useState<'geo' | 'leo' | 'meo' | 'custom'>('geo');
  const [view3D, setView3D] = useState(false);
  const [showVelocity, setShowVelocity] = useState(true);
  const [showEnergy, setShowEnergy] = useState(true);

  // Kepler's equation solver (Newton-Raphson)
  const solveKeplersEquation = (M: number, e: number, tolerance = 1e-6): number => {
    let E = M;
    for (let i = 0; i < 100; i++) {
      const f = E - e * Math.sin(E) - M;
      const fp = 1 - e * Math.cos(E);
      const E_new = E - f / fp;
      if (Math.abs(E_new - E) < tolerance) return E_new;
      E = E_new;
    }
    return E;
  };

  // Calculate position from orbital elements
  const calculatePosition = (elements: OrbitalElements, time: number): OrbitalPosition => {
    const M = (elements.M + (360 * time) / (24 * 3600)) % 360;
    const M_rad = (M * Math.PI) / 180;
    const E = solveKeplersEquation(M_rad, elements.e);
    
    const i_rad = (elements.i * Math.PI) / 180;
    const Ω_rad = (elements.Ω * Math.PI) / 180;
    const ω_rad = (elements.ω * Math.PI) / 180;

    // Position in orbital plane
    const r = elements.a * (1 - elements.e * Math.cos(E));
    const x_orb = r * Math.cos(E - elements.e * Math.sin(E));
    const y_orb = r * Math.sin(E - elements.e * Math.sin(E)) * Math.sqrt(1 - elements.e * elements.e);

    // Velocity in orbital plane
    const n = Math.sqrt(398600.4418 / (elements.a * elements.a * elements.a));
    const vx_orb = -n * elements.a * Math.sin(E);
    const vy_orb = n * elements.a * Math.sqrt(1 - elements.e * elements.e) * Math.cos(E);

    // Transform to inertial frame
    const cos_ω = Math.cos(ω_rad);
    const sin_ω = Math.sin(ω_rad);
    const cos_Ω = Math.cos(Ω_rad);
    const sin_Ω = Math.sin(Ω_rad);
    const cos_i = Math.cos(i_rad);
    const sin_i = Math.sin(i_rad);

    const x = (cos_ω * cos_Ω - sin_ω * sin_Ω * cos_i) * x_orb + (-sin_ω * cos_Ω - cos_ω * sin_Ω * cos_i) * y_orb;
    const y = (cos_ω * sin_Ω + sin_ω * cos_Ω * cos_i) * x_orb + (-sin_ω * sin_Ω + cos_ω * cos_Ω * cos_i) * y_orb;
    const z = sin_ω * sin_i * x_orb + cos_ω * sin_i * y_orb;

    const vx = (cos_ω * cos_Ω - sin_ω * sin_Ω * cos_i) * vx_orb + (-sin_ω * cos_Ω - cos_ω * sin_Ω * cos_i) * vy_orb;
    const vy = (cos_ω * sin_Ω + sin_ω * cos_Ω * cos_i) * vx_orb + (-sin_ω * sin_Ω + cos_ω * cos_Ω * cos_i) * vy_orb;
    const vz = sin_ω * sin_i * vx_orb + cos_ω * sin_i * vy_orb;

    return { x, y, z, vx, vy, vz };
  };

  const position = useMemo(() => calculatePosition(elements, time), [elements, time]);

  const metrics = useMemo(() => {
    const r = Math.sqrt(position.x ** 2 + position.y ** 2 + position.z ** 2);
    const v = Math.sqrt(position.vx ** 2 + position.vy ** 2 + position.vz ** 2);
    const a = elements.a;
    const period = 2 * Math.PI * Math.sqrt((a ** 3) / 398600.4418);
    const apogee = a * (1 + elements.e);
    const perigee = a * (1 - elements.e);
    const ke = 0.5 * v * v;
    const pe = -398600.4418 / r;
    const te = ke + pe;

    return { r, v, period, apogee, perigee, ke, pe, te };
  }, [position, elements]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTime(t => t + 10);
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
    const scale = Math.min(width, height) / (elements.a * 3);

    // Background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0B0E14');
    bgGradient.addColorStop(1, '#131924');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Stars
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 200; i++) {
      const x = Math.sin(i * 12.9898) * 43758.5453 % width;
      const y = Math.cos(i * 78.233) * 43758.5453 % height;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;

    // Earth
    ctx.fillStyle = '#1a5a7a';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6371 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Orbit ellipse
    ctx.strokeStyle = '#00F0FF';
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const a_px = elements.a * scale;
    const b_px = elements.a * Math.sqrt(1 - elements.e * elements.e) * scale;
    const c_px = elements.a * elements.e * scale;

    for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
      const x = centerX + a_px * Math.cos(angle) * Math.cos(elements.Ω * Math.PI / 180) - b_px * Math.sin(angle) * Math.sin(elements.Ω * Math.PI / 180);
      const y = centerY + a_px * Math.cos(angle) * Math.sin(elements.Ω * Math.PI / 180) + b_px * Math.sin(angle) * Math.cos(elements.Ω * Math.PI / 180);
      if (angle === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Satellite position
    const sat_x = centerX + position.x * scale;
    const sat_y = centerY - position.y * scale;

    // Glow
    ctx.fillStyle = '#00F0FF';
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(sat_x, sat_y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Satellite
    ctx.fillStyle = '#00F0FF';
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(sat_x, sat_y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Velocity vector
    if (showVelocity) {
      const scale_v = 0.0001;
      const vx_px = position.vx * scale_v;
      const vy_px = position.vy * scale_v;
      ctx.strokeStyle = '#FF007A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sat_x, sat_y);
      ctx.lineTo(sat_x + vx_px, sat_y - vy_px);
      ctx.stroke();
    }

    // Apogee and perigee markers
    ctx.strokeStyle = '#F59E0B';
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX + metrics.apogee * scale, centerY, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX - metrics.perigee * scale, centerY, 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 1;
  }, [position, elements, showVelocity, metrics]);

  const loadPreset = (preset: string) => {
    setSelectedOrbit(preset as any);
    setTime(0);
    
    if (preset === 'leo') {
      setElements({
        a: 6678,
        e: 0.0005,
        i: 51.6,
        Ω: 0,
        ω: 0,
        M: 0,
      });
    } else if (preset === 'meo') {
      setElements({
        a: 26560,
        e: 0.0,
        i: 55,
        Ω: 0,
        ω: 0,
        M: 0,
      });
    } else if (preset === 'custom') {
      setElements({
        a: 42164,
        e: 0.0002,
        i: 0.1,
        Ω: 0,
        ω: 0,
        M: 0,
      });
    } else {
      setElements({
        a: 42164,
        e: 0.0002,
        i: 0.1,
        Ω: 0,
        ω: 0,
        M: 0,
      });
    }
  };

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      elements,
      position,
      metrics,
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orbital-elements-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

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
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Orbital Mechanics</h1>
                <p className="text-secondary-foreground text-sm">Keplerian elements & orbital dynamics calculator</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleExport} className="p-2 hover:bg-[#131924] rounded-lg transition" title="Export data">
                <Download size={20} className="text-[#00F0FF]" />
              </button>
              <button className="p-2 hover:bg-[#131924] rounded-lg transition" title="Settings">
                <Settings size={20} className="text-[#00F0FF]" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full"
                />
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] rounded-lg hover:bg-[#00F0FF]/30 transition font-mono text-sm"
                >
                  {isRunning ? <Pause size={16} /> : <Play size={16} />}
                  {isRunning ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => {
                    setTime(0);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A] rounded-lg hover:bg-[#FF007A]/30 transition font-mono text-sm"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button
                  onClick={() => setShowVelocity(!showVelocity)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition font-mono text-sm ${
                    showVelocity
                      ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]'
                      : 'bg-[#475569]/20 text-secondary-foreground border-[#475569]'
                  }`}
                >
                  Velocity
                </button>
                <button
                  onClick={() => setShowEnergy(!showEnergy)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition font-mono text-sm ${
                    showEnergy
                      ? 'bg-[#A78BFA]/20 text-[#A78BFA] border-[#A78BFA]'
                      : 'bg-[#475569]/20 text-secondary-foreground border-[#475569]'
                  }`}
                >
                  Energy
                </button>
              </div>

              {/* Presets */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3">Orbit Presets</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(['geo', 'leo', 'meo', 'custom'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => loadPreset(p)}
                      className={`px-3 py-2 rounded text-xs font-mono transition ${
                        selectedOrbit === p
                          ? 'bg-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]'
                          : 'bg-[#0B0E14]/50 text-secondary-foreground border border-[#475569] hover:border-[#00F0FF]'
                      }`}
                    >
                      {p === 'geo' && 'GEO'}
                      {p === 'leo' && 'LEO'}
                      {p === 'meo' && 'MEO'}
                      {p === 'custom' && 'Custom'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-4">
              {/* Orbital Elements */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-4">Keplerian Elements</h3>
                
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-secondary-foreground block mb-1">
                      Semi-major axis: <span className="text-[#00F0FF]">{elements.a.toFixed(0)} km</span>
                    </label>
                    <input
                      type="range"
                      min="6378"
                      max="100000"
                      value={elements.a}
                      onChange={(e) => setElements({ ...elements, a: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-secondary-foreground block mb-1">
                      Eccentricity: <span className="text-[#FF007A]">{elements.e.toFixed(4)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.001"
                      value={elements.e}
                      onChange={(e) => setElements({ ...elements, e: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-secondary-foreground block mb-1">
                      Inclination: <span className="text-[#F59E0B]">{elements.i.toFixed(2)}°</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      step="0.1"
                      value={elements.i}
                      onChange={(e) => setElements({ ...elements, i: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Metrics */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-4 flex items-center gap-2">
                  <BarChart3 size={14} />
                  Metrics
                </h3>
                
                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-[#0B0E14] p-2 rounded border border-[#00F0FF33]">
                    <div className="text-secondary-foreground">Period</div>
                    <div className="text-[#00F0FF] font-bold">{(metrics.period / 3600).toFixed(2)} hours</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0B0E14] p-2 rounded border border-[#FF007A33]">
                      <div className="text-secondary-foreground text-[10px]">Apogee</div>
                      <div className="text-[#FF007A] font-bold">{metrics.apogee.toFixed(0)} km</div>
                    </div>
                    <div className="bg-[#0B0E14] p-2 rounded border border-[#F59E0B33]">
                      <div className="text-secondary-foreground text-[10px]">Perigee</div>
                      <div className="text-[#F59E0B] font-bold">{metrics.perigee.toFixed(0)} km</div>
                    </div>
                  </div>

                  <div className="bg-[#0B0E14] p-2 rounded border border-[#A78BFA33]">
                    <div className="text-secondary-foreground">Velocity</div>
                    <div className="text-[#A78BFA] font-bold">{metrics.v.toFixed(2)} km/s</div>
                  </div>

                  {showEnergy && (
                    <>
                      <div className="bg-[#0B0E14] p-2 rounded border border-[#10B98133]">
                        <div className="text-secondary-foreground text-[10px]">Total Energy</div>
                        <div className="text-[#10B981] font-bold">{metrics.te.toFixed(0)} J/kg</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Position */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3">Position</h3>
                <div className="space-y-1 text-xs font-mono text-secondary-foreground">
                  <div className="flex justify-between">
                    <span>X:</span>
                    <span className="text-[#00F0FF]">{position.x.toFixed(0)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Y:</span>
                    <span className="text-[#00F0FF]">{position.y.toFixed(0)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Z:</span>
                    <span className="text-[#00F0FF]">{position.z.toFixed(0)} km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
