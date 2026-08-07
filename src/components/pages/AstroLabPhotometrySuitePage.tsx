import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Settings, Play, Pause, RotateCcw, BarChart3, Zap, Eye, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PhotometryData {
  aperture: number;
  skyAnnulus: number;
  gain: number;
  exposure: number;
  snr: number;
  magnitude: number;
  flux: number;
  skyBackground: number;
  fwhm: number;
}

export default function AstroLabPhotometrySuitePage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<HTMLCanvasElement>(null);
  
  const [aperture, setAperture] = useState(50);
  const [skyAnnulus, setSkyAnnulus] = useState(80);
  const [exposure, setExposure] = useState(30);
  const [gain, setGain] = useState(1.5);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'aperture' | 'psf' | 'lightcurve'>('aperture');
  const [photometryData, setPhotometryData] = useState<PhotometryData>({
    aperture: 50,
    skyAnnulus: 80,
    gain: 1.5,
    exposure: 30,
    snr: 0,
    magnitude: 0,
    flux: 0,
    skyBackground: 0,
    fwhm: 0,
  });
  const [lightCurveData, setLightCurveData] = useState<number[]>([]);
  const [time, setTime] = useState(0);

  // Calculate photometry metrics
  useEffect(() => {
    const sigma = aperture / 6;
    const flux = Math.PI * aperture * aperture * 100 * gain * (exposure / 30);
    const skyFlux = Math.PI * (skyAnnulus * skyAnnulus - aperture * aperture) * 50 * gain * (exposure / 30);
    const skyBackground = skyFlux / (Math.PI * (skyAnnulus * skyAnnulus - aperture * aperture));
    const noise = Math.sqrt(flux + skyFlux);
    const snr = Math.round(flux / noise);
    const magnitude = 10 - Math.log10(Math.max(flux, 1));
    const fwhm = sigma * 2.355;

    setPhotometryData({
      aperture,
      skyAnnulus,
      gain,
      exposure,
      snr,
      magnitude: parseFloat(magnitude.toFixed(2)),
      flux: parseFloat(flux.toFixed(0)),
      skyBackground: parseFloat(skyBackground.toFixed(2)),
      fwhm: parseFloat(fwhm.toFixed(2)),
    });
  }, [aperture, skyAnnulus, gain, exposure]);

  // Simulate light curve
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTime(t => t + 1);
      setLightCurveData(prev => {
        const newData = [...prev];
        const magnitude = 10 - Math.log10(Math.max(photometryData.flux * (0.8 + 0.4 * Math.sin(time * 0.05)), 1));
        newData.push(magnitude);
        if (newData.length > 200) newData.shift();
        return newData;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning, photometryData.flux, time]);

  // Draw FITS image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const sigma = aperture / 6;

    // Draw background
    ctx.fillStyle = '#1a1f2e';
    ctx.fillRect(0, 0, width, height);

    // Draw Gaussian star with realistic PSF
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
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

    // Sky annulus
    ctx.strokeStyle = '#FF007A';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, skyAnnulus, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Center crosshair
    ctx.strokeStyle = '#A78BFA';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(centerX - 20, centerY);
    ctx.lineTo(centerX + 20, centerY);
    ctx.moveTo(centerX, centerY - 20);
    ctx.lineTo(centerX, centerY + 20);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, [aperture, skyAnnulus, gain, exposure]);

  // Draw light curve
  useEffect(() => {
    const canvas = graphRef.current;
    if (!canvas || lightCurveData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Background
    ctx.fillStyle = '#1a1f2e';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#00F0FF';
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = padding + (i / 10) * (height - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Axes
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Plot data
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const minMag = Math.min(...lightCurveData);
    const maxMag = Math.max(...lightCurveData);
    const magRange = maxMag - minMag || 1;

    lightCurveData.forEach((mag, idx) => {
      const x = padding + (idx / Math.max(lightCurveData.length - 1, 1)) * (width - 2 * padding);
      const y = height - padding - ((mag - minMag) / magRange) * (height - 2 * padding);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('Time (s)', width / 2 - 30, height - 10);
    ctx.save();
    ctx.translate(10, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Magnitude', 0, 0);
    ctx.restore();
  }, [lightCurveData]);

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      parameters: photometryData,
      lightCurve: lightCurveData,
    };
    
    const csv = [
      ['Photometry Analysis Report'],
      ['Timestamp', data.timestamp],
      [''],
      ['Parameters'],
      ['Aperture Radius (px)', photometryData.aperture],
      ['Sky Annulus (px)', photometryData.skyAnnulus],
      ['Gain', photometryData.gain],
      ['Exposure (s)', photometryData.exposure],
      [''],
      ['Results'],
      ['Signal-to-Noise Ratio', photometryData.snr],
      ['Magnitude', photometryData.magnitude],
      ['Flux (ADU)', photometryData.flux],
      ['Sky Background', photometryData.skyBackground],
      ['FWHM (px)', photometryData.fwhm],
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `photometry-${new Date().toISOString().split('T')[0]}.csv`;
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
                <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Photometry Suite</h1>
                <p className="text-secondary-foreground text-sm">Professional stellar photometry & aperture analysis</p>
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

          {/* Mode Selector */}
          <div className="flex gap-2">
            {(['aperture', 'psf', 'lightcurve'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition ${
                  selectedMode === mode
                    ? 'bg-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]'
                    : 'bg-[#131924]/60 text-secondary-foreground border border-[#475569] hover:border-[#00F0FF]'
                }`}
              >
                {mode === 'aperture' && 'Aperture Photometry'}
                {mode === 'psf' && 'PSF Analysis'}
                {mode === 'lightcurve' && 'Light Curve'}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas Area */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg overflow-hidden">
                {selectedMode === 'aperture' && (
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={500}
                    className="w-full"
                  />
                )}
                {selectedMode === 'psf' && (
                  <div className="p-6 text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-lg font-mono text-[#00F0FF] mb-2">PSF Analysis</h3>
                    <p className="text-secondary-foreground text-sm mb-4">Point Spread Function: {photometryData.fwhm.toFixed(2)} pixels</p>
                    <div className="bg-[#0B0E14] p-4 rounded text-left font-mono text-xs space-y-2">
                      <div className="flex justify-between"><span className="text-secondary-foreground">FWHM:</span><span className="text-[#00F0FF]">{photometryData.fwhm.toFixed(2)} px</span></div>
                      <div className="flex justify-between"><span className="text-secondary-foreground">Sigma:</span><span className="text-[#00F0FF]">{(photometryData.fwhm / 2.355).toFixed(2)} px</span></div>
                      <div className="flex justify-between"><span className="text-secondary-foreground">Eccentricity:</span><span className="text-[#00F0FF]">0.12</span></div>
                      <div className="flex justify-between"><span className="text-secondary-foreground">Peak Value:</span><span className="text-[#00F0FF]">{Math.floor(photometryData.flux * 0.1)} ADU</span></div>
                    </div>
                  </div>
                )}
                {selectedMode === 'lightcurve' && (
                  <canvas
                    ref={graphRef}
                    width={600}
                    height={400}
                    className="w-full"
                  />
                )}
              </div>

              {/* Light Curve Controls */}
              {selectedMode === 'lightcurve' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] rounded-lg hover:bg-[#00F0FF]/30 transition font-mono text-sm flex-1"
                  >
                    {isRunning ? <Pause size={16} /> : <Play size={16} />}
                    {isRunning ? 'Stop' : 'Start'}
                  </button>
                  <button
                    onClick={() => {
                      setLightCurveData([]);
                      setTime(0);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A] rounded-lg hover:bg-[#FF007A]/30 transition font-mono text-sm"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Control Panel */}
            <div className="space-y-4">
              {/* Aperture Controls */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-4">Aperture Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-secondary-foreground font-mono block mb-2">
                      Aperture Radius: <span className="text-[#00F0FF]">{aperture.toFixed(0)} px</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="150"
                      value={aperture}
                      onChange={(e) => setAperture(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-secondary-foreground font-mono block mb-2">
                      Sky Annulus: <span className="text-[#FF007A]">{skyAnnulus.toFixed(0)} px</span>
                    </label>
                    <input
                      type="range"
                      min={aperture + 10}
                      max="200"
                      value={skyAnnulus}
                      onChange={(e) => setSkyAnnulus(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-secondary-foreground font-mono block mb-2">
                      Gain: <span className="text-[#A78BFA]">{gain.toFixed(2)} e-/ADU</span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.1"
                      value={gain}
                      onChange={(e) => setGain(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-secondary-foreground font-mono block mb-2">
                      Exposure: <span className="text-[#10B981]">{exposure.toFixed(1)} s</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="120"
                      step="0.5"
                      value={exposure}
                      onChange={(e) => setExposure(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-4 flex items-center gap-2">
                  <BarChart3 size={14} />
                  Results
                </h3>
                
                <div className="space-y-3 text-xs font-mono">
                  <div className="bg-[#0B0E14] p-3 rounded border border-[#00F0FF33]">
                    <div className="text-secondary-foreground mb-1">Signal-to-Noise</div>
                    <div className="text-2xl font-bold text-[#00F0FF]">{photometryData.snr}</div>
                  </div>

                  <div className="bg-[#0B0E14] p-3 rounded border border-[#FF007A33]">
                    <div className="text-secondary-foreground mb-1">Magnitude</div>
                    <div className="text-2xl font-bold text-[#FF007A]">{photometryData.magnitude.toFixed(2)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0B0E14] p-2 rounded border border-[#F59E0B33]">
                      <div className="text-secondary-foreground text-[10px] mb-1">Flux</div>
                      <div className="text-[#F59E0B] font-bold">{photometryData.flux.toFixed(0)}</div>
                    </div>
                    <div className="bg-[#0B0E14] p-2 rounded border border-[#A78BFA33]">
                      <div className="text-secondary-foreground text-[10px] mb-1">FWHM</div>
                      <div className="text-[#A78BFA] font-bold">{photometryData.fwhm.toFixed(1)}</div>
                    </div>
                  </div>

                  <div className="bg-[#0B0E14] p-2 rounded border border-[#10B98133]">
                    <div className="text-secondary-foreground text-[10px] mb-1">Sky Background</div>
                    <div className="text-[#10B981] font-bold">{photometryData.skyBackground.toFixed(1)} ADU</div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
                <h3 className="text-sm font-mono font-bold text-[#00F0FF] mb-3">Detector Info</h3>
                <div className="space-y-2 text-xs font-mono text-secondary-foreground">
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span className="text-[#00F0FF]">1024x1024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pixel Scale:</span>
                    <span className="text-[#00F0FF]">0.5 "/px</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Read Noise:</span>
                    <span className="text-[#00F0FF]">3.2 e-</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dark Current:</span>
                    <span className="text-[#00F0FF]">0.01 e-/s</span>
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
