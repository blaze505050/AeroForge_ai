import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Zap, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface CelestialBody {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
}

const G = 0.0001; // Gravitational constant (scaled for visualization)

export default function AstroLabAstrodynamicsSandboxPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [bodies, setBodies] = useState<CelestialBody[]>([
    { id: 'sun', name: 'Sun', x: 400, y: 300, vx: 0, vy: 0, mass: 1000, radius: 15, color: '#FCD34D' },
    { id: 'earth', name: 'Earth', x: 550, y: 300, vx: 0, vy: -3, mass: 1, radius: 5, color: '#3B82F6' },
    { id: 'mars', name: 'Mars', x: 650, y: 300, vx: 0, vy: -2.2, mass: 0.1, radius: 3, color: '#EF4444' },
  ]);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [trails, setTrails] = useState<Map<string, Array<{ x: number; y: number }>>>(new Map());

  // N-Body gravity simulation
  const updateBodies = (currentBodies: CelestialBody[]): CelestialBody[] => {
    return currentBodies.map((body, i) => {
      let ax = 0;
      let ay = 0;

      // Calculate gravitational forces from all other bodies
      currentBodies.forEach((other, j) => {
        if (i !== j) {
          const dx = other.x - body.x;
          const dy = other.y - body.y;
          const distSq = dx * dx + dy * dy + 100; // Add small value to prevent singularity
          const dist = Math.sqrt(distSq);

          const force = (G * body.mass * other.mass) / distSq;
          ax += (force * dx) / (body.mass * dist);
          ay += (force * dy) / (body.mass * dist);
        }
      });

      // Update velocity and position
      const newVx = body.vx + ax * 0.1;
      const newVy = body.vy + ay * 0.1;
      const newX = body.x + newVx;
      const newY = body.y + newVy;

      return {
        ...body,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
      };
    });
  };

  // Draw simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

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

    // Draw trails
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    trails.forEach((trail) => {
      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;

    // Draw bodies
    bodies.forEach((body) => {
      // Glow
      ctx.fillStyle = body.color;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(body.x, body.y, body.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.globalAlpha = 1;
      ctx.fillStyle = body.color;
      ctx.beginPath();
      ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '12px monospace';
      ctx.fillText(body.name, body.x + 15, body.y - 10);

      // Selection highlight
      if (selectedBody?.id === body.id) {
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(body.x, body.y, body.radius + 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Draw info
    ctx.fillStyle = '#0EA5E9';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`Bodies: ${bodies.length} | Status: ${isRunning ? 'RUNNING' : 'PAUSED'}`, 20, 30);
  }, [bodies, selectedBody, trails, isRunning]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setBodies(prev => {
        const updated = updateBodies(prev);

        // Update trails
        setTrails(prevTrails => {
          const newTrails = new Map(prevTrails);
          updated.forEach(body => {
            if (!newTrails.has(body.id)) {
              newTrails.set(body.id, []);
            }
            const trail = newTrails.get(body.id)!;
            trail.push({ x: body.x, y: body.y });
            if (trail.length > 200) trail.shift();
            newTrails.set(body.id, trail);
          });
          return newTrails;
        });

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a body
    for (const body of bodies) {
      const dx = x - body.x;
      const dy = y - body.y;
      if (Math.sqrt(dx * dx + dy * dy) < body.radius + 10) {
        setSelectedBody(body);
        return;
      }
    }
    setSelectedBody(null);
  };

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
                  Astrodynamics & Physics Simulation Sandbox
                </h1>
                <p className="font-paragraph text-lg text-secondary-foreground max-w-3xl">
                  Interactive N-Body gravity simulation with real orbital mechanics. Design missions and analyze trajectories.
                </p>
              </div>
              <Zap className="w-12 h-12 text-aerospace-blue hidden lg:block" />
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
                    height={500}
                    onClick={handleCanvasClick}
                    className="w-full bg-aerospace-dark rounded-lg cursor-pointer"
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
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Simulation</h3>
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
                        setBodies([
                          { id: 'sun', name: 'Sun', x: 400, y: 300, vx: 0, vy: 0, mass: 1000, radius: 15, color: '#FCD34D' },
                          { id: 'earth', name: 'Earth', x: 550, y: 300, vx: 0, vy: -3, mass: 1, radius: 5, color: '#3B82F6' },
                          { id: 'mars', name: 'Mars', x: 650, y: 300, vx: 0, vy: -2.2, mass: 0.1, radius: 3, color: '#EF4444' },
                        ]);
                        setTrails(new Map());
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/40 text-aerospace-blue border border-aerospace-blue/20 rounded-lg hover:bg-primary/60 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                </motion.div>

                {/* Bodies List */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6"
                >
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Bodies</h3>
                  <div className="space-y-2">
                    {bodies.map((body) => (
                      <button
                        key={body.id}
                        onClick={() => setSelectedBody(selectedBody?.id === body.id ? null : body)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedBody?.id === body.id
                            ? 'bg-aerospace-blue/30 border border-aerospace-blue'
                            : 'bg-primary/40 border border-aerospace-blue/20 hover:border-aerospace-blue/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: body.color }}
                          />
                          <p className="font-mono text-sm font-bold text-aerospace-blue">{body.name}</p>
                        </div>
                        <p className="text-xs text-foreground/60 mt-1">Mass: {body.mass}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Selected Body Details */}
                {selectedBody && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-aerospace-blue/20 to-aerospace-accent/20 border border-aerospace-blue/50 rounded-lg p-6"
                  >
                    <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                      {selectedBody.name}
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-foreground/60">Position</p>
                        <p className="font-mono text-aerospace-blue">
                          ({selectedBody.x.toFixed(1)}, {selectedBody.y.toFixed(1)})
                        </p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Velocity</p>
                        <p className="font-mono text-aerospace-blue">
                          ({selectedBody.vx.toFixed(2)}, {selectedBody.vy.toFixed(2)}) km/s
                        </p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Speed</p>
                        <p className="font-mono text-aerospace-blue">
                          {Math.sqrt(selectedBody.vx ** 2 + selectedBody.vy ** 2).toFixed(2)} km/s
                        </p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Mass</p>
                        <p className="font-mono text-aerospace-blue">{selectedBody.mass} kg</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-primary/40 border border-aerospace-blue/20 rounded-lg p-4"
                >
                  <p className="text-xs text-foreground/70">
                    <span className="text-aerospace-blue font-bold">N-Body Engine:</span> Real gravitational physics with orbital mechanics.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
