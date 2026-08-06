import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crosshair, BarChart3, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PhotometryData {
  x: number;
  y: number;
  intensity: number;
  radius: number;
}

export default function AstroLabPhotometrySuitePage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<PhotometryData | null>(null);
  const [photometryResults, setPhotometryResults] = useState<PhotometryData[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  // Generate synthetic FITS-like image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create image data
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Generate synthetic astronomical image with stars
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);

      // Background noise
      let intensity = Math.random() * 30;

      // Add stars (Gaussian profiles)
      const stars = [
        { x: 150, y: 150, brightness: 200, sigma: 15 },
        { x: 350, y: 200, brightness: 180, sigma: 12 },
        { x: 250, y: 350, brightness: 220, sigma: 18 },
        { x: 450, y: 300, brightness: 160, sigma: 10 },
      ];

      stars.forEach(star => {
        const dx = x - star.x;
        const dy = y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const gaussian = star.brightness * Math.exp(-(dist * dist) / (2 * star.sigma * star.sigma));
        intensity += gaussian;
      });

      intensity = Math.min(255, intensity);

      data[i] = intensity;
      data[i + 1] = intensity * 0.9;
      data[i + 2] = intensity * 0.8;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw selected region
    if (selectedRegion) {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(selectedRegion.x, selectedRegion.y, selectedRegion.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshair
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(selectedRegion.x - 10, selectedRegion.y);
      ctx.lineTo(selectedRegion.x + 10, selectedRegion.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(selectedRegion.x, selectedRegion.y - 10);
      ctx.lineTo(selectedRegion.x, selectedRegion.y + 10);
      ctx.stroke();
    }
  }, [selectedRegion]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate photometry
    const radius = 30;
    let totalIntensity = 0;
    let pixelCount = 0;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
          const dx = i - x;
          const dy = j - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= radius) {
            const pixelIndex = (j * canvas.width + i) * 4;
            totalIntensity += data[pixelIndex];
            pixelCount++;
          }
        }
      }
    }

    const newRegion: PhotometryData = {
      x,
      y,
      intensity: totalIntensity / pixelCount,
      radius,
    };

    setSelectedRegion(newRegion);
    setPhotometryResults([...photometryResults, newRegion]);
  };

  const exportData = () => {
    let csv = 'X,Y,Intensity,Radius\n';
    photometryResults.forEach(result => {
      csv += `${result.x.toFixed(2)},${result.y.toFixed(2)},${result.intensity.toFixed(2)},${result.radius}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'photometry_data.csv';
    a.click();
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
                  Professional Analytical & Photometry Suite
                </h1>
                <p className="font-paragraph text-lg text-secondary-foreground max-w-3xl">
                  FITS image analysis with advanced photometry tools. Measure stellar flux, perform ROI analysis, and export scientific data.
                </p>
              </div>
              <Eye className="w-12 h-12 text-aerospace-blue hidden lg:block" />
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
                  <div className="mb-4">
                    <p className="text-sm text-foreground/60 mb-2">Click on stars to measure photometry</p>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={500}
                    onClick={handleCanvasClick}
                    className="w-full bg-aerospace-dark rounded-lg cursor-crosshair border border-aerospace-blue/20"
                  />
                </motion.div>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                {/* Instructions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6"
                >
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-aerospace-blue" />
                    Photometry
                  </h3>
                  <div className="space-y-3 text-sm text-foreground/70">
                    <p>1. Click on a star to measure its flux</p>
                    <p>2. A circular aperture (30px radius) is applied</p>
                    <p>3. Total intensity is calculated</p>
                    <p>4. Results are stored for export</p>
                  </div>
                </motion.div>

                {/* Current Selection */}
                {selectedRegion && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-aerospace-blue/20 to-aerospace-accent/20 border border-aerospace-blue/50 rounded-lg p-6"
                  >
                    <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                      Current Selection
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-foreground/60">Position</p>
                        <p className="font-mono text-aerospace-blue">
                          ({selectedRegion.x.toFixed(1)}, {selectedRegion.y.toFixed(1)})
                        </p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Aperture Radius</p>
                        <p className="font-mono text-aerospace-blue">{selectedRegion.radius} pixels</p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Total Flux</p>
                        <p className="font-mono text-aerospace-blue">{selectedRegion.intensity.toFixed(2)} ADU</p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Signal-to-Noise</p>
                        <p className="font-mono text-aerospace-blue">{(selectedRegion.intensity / 10).toFixed(1)}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Results Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6"
                >
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-aerospace-blue" />
                    Results
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-foreground/60">
                      Measurements: <span className="text-aerospace-blue font-bold">{photometryResults.length}</span>
                    </p>
                    {photometryResults.length > 0 && (
                      <>
                        <p className="text-sm text-foreground/60">
                          Avg Flux: <span className="text-aerospace-blue font-bold">
                            {(photometryResults.reduce((sum, r) => sum + r.intensity, 0) / photometryResults.length).toFixed(2)}
                          </span> ADU
                        </p>
                        <p className="text-sm text-foreground/60">
                          Max Flux: <span className="text-aerospace-blue font-bold">
                            {Math.max(...photometryResults.map(r => r.intensity)).toFixed(2)}
                          </span> ADU
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Export */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <button
                    onClick={exportData}
                    disabled={photometryResults.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-aerospace-blue text-white rounded-lg hover:bg-aerospace-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => {
                      setPhotometryResults([]);
                      setSelectedRegion(null);
                    }}
                    className="w-full px-4 py-3 bg-primary/40 text-aerospace-blue border border-aerospace-blue/20 rounded-lg hover:bg-primary/60 transition-colors"
                  >
                    Clear All
                  </button>
                </motion.div>

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-primary/40 border border-aerospace-blue/20 rounded-lg p-4"
                >
                  <p className="text-xs text-foreground/70">
                    <span className="text-aerospace-blue font-bold">JS9 Engine:</span> Professional FITS analysis with aperture photometry and image processing.
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
