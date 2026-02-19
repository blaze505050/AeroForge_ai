import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AirfoilPoint {
  x: number;
  y: number;
}

export default function AirfoilDesignerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nacaCode, setNacaCode] = useState('2412');
  const [thickness, setThickness] = useState(12);
  const [camber, setCamber] = useState(2);
  const [points, setPoints] = useState<AirfoilPoint[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);

  // Generate NACA 4-digit airfoil
  const generateNACA4 = (code: string) => {
    const m = parseInt(code[0]) / 100;
    const p = parseInt(code[1]) / 10;
    const t = parseInt(code.substring(2)) / 100;

    const newPoints: AirfoilPoint[] = [];
    const n = 100;

    for (let i = 0; i <= n; i++) {
      const x = i / n;
      let yc = 0;
      let dyc_dx = 0;

      if (x <= p) {
        yc = (m / (p * p)) * (2 * p * x - x * x);
        dyc_dx = (2 * m / (p * p)) * (p - x);
      } else {
        yc = (m / ((1 - p) * (1 - p))) * (1 - 2 * p + 2 * p * x - x * x);
        dyc_dx = (2 * m / ((1 - p) * (1 - p))) * (p - x);
      }

      const theta = Math.atan(dyc_dx);
      const yt = (t / 0.2) * (0.2969 * Math.sqrt(x) - 0.1260 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1015 * x * x * x * x);

      const xu = x - yt * Math.sin(theta);
      const yu = yc + yt * Math.cos(theta);
      const xl = x + yt * Math.sin(theta);
      const yl = yc - yt * Math.cos(theta);

      newPoints.push({ x: xu, y: yu });
    }

    for (let i = n; i >= 0; i--) {
      const x = i / n;
      let yc = 0;
      let dyc_dx = 0;

      if (x <= p) {
        yc = (m / (p * p)) * (2 * p * x - x * x);
        dyc_dx = (2 * m / (p * p)) * (p - x);
      } else {
        yc = (m / ((1 - p) * (1 - p))) * (1 - 2 * p + 2 * p * x - x * x);
        dyc_dx = (2 * m / ((1 - p) * (1 - p))) * (p - x);
      }

      const theta = Math.atan(dyc_dx);
      const yt = (t / 0.2) * (0.2969 * Math.sqrt(x) - 0.1260 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1015 * x * x * x * x);

      const xl = x + yt * Math.sin(theta);
      const yl = yc - yt * Math.cos(theta);

      newPoints.push({ x: xl, y: yl });
    }

    setPoints(newPoints);
  };

  // Update NACA code from sliders
  const updateNACA = (m: number, p: number, t: number) => {
    const code = `${m}${p}${String(t).padStart(2, '0')}`;
    setNacaCode(code);
    setCamber(m);
    setThickness(t);
    generateNACA4(code);
  };

  // Draw airfoil on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const drawWidth = width - 2 * padding;
    const drawHeight = height - 2 * padding;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * drawWidth;
      const y = padding + (i / 10) * drawHeight;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw airfoil
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    points.forEach((point, index) => {
      const x = padding + point.x * drawWidth * scale;
      const y = height - padding - point.y * drawHeight * scale;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw centerline
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [points, scale]);

  // Initialize with default NACA
  useEffect(() => {
    generateNACA4(nacaCode);
  }, []);

  const handleDownloadCSV = () => {
    let csv = 'x,y\n';
    points.forEach(point => {
      csv += `${point.x.toFixed(6)},${point.y.toFixed(6)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airfoil_${nacaCode}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="w-full max-w-[120rem] mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">
            Airfoil Designer
          </h1>
          <p className="font-paragraph text-slate-400 mb-8">
            Design and visualize NACA airfoil profiles with real-time geometry generation
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="font-heading text-xl font-bold text-white mb-6">
                  NACA Configuration
                </h2>

                {/* NACA Code Display */}
                <div className="mb-6">
                  <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                    NACA Code
                  </label>
                  <div className="bg-slate-900 rounded-lg p-3 border border-slate-600 text-center">
                    <span className="font-heading text-2xl font-bold text-blue-400">
                      {nacaCode}
                    </span>
                  </div>
                </div>

                {/* Camber Slider */}
                <div className="mb-6">
                  <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                    Max Camber: {camber}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="9"
                    value={camber}
                    onChange={(e) => updateNACA(parseInt(e.target.value), Math.floor(thickness / 10), thickness % 10)}
                    className="w-full"
                  />
                </div>

                {/* Thickness Slider */}
                <div className="mb-6">
                  <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                    Max Thickness: {thickness}%
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="21"
                    value={thickness}
                    onChange={(e) => updateNACA(camber, Math.floor(thickness / 10), parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Scale Slider */}
                <div className="mb-6">
                  <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
                    Zoom: {(scale * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setNacaCode('2412');
                      updateNACA(2, 4, 12);
                    }}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-paragraph font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-paragraph font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV
                  </button>
                </div>
              </div>

              {/* Airfoil Info */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="font-heading text-lg font-bold text-white mb-4">
                  Profile Info
                </h3>
                <div className="space-y-3 font-paragraph text-sm text-slate-300">
                  <div>
                    <span className="text-slate-400">Points:</span>
                    <span className="ml-2 text-white font-semibold">{points.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Thickness:</span>
                    <span className="ml-2 text-white font-semibold">{thickness}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Camber:</span>
                    <span className="ml-2 text-white font-semibold">{camber}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full bg-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: 'NACA Profiles',
                description: 'Generate any NACA 4-digit airfoil profile with precise geometry',
              },
              {
                title: 'Real-time Visualization',
                description: 'See your airfoil design update instantly as you adjust parameters',
              },
              {
                title: 'CSV Export',
                description: 'Download coordinate data in CSV format for use in other tools',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="font-paragraph text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
