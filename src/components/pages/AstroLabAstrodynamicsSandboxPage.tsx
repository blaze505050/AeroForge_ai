import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Download, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  trail: Array<{ x: number; y: number }>;
  name: string;
}

export default function AstroLabAstrodynamicsSandboxPage() {
  const navigate = useNavigate();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [G, setG] = useState(6.674e-11);
  const [timeScale, setTimeScale] = useState(1);
  const [bodies, setBodies] = useState<Body[]>([
    { x: 300, y: 200, vx: 0, vy: 0, mass: 1.989e30, radius: 15, color: '#FFD700', trail: [], name: 'Sun' },
    { x: 450, y: 200, vx: 0, vy: 30, mass: 5.972e24, radius: 8, color: '#00F0FF', trail: [], name: 'Earth' },
    { x: 480, y: 200, vx: 0, vy: 35, mass: 7.342e22, radius: 3, color: '#FF007A', trail: [], name: 'Moon' },
  ]);
  const [stats, setStats] = useState({ totalEnergy: 0, momentum: 0 });

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setBodies(prevBodies => {
        const newBodies = prevBodies.map(body => ({ ...body }));

        // N-body simulation
        for (let i = 0; i < newBodies.length; i++) {
          let ax = 0, ay = 0;
          for (let j = 0; j < newBodies.length; j++) {
            if (i !== j) {
              const dx = newBodies[j].x - newBodies[i].x;
              const dy = newBodies[j].y - newBodies[i].y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const force = (G * newBodies[i].mass * newBodies[j].mass) / (dist * dist * 1e30);
              ax += (force / newBodies[i].mass) * (dx / dist);
              ay += (force / newBodies[i].mass) * (dy / dist);
            }
          }
          newBodies[i].vx += ax * 0.01 * timeScale;
          newBodies[i].vy += ay * 0.01 * timeScale;
          newBodies[i].x += newBodies[i].vx * timeScale;
          newBodies[i].y += newBodies[i].vy * timeScale;

          newBodies[i].trail.push({ x: newBodies[i].x, y: newBodies[i].y });
          if (newBodies[i].trail.length > 300) newBodies[i].trail.shift();
        }

        // Calculate stats
        let totalEnergy = 0;
        let momentumX = 0, momentumY = 0;
        newBodies.forEach(body => {
          totalEnergy += 0.5 * body.mass * (body.vx * body.vx + body.vy * body.vy);
          momentumX += body.mass * body.vx;
          momentumY += body.mass * body.vy;
        });
        setStats({
          totalEnergy: totalEnergy / 1e30,
          momentum: Math.sqrt(momentumX * momentumX + momentumY * momentumY) / 1e24,
        });

        return newBodies;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, G, timeScale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw trails
    bodies.forEach((body) => {
      ctx.strokeStyle = body.color;
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 1;
      ctx.beginPath();
      body.trail.forEach((point, idx) => {
        if (idx === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Draw bodies
    bodies.forEach((body) => {
      ctx.fillStyle = body.color;
      ctx.beginPath();
      ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
      ctx.fill();

      // Glow effect
      ctx.strokeStyle = body.color;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(body.x, body.y, body.radius + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }, [bodies]);

  const resetSimulation = () => {
    setBodies([
      { x: 300, y: 200, vx: 0, vy: 0, mass: 1.989e30, radius: 15, color: '#FFD700', trail: [], name: 'Sun' },
      { x: 450, y: 200, vx: 0, vy: 30, mass: 5.972e24, radius: 8, color: '#00F0FF', trail: [], name: 'Earth' },
      { x: 480, y: 200, vx: 0, vy: 35, mass: 7.342e22, radius: 3, color: '#FF007A', trail: [], name: 'Moon' },
    ]);
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
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Astrodynamics Sandbox</h1>
                <p className="text-secondary-foreground text-sm">N-body gravitational simulation engine</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-[#131924] rounded-lg transition">
                <Download size={20} className="text-[#00F0FF]" />
              </button>
              <button className="p-2 hover:bg-[#131924] rounded-lg transition">
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
                height={400}
                className="w-full border border-[#00F0FF33] rounded-lg"
              />
              
              {/* Controls */}
              <div className="mt-6 flex gap-3 justify-center flex-wrap">
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
                  onClick={resetSimulation}
                  className="px-4 py-2 bg-[#131924] text-secondary-foreground border border-[#00F0FF33] rounded-lg font-mono text-sm hover:border-[#00F0FF] transition-all flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Parameters */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-3">Parameters</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#FF007A]">G (×10⁻¹¹)</label>
                    <input
                      type="number"
                      value={(G / 1e-11).toFixed(3)}
                      onChange={(e) => setG(parseFloat(e.target.value) * 1e-11)}
                      className="w-full mt-1 px-2 py-1 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[#FF007A]">Time Scale: {timeScale.toFixed(1)}x</label>
                    <input
                      type="range"
                      min="0.1"
                      max="5"
                      step="0.1"
                      value={timeScale}
                      onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Bodies */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-3">Bodies</h3>
                <div className="space-y-2">
                  {bodies.map((body) => (
                    <div key={body.name} className="text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: body.color }} />
                        <span className="text-secondary-foreground">{body.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-3">Statistics</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-[#FF007A]">Energy:</span>
                    <span className="text-[#00F0FF] ml-2">{stats.totalEnergy.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[#FF007A]">Momentum:</span>
                    <span className="text-[#00F0FF] ml-2">{stats.momentum.toFixed(2)}</span>
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
