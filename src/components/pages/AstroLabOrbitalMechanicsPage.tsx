import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AstroLabOrbitalMechanicsPage() {
  const navigate = useNavigate();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [a, setA] = useState(6.6e6);
  const [e, setE] = useState(0.0167);
  const [i, setI] = useState(0);
  const [M, setM] = useState(5.972e24);
  const [isRunning, setIsRunning] = useState(true);
  const [anomaly, setAnomaly] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setAnomaly(a => (a + 2) % 360), 50);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 1e-7;

    // Draw orbital ellipse
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const b = a * Math.sqrt(Math.max(0, 1 - e * e));
    const c = a * e;
    
    for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
      const r = (a * (1 - e * e)) / (1 + e * Math.cos(angle));
      const x = centerX + r * Math.cos(angle) * scale;
      const y = centerY + r * Math.sin(angle) * scale * Math.cos(i * Math.PI / 180);
      if (angle === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Draw focal point (empty focus)
    ctx.strokeStyle = '#FF007A';
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX + c * scale, centerY, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw central body (Sun)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw satellite
    const trueAnomaly = (anomaly * Math.PI / 180);
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly));
    const satX = centerX + r * Math.cos(trueAnomaly) * scale;
    const satY = centerY + r * Math.sin(trueAnomaly) * scale * Math.cos(i * Math.PI / 180);
    
    ctx.fillStyle = '#00F0FF';
    ctx.beginPath();
    ctx.arc(satX, satY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw velocity vector
    ctx.strokeStyle = '#FF007A';
    ctx.lineWidth = 2;
    const vx = -Math.sin(trueAnomaly);
    const vy = e + Math.cos(trueAnomaly);
    ctx.beginPath();
    ctx.moveTo(satX, satY);
    ctx.lineTo(satX + vx * 30, satY + vy * 30);
    ctx.stroke();

    // Draw periapsis and apoapsis
    ctx.strokeStyle = '#A78BFA';
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    
    // Periapsis
    const rp = a * (1 - e);
    ctx.beginPath();
    ctx.arc(centerX + rp * scale, centerY, 2, 0, Math.PI * 2);
    ctx.stroke();
    
    // Apoapsis
    const ra = a * (1 + e);
    ctx.beginPath();
    ctx.arc(centerX - ra * scale, centerY, 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, [a, e, i, M, anomaly]);

  const G = 6.674e-11;
  const T = 2 * Math.PI * Math.sqrt((a ** 3) / (G * M));
  const vPeriapsis = Math.sqrt(G * M * (2 / a - 2 / (a * (1 - e))));
  const vApoapsis = Math.sqrt(G * M * (2 / a - 2 / (a * (1 + e))));
  const rPeriapsis = a * (1 - e);
  const rApoapsis = a * (1 + e);
  const semiLatusRectum = a * (1 - e * e);

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
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Orbital Mechanics Calculator</h1>
                <p className="text-secondary-foreground text-sm">Keplerian elements & orbital dynamics</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas */}
            <div className="lg:col-span-2 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
              <canvas
                ref={canvasRef}
                width={500}
                height={400}
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
                  onClick={() => setAnomaly(0)}
                  className="px-4 py-2 bg-[#131924] text-secondary-foreground border border-[#00F0FF33] rounded-lg font-mono text-sm hover:border-[#00F0FF] transition-all flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>

            {/* Controls & Results */}
            <div className="space-y-4">
              {/* Keplerian Elements */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-3">Keplerian Elements</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#FF007A]">a (m)</label>
                    <input
                      type="number"
                      value={a}
                      onChange={(e) => setA(parseFloat(e.target.value))}
                      className="w-full mt-1 px-2 py-1 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[#FF007A]">e</label>
                    <input
                      type="number"
                      value={e}
                      onChange={(e) => setE(Math.max(0, Math.min(0.999, parseFloat(e.target.value))))}
                      step="0.001"
                      className="w-full mt-1 px-2 py-1 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[#FF007A]">i (°)</label>
                    <input
                      type="number"
                      value={i}
                      onChange={(e) => setI(parseFloat(e.target.value))}
                      className="w-full mt-1 px-2 py-1 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-3">Orbital Parameters</h3>
                <div className="space-y-2 text-xs font-mono">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0B0E14] p-2 rounded border border-[#00F0FF33]">
                    <span className="text-[#FF007A]">Period:</span>
                    <span className="text-[#00F0FF] ml-2">{(T / 3600).toFixed(2)}h</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0B0E14] p-2 rounded border border-[#00F0FF33]">
                    <span className="text-[#FF007A]">r_p:</span>
                    <span className="text-[#00F0FF] ml-2">{(rPeriapsis / 1e6).toFixed(2)}Mm</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0B0E14] p-2 rounded border border-[#00F0FF33]">
                    <span className="text-[#FF007A]">r_a:</span>
                    <span className="text-[#00F0FF] ml-2">{(rApoapsis / 1e6).toFixed(2)}Mm</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0B0E14] p-2 rounded border border-[#00F0FF33]">
                    <span className="text-[#FF007A]">v_p:</span>
                    <span className="text-[#00F0FF] ml-2">{(vPeriapsis / 1000).toFixed(2)}km/s</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0B0E14] p-2 rounded border border-[#00F0FF33]">
                    <span className="text-[#FF007A]">v_a:</span>
                    <span className="text-[#00F0FF] ml-2">{(vApoapsis / 1000).toFixed(2)}km/s</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0B0E14] p-2 rounded border border-[#00F0FF33]">
                    <span className="text-[#FF007A]">p:</span>
                    <span className="text-[#00F0FF] ml-2">{(semiLatusRectum / 1e6).toFixed(2)}Mm</span>
                  </motion.div>
                </div>
              </div>

              {/* Export */}
              <button className="w-full px-3 py-2 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] rounded font-mono text-xs hover:bg-[#00F0FF]/30 transition-all flex items-center justify-center gap-2">
                <Download size={14} />
                Export Sheet
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
