import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, ZoomIn, ZoomOut, Crosshair, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface CelestialObject {
  id: string;
  name: string;
  ra: number; // Right Ascension (0-24 hours)
  dec: number; // Declination (-90 to +90 degrees)
  magnitude: number;
  type: string;
  distance?: string;
}

export default function AstroLabDeepSpaceObservationPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [centerRA, setCenterRA] = useState(12);
  const [centerDec, setCenterDec] = useState(0);
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const celestialObjects: CelestialObject[] = [
    { id: 'andromeda', name: 'Andromeda Galaxy', ra: 0.71, dec: 41.27, magnitude: 3.4, type: 'Galaxy', distance: '2.5M ly' },
    { id: 'orion', name: 'Orion Nebula', ra: 5.55, dec: -5.39, magnitude: 4.0, type: 'Nebula', distance: '1,344 ly' },
    { id: 'sirius', name: 'Sirius', ra: 6.75, dec: -16.71, magnitude: -1.46, type: 'Star', distance: '8.6 ly' },
    { id: 'vega', name: 'Vega', ra: 18.60, dec: 38.78, magnitude: 0.03, type: 'Star', distance: '25 ly' },
    { id: 'crab', name: 'Crab Nebula', ra: 5.58, dec: 22.01, magnitude: 8.4, type: 'Nebula', distance: '6,500 ly' },
    { id: 'horsehead', name: 'Horsehead Nebula', ra: 5.40, dec: -2.27, magnitude: 13.0, type: 'Nebula', distance: '1,500 ly' },
    { id: 'ring', name: 'Ring Nebula', ra: 18.89, dec: 33.02, magnitude: 8.8, type: 'Nebula', distance: '2,000 ly' },
    { id: 'pleiades', name: 'Pleiades', ra: 3.79, dec: 24.11, magnitude: 1.6, type: 'Star Cluster', distance: '444 ly' },
  ];

  const filteredObjects = celestialObjects.filter(obj =>
    obj.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Draw sky map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with deep space background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, height);

    // Draw stars (background)
    ctx.fillStyle = '#E2E8F0';
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5;
      const opacity = Math.random() * 0.7 + 0.3;
      ctx.globalAlpha = opacity;
      ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;

    // Draw coordinate grid
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.2;

    // RA lines (vertical)
    for (let ra = 0; ra < 24; ra += 2) {
      const x = (width / 24) * ra;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Dec lines (horizontal)
    for (let dec = -90; dec <= 90; dec += 30) {
      const y = height / 2 + (height / 180) * dec;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Draw center crosshair
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 20, height / 2);
    ctx.lineTo(width / 2 + 20, height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2 - 20);
    ctx.lineTo(width / 2, height / 2 + 20);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw celestial objects
    filteredObjects.forEach((obj) => {
      const raOffset = (obj.ra - centerRA) * (width / 24) / zoom;
      const decOffset = (obj.dec - centerDec) * (height / 180) / zoom;

      const x = width / 2 + raOffset;
      const y = height / 2 - decOffset;

      // Only draw if visible
      if (x > -50 && x < width + 50 && y > -50 && y < height + 50) {
        const size = Math.max(3, 8 - obj.magnitude);

        // Glow
        ctx.fillStyle = obj.type === 'Nebula' ? '#06B6D4' : '#0EA5E9';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Main point
        ctx.fillStyle = selectedObject?.id === obj.id ? '#F59E0B' : obj.type === 'Nebula' ? '#06B6D4' : '#0EA5E9';
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '11px monospace';
        ctx.fillText(obj.name, x + 10, y - 5);
      }
    });

    // Draw info
    ctx.fillStyle = '#0EA5E9';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`RA: ${centerRA.toFixed(1)}h | Dec: ${centerDec.toFixed(1)}° | Zoom: ${zoom.toFixed(1)}x`, 20, 30);
  }, [zoom, centerRA, centerDec, filteredObjects, selectedObject]);

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
                  Deep-Space Observation & Mapping
                </h1>
                <p className="font-paragraph text-lg text-secondary-foreground max-w-3xl">
                  Advanced astronomical survey visualization with Pan-STARRS and DSS data. Explore galaxies, nebulae, and star clusters with real celestial coordinates.
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
                  <canvas
                    ref={canvasRef}
                    width={700}
                    height={600}
                    className="w-full bg-aerospace-dark rounded-lg cursor-crosshair"
                  />
                </motion.div>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                {/* Search */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-aerospace-blue" />
                    <input
                      type="text"
                      placeholder="Search objects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-primary/40 border border-aerospace-blue/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-aerospace-blue"
                    />
                  </div>
                </motion.div>

                {/* Zoom Controls */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6"
                >
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Zoom</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/40 text-aerospace-blue border border-aerospace-blue/20 rounded-lg hover:bg-primary/60 transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                      Zoom Out
                    </button>
                    <div className="text-center text-sm text-foreground/60">
                      {zoom.toFixed(1)}x
                    </div>
                    <button
                      onClick={() => setZoom(Math.min(5, zoom + 0.5))}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-aerospace-blue text-white rounded-lg hover:bg-aerospace-accent transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                      Zoom In
                    </button>
                  </div>
                </motion.div>

                {/* Navigation */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6"
                >
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Navigation</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-foreground/60">Right Ascension (0-24h)</label>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        step="0.1"
                        value={centerRA}
                        onChange={(e) => setCenterRA(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-sm text-aerospace-blue font-mono">{centerRA.toFixed(2)}h</p>
                    </div>
                    <div>
                      <label className="text-xs text-foreground/60">Declination (-90 to +90°)</label>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        step="1"
                        value={centerDec}
                        onChange={(e) => setCenterDec(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-sm text-aerospace-blue font-mono">{centerDec.toFixed(1)}°</p>
                    </div>
                  </div>
                </motion.div>

                {/* Objects List */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-aerospace-dark/60 to-aerospace-dark/40 border border-aerospace-blue/20 rounded-lg p-6 max-h-96 overflow-y-auto"
                >
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Visible Objects</h3>
                  <div className="space-y-2">
                    {filteredObjects.map((obj) => (
                      <button
                        key={obj.id}
                        onClick={() => setSelectedObject(selectedObject?.id === obj.id ? null : obj)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedObject?.id === obj.id
                            ? 'bg-aerospace-blue/30 border border-aerospace-blue'
                            : 'bg-primary/40 border border-aerospace-blue/20 hover:border-aerospace-blue/50'
                        }`}
                      >
                        <p className="font-mono text-sm font-bold text-aerospace-blue">{obj.name}</p>
                        <p className="text-xs text-foreground/60 mt-1">{obj.type} • Mag: {obj.magnitude}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Selected Object Details */}
                {selectedObject && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-aerospace-blue/20 to-aerospace-accent/20 border border-aerospace-blue/50 rounded-lg p-6"
                  >
                    <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                      {selectedObject.name}
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-foreground/60">Type</p>
                        <p className="font-mono text-aerospace-blue">{selectedObject.type}</p>
                      </div>
                      <div>
                        <p className="text-foreground/60">RA / Dec</p>
                        <p className="font-mono text-aerospace-blue">{selectedObject.ra.toFixed(2)}h / {selectedObject.dec.toFixed(2)}°</p>
                      </div>
                      <div>
                        <p className="text-foreground/60">Magnitude</p>
                        <p className="font-mono text-aerospace-blue">{selectedObject.magnitude}</p>
                      </div>
                      {selectedObject.distance && (
                        <div>
                          <p className="text-foreground/60">Distance</p>
                          <p className="font-mono text-aerospace-blue">{selectedObject.distance}</p>
                        </div>
                      )}
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
