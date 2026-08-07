import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Settings, Satellite } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ConstellationData {
  name: string;
  altitude: number;
  shell: string;
  count: number;
  color: string;
  coverage: number;
}

export default function AstroLabSatelliteConstellationPage() {
  const navigate = useNavigate();
  const [selectedShell, setSelectedShell] = useState<string>('LEO');
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  const constellations: ConstellationData[] = [
    { name: 'LEO', altitude: 400, shell: 'LEO', count: 8000, color: '#00F0FF', coverage: 98 },
    { name: 'MEO', altitude: 20000, shell: 'MEO', count: 600, color: '#F59E0B', coverage: 85 },
    { name: 'GEO', altitude: 35786, shell: 'GEO', count: 500, color: '#A78BFA', coverage: 100 },
  ];

  useEffect(() => {
    const interval = setInterval(() => setRotation(r => (r + 0.5) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1;
      ctx.fillRect(x, y, size, size);
    }

    // Draw orbital shells
    const shells = [
      { radius: 60, color: '#00F0FF', label: 'LEO' },
      { radius: 100, color: '#F59E0B', label: 'MEO' },
      { radius: 140, color: '#A78BFA', label: 'GEO' },
    ];

    shells.forEach(shell => {
      ctx.strokeStyle = shell.color;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, shell.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Label
      ctx.fillStyle = shell.color;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(shell.label, centerX + shell.radius + 5, centerY - 5);
    });

    // Draw Earth
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
    gradient.addColorStop(0, '#1a3a52');
    gradient.addColorStop(1, '#0d5a3d');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw satellites
    const drawSatellites = (count: number, radius: number, color: string) => {
      for (let i = 0; i < Math.min(count, 50); i++) {
        const angle = ((i / count) * 360 + rotation) * (Math.PI / 180);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    drawSatellites(8000, 60, '#00F0FF');
    drawSatellites(600, 100, '#F59E0B');
    drawSatellites(500, 140, '#A78BFA');
  }, [rotation]);

  const selected = constellations.find(c => c.shell === selectedShell);

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
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Satellite Constellation Mapper</h1>
                <p className="text-secondary-foreground text-sm">Real-time orbital shell visualization</p>
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {constellations.map((constellation) => (
              <motion.button
                key={constellation.shell}
                onClick={() => setSelectedShell(constellation.shell)}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedShell === constellation.shell
                    ? `border-[${constellation.color}] bg-[#131924]/60`
                    : 'border-[#00F0FF33] bg-[#131924]/30 hover:border-[#00F0FF]'
                }`}
              >
                <div className="text-sm font-mono mb-2" style={{ color: constellation.color }}>
                  {constellation.shell} ({constellation.altitude} km)
                </div>
                <div className="text-4xl font-bold font-mono" style={{ color: constellation.color }}>
                  {constellation.count.toLocaleString()}
                </div>
                <div className="text-xs text-secondary-foreground mt-2">Active satellites</div>
              </motion.button>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas */}
            <div className="lg:col-span-2 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className="w-full border border-[#00F0FF33] rounded-lg"
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              {selected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6"
                >
                  <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4 flex items-center gap-2">
                    <Satellite size={18} />
                    {selected.shell} Shell
                  </h3>
                  <div className="space-y-4 text-sm font-mono">
                    <div>
                      <span className="text-[#FF007A]">Altitude:</span>
                      <div className="text-[#00F0FF] text-lg font-bold">{selected.altitude} km</div>
                    </div>
                    <div>
                      <span className="text-[#FF007A]">Total Satellites:</span>
                      <div className="text-[#00F0FF] text-lg font-bold">{selected.count.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-[#FF007A]">Coverage:</span>
                      <div className="text-[#00F0FF] text-lg font-bold">{selected.coverage}%</div>
                      <div className="w-full bg-[#0B0E14] rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-[#00F0FF] to-[#FF007A] h-2 rounded-full"
                          style={{ width: `${selected.coverage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Legend */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
                <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-4">Orbital Shells</h3>
                <div className="space-y-3">
                  {constellations.map((constellation) => (
                    <div key={constellation.shell} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: constellation.color }}
                      />
                      <div className="text-xs font-mono">
                        <div className="text-foreground">{constellation.shell}</div>
                        <div className="text-secondary-foreground">{constellation.altitude} km</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
                <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-3">Total Network</h3>
                <div className="text-3xl font-bold text-[#00F0FF] font-mono">
                  {constellations.reduce((sum, c) => sum + c.count, 0).toLocaleString()}
                </div>
                <div className="text-xs text-secondary-foreground mt-2">Active satellites worldwide</div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
