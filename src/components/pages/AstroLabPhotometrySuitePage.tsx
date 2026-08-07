import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AstroLabPhotometrySuitePage() {
  const navigate = useNavigate();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [aperture, setAperture] = useState(50);
  const [snr, setSNR] = useState(0);
  const [magnitude, setMagnitude] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [exposure, setExposure] = useState(30);
  const [gain, setGain] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw FITS-like image
    ctx.fillStyle = '#1a1f2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Gaussian star with realistic PSF
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const sigma = aperture / 6;

    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const intensity = Math.exp(-(dist * dist) / (2 * sigma * sigma)) * gain * (exposure / 30);
        const value = Math.floor(intensity * 255);
        ctx.fillStyle = `rgb(${value}, ${Math.floor(value * 0.8)}, ${Math.floor(value * 0.6)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Draw aperture circles
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, aperture, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#FF007A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, aperture * 1.5, 0, Math.PI * 2);
    ctx.stroke();

    // Calculate metrics
    const flux = Math.PI * aperture * aperture * 100 * gain * (exposure / 30);
    const noise = Math.sqrt(flux);
    setSNR(Math.round(flux / noise));
    setMagnitude(parseFloat((10 - Math.log10(flux)).toFixed(2)));
  }, [aperture, gain, exposure]);

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
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Photometry Suite</h1>
                <p className="text-secondary-foreground text-sm">Professional stellar photometry & aperture analysis</p>
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
              <div className="space-y-4">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="w-full border border-[#00F0FF33] rounded-lg"
                />
                
                {/* Image Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-[#FF007A]">Exposure: {exposure}s</label>
                    <input
                      type="range"
                      min="1"
                      max="120"
                      value={exposure}
                      onChange={(e) => setExposure(parseInt(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#FF007A]">Gain: {gain.toFixed(1)}x</label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={gain}
                      onChange={(e) => setGain(parseFloat(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Controls & Results */}
            <div className="space-y-4">
              {/* Aperture Control */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Aperture Control</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-mono text-[#FF007A]">Aperture Radius: {aperture}px</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={aperture}
                      onChange={(e) => setAperture(parseInt(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                  <div className="text-xs font-mono text-secondary-foreground">
                    <div>Sky Annulus: {(aperture * 1.5).toFixed(0)}px</div>
                    <div>Inner Radius: {(aperture * 0.8).toFixed(0)}px</div>
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Measurements</h3>
                <div className="space-y-3 text-sm font-mono">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#0B0E14] p-3 rounded border border-[#00F0FF33]"
                  >
                    <span className="text-[#FF007A]">SNR:</span>
                    <span className="text-[#00F0FF] ml-2 text-lg font-bold">{snr}</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#0B0E14] p-3 rounded border border-[#00F0FF33]"
                  >
                    <span className="text-[#FF007A]">Magnitude:</span>
                    <span className="text-[#00F0FF] ml-2 text-lg font-bold">{magnitude.toFixed(2)}</span>
                  </motion.div>
                  <div className="bg-[#0B0E14] p-3 rounded border border-[#00F0FF33]">
                    <span className="text-[#FF007A]">FWHM:</span>
                    <span className="text-[#00F0FF] ml-2">{(aperture * 0.3).toFixed(1)}"</span>
                  </div>
                </div>
              </div>

              {/* Export */}
              <button className="w-full px-4 py-3 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] rounded-lg font-mono text-sm hover:bg-[#00F0FF]/30 transition-all flex items-center justify-center gap-2">
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
