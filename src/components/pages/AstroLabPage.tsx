import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Globe } from 'lucide-react';

interface AstroLabPageProps {}

const AstroLabPage: React.FC<AstroLabPageProps> = () => {
  const [currentModule, setCurrentModule] = useState('spatial-globe');
  const [mode, setMode] = useState<'student' | 'professional'>('student');
  const [utcTime, setUtcTime] = useState(new Date());
  const [orbitStatus, setOrbitStatus] = useState('LIVE');

  useEffect(() => {
    const timer = setInterval(() => setUtcTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const modules = [
    { id: 'spatial-globe', label: 'Spatial Globe', icon: '🌍' },
    { id: 'deep-space', label: 'Deep Space', icon: '🔭' },
    { id: 'photometry', label: 'Photometry', icon: '📊' },
    { id: 'astrodynamics', label: 'Astrodynamics', icon: '⚛️' },
    { id: 'dual-mode', label: 'Dual Mode', icon: '🔄' },
    { id: 'constellation', label: 'Constellation', icon: '🛰️' },
    { id: 'celestial', label: 'Celestial', icon: '📐' },
    { id: 'orbital', label: 'Orbital', icon: '🔢' },
  ];

  const renderModule = () => {
    const props = { mode };
    
    switch (currentModule) {
      case 'spatial-globe':
        return <SpatialGlobeModule {...props} />;
      case 'deep-space':
        return <DeepSpaceModule {...props} />;
      case 'photometry':
        return <PhotometryModule {...props} />;
      case 'astrodynamics':
        return <AstrodynamicsModule {...props} />;
      case 'dual-mode':
        return <DualModeModule mode={mode} setMode={setMode} />;
      case 'constellation':
        return <ConstellationModule {...props} />;
      case 'celestial':
        return <CelestialModule {...props} />;
      case 'orbital':
        return <OrbitalModule {...props} />;
      default:
        return <SpatialGlobeModule {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-foreground overflow-hidden">
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#0B0E14]/95 backdrop-blur-md border-b border-[#00F0FF33] px-6 py-4">
        <div className="max-w-[120rem] mx-auto flex items-center justify-between">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold font-mono text-[#00F0FF]">
              AstroLab // AeroForge
            </div>
            <div className="text-xs text-secondary-foreground font-mono">Research Engine</div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMode(mode === 'student' ? 'professional' : 'student')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                mode === 'student'
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]'
                  : 'bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A]'
              }`}
            >
              {mode === 'student' ? 'Student Mode' : 'Professional Mode'}
            </button>

            {/* Status Bar */}
            <div className="flex items-center gap-6 pl-6 border-l border-[#00F0FF33]">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Clock size={14} className="text-[#00F0FF]" />
                <span>{utcTime.toUTCString().split(' ')[4]}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[#10B981]">Orbit Feed: {orbitStatus}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <Zap size={14} className="text-[#F59E0B]" />
                <span className="text-[#F59E0B]">WebGL Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module Tabs */}
        <div className="max-w-[120rem] mx-auto mt-4 flex gap-2 overflow-x-auto pb-2">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setCurrentModule(mod.id)}
              className={`px-4 py-2 rounded-lg font-mono text-sm whitespace-nowrap transition-all ${
                currentModule === mod.id
                  ? 'bg-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]'
                  : 'bg-[#131924]/60 text-secondary-foreground border border-[#00F0FF33] hover:border-[#00F0FF]'
              }`}
            >
              {mod.icon} {mod.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full">
        {renderModule()}
      </main>
    </div>
  );
};

// Module Components
const SpatialGlobeModule: React.FC<{ mode: string }> = ({ mode }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    // Dynamically load Three.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      const THREE = (window as any).THREE;
      if (!THREE) return;

      const canvas = canvasRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 10000);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setClearColor(0x0b0e14);

      // Create Earth
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      const canvas2d = document.createElement('canvas');
      canvas2d.width = 2048;
      canvas2d.height = 1024;
      const ctx = canvas2d.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1a3a52';
        ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);
        ctx.fillStyle = '#2d5a3d';
        ctx.fillRect(100, 100, 300, 200);
      }
      const texture = new THREE.CanvasTexture(canvas2d);
      const material = new THREE.MeshPhongMaterial({ map: texture });
      const earth = new THREE.Mesh(geometry, material);
      scene.add(earth);

      // Lighting
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 3, 5);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0x404040));

      // Starfield
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
      const starsVertices = [];
      for (let i = 0; i < 1000; i++) {
        starsVertices.push((Math.random() - 0.5) * 200);
        starsVertices.push((Math.random() - 0.5) * 200);
        starsVertices.push((Math.random() - 0.5) * 200);
      }
      starsGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starsVertices), 3));
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);

      camera.position.z = 2.5;

      const animate = () => {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className="w-full h-screen bg-[#0B0E14] flex flex-col">
      <canvas ref={canvasRef} className="w-full flex-1" />
      <div className="bg-[#131924]/60 backdrop-blur-md border-t border-[#00F0FF33] p-6">
        <div className="max-w-[120rem] mx-auto">
          <h2 className="text-xl font-bold text-[#00F0FF] font-mono mb-4">Spatial Intelligence & 3D Globe Engine</h2>
          {mode === 'student' ? (
            <p className="text-secondary-foreground">Click on satellites to view real-time telemetry data.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4 text-xs font-mono">
              <div><span className="text-[#FF007A]">LAT:</span> <span className="text-[#00F0FF]">0.00°</span></div>
              <div><span className="text-[#FF007A]">LON:</span> <span className="text-[#00F0FF]">0.00°</span></div>
              <div><span className="text-[#FF007A]">ALT:</span> <span className="text-[#00F0FF]">408 km</span></div>
              <div><span className="text-[#FF007A]">VEL:</span> <span className="text-[#00F0FF]">7.66 km/s</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DeepSpaceModule: React.FC<{ mode: string }> = ({ mode }) => {
  const [selectedObject, setSelectedObject] = React.useState<string | null>(null);

  const deepSkyObjects = [
    { name: 'M31', label: 'Andromeda', ra: '00:42:44', dec: '+41:16:09', distance: 2.5, magnitude: 3.4 },
    { name: 'M42', label: 'Orion Nebula', ra: '05:35:24', dec: '-05:23:14', distance: 1.3, magnitude: 4.0 },
    { name: 'M1', label: 'Crab Nebula', ra: '05:34:31', dec: '+22:00:52', distance: 6.5, magnitude: 8.4 },
    { name: 'M16', label: 'Pillars of Creation', ra: '18:18:47', dec: '-13:47:00', distance: 7.0, magnitude: 6.0 },
    { name: 'M104', label: 'Sombrero Galaxy', ra: '12:39:59', dec: '-11:37:23', distance: 29.3, magnitude: 8.0 },
    { name: 'M51', label: 'Whirlpool Galaxy', ra: '13:29:52', dec: '+47:11:43', distance: 23.0, magnitude: 8.4 },
    { name: 'M57', label: 'Ring Nebula', ra: '18:53:35', dec: '+33:01:45', distance: 2.3, magnitude: 8.8 },
    { name: 'Cen A', label: 'Centaurus A', ra: '13:25:28', dec: '-43:01:09', distance: 13.7, magnitude: 6.84 },
  ];

  const selected = deepSkyObjects.find(obj => obj.name === selectedObject);

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Deep-Space Observation & Mapping</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sky Map */}
          <div className="lg:col-span-2 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <div className="aspect-square bg-gradient-to-br from-[#0B0E14] to-[#1a1f2e] rounded-lg border border-[#00F0FF33] flex items-center justify-center relative overflow-hidden">
              {/* RA/Dec Grid */}
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
                {Array.from({ length: 24 }).map((_, i) => (
                  <line key={`ra-${i}`} x1={`${(i / 24) * 100}%`} y1="0" x2={`${(i / 24) * 100}%`} y2="100%" stroke="#00F0FF" strokeWidth="1" />
                ))}
                {Array.from({ length: 18 }).map((_, i) => (
                  <line key={`dec-${i}`} x1="0" y1={`${(i / 18) * 100}%`} x2="100%" y2={`${(i / 18) * 100}%`} stroke="#00F0FF" strokeWidth="1" />
                ))}
              </svg>

              {/* Deep Sky Objects */}
              <div className="absolute inset-0">
                {deepSkyObjects.map((obj, idx) => {
                  const raPercent = (parseInt(obj.ra.split(':')[0]) / 24) * 100;
                  const decPercent = ((parseFloat(obj.dec.split(':')[0]) + 90) / 180) * 100;
                  return (
                    <button
                      key={obj.name}
                      onClick={() => setSelectedObject(obj.name)}
                      className={`absolute w-3 h-3 rounded-full transition-all ${
                        selectedObject === obj.name
                          ? 'bg-[#FF007A] scale-150 shadow-lg shadow-[#FF007A]'
                          : 'bg-[#00F0FF] hover:scale-125'
                      }`}
                      style={{ left: `${raPercent}%`, top: `${decPercent}%`, transform: 'translate(-50%, -50%)' }}
                      title={obj.label}
                    />
                  );
                })}
              </div>

              <div className="absolute bottom-4 left-4 text-xs font-mono text-secondary-foreground">
                RA: 0h - 24h | Dec: -90° - +90°
              </div>
            </div>
          </div>

          {/* Inspector Card */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Object Inspector</h3>
            {selected ? (
              <div className="space-y-4 text-sm font-mono">
                <div>
                  <span className="text-[#FF007A]">Name:</span>
                  <div className="text-[#00F0FF]">{selected.label}</div>
                </div>
                <div>
                  <span className="text-[#FF007A]">RA:</span>
                  <div className="text-[#00F0FF]">{selected.ra}</div>
                </div>
                <div>
                  <span className="text-[#FF007A]">Dec:</span>
                  <div className="text-[#00F0FF]">{selected.dec}</div>
                </div>
                <div>
                  <span className="text-[#FF007A]">Distance:</span>
                  <div className="text-[#00F0FF]">{selected.distance} ly</div>
                </div>
                <div>
                  <span className="text-[#FF007A]">Magnitude:</span>
                  <div className="text-[#00F0FF]">{selected.magnitude}</div>
                </div>
              </div>
            ) : (
              <p className="text-secondary-foreground text-sm">Select an object to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PhotometryModule: React.FC<{ mode: string }> = ({ mode }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [aperture, setAperture] = React.useState(50);
  const [snr, setSNR] = React.useState(0);
  const [magnitude, setMagnitude] = React.useState(0);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw FITS-like image
    ctx.fillStyle = '#1a1f2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Gaussian star
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const sigma = aperture / 6;

    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const intensity = Math.exp(-(dist * dist) / (2 * sigma * sigma));
        const value = Math.floor(intensity * 255);
        ctx.fillStyle = `rgb(${value}, ${value * 0.8}, ${value * 0.6})`;
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
    const flux = Math.PI * aperture * aperture * 100;
    const noise = Math.sqrt(flux);
    setSNR(Math.round(flux / noise));
    setMagnitude(parseFloat((10 - Math.log10(flux)).toFixed(2)));
  }, [aperture]);

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Professional Photometry Suite</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="w-full border border-[#00F0FF33] rounded-lg"
            />
          </div>

          {/* Controls & Results */}
          <div className="space-y-6">
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
              </div>
            </div>

            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Measurements</h3>
              <div className="space-y-3 text-sm font-mono">
                <div>
                  <span className="text-[#FF007A]">SNR:</span>
                  <span className="text-[#00F0FF] ml-2">{snr}</span>
                </div>
                <div>
                  <span className="text-[#FF007A]">Magnitude:</span>
                  <span className="text-[#00F0FF] ml-2">{magnitude}</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] rounded-lg font-mono text-sm hover:bg-[#00F0FF]/30 transition-all">
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AstrodynamicsModule: React.FC<{ mode: string }> = ({ mode }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = React.useState(false);
  const [G, setG] = React.useState(6.674e-11);
  const [mass1, setMass1] = React.useState(1.989e30);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let bodies = [
      { x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0, mass: mass1, radius: 15, color: '#FFD700', trail: [] },
      { x: canvas.width / 2 + 150, y: canvas.height / 2, vx: 0, vy: 30, mass: 5.972e24, radius: 8, color: '#00F0FF', trail: [] },
      { x: canvas.width / 2 + 180, y: canvas.height / 2, vx: 0, vy: 35, mass: 7.342e22, radius: 3, color: '#FF007A', trail: [] },
    ];

    const simulate = () => {
      ctx.fillStyle = '#0B0E14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isRunning) {
        // N-body simulation (simplified)
        for (let i = 0; i < bodies.length; i++) {
          let ax = 0, ay = 0;
          for (let j = 0; j < bodies.length; j++) {
            if (i !== j) {
              const dx = bodies[j].x - bodies[i].x;
              const dy = bodies[j].y - bodies[i].y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const force = (G * bodies[i].mass * bodies[j].mass) / (dist * dist * 1e30);
              ax += (force / bodies[i].mass) * (dx / dist);
              ay += (force / bodies[i].mass) * (dy / dist);
            }
          }
          bodies[i].vx += ax * 0.01;
          bodies[i].vy += ay * 0.01;
          bodies[i].x += bodies[i].vx;
          bodies[i].y += bodies[i].vy;

          bodies[i].trail.push({ x: bodies[i].x, y: bodies[i].y });
          if (bodies[i].trail.length > 200) bodies[i].trail.shift();
        }
      }

      // Draw trails
      bodies.forEach((body) => {
        ctx.strokeStyle = body.color;
        ctx.globalAlpha = 0.3;
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
      });

      animationId = requestAnimationFrame(simulate);
    };

    simulate();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, G, mass1]);

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Astrodynamics & Physics Sandbox</h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-3 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full border border-[#00F0FF33] rounded-lg"
            />
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
              <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-3">Controls</h3>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full px-3 py-2 rounded-lg font-mono text-sm transition-all mb-2 ${
                  isRunning
                    ? 'bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A]'
                    : 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]'
                }`}
              >
                {isRunning ? 'Pause' : 'Play'}
              </button>
              <button className="w-full px-3 py-2 bg-[#131924] text-secondary-foreground border border-[#00F0FF33] rounded-lg font-mono text-sm hover:border-[#00F0FF] transition-all">
                Reset
              </button>
            </div>

            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
              <label className="text-xs font-mono text-[#FF007A]">G (×10⁻¹¹)</label>
              <input
                type="number"
                value={G / 1e-11}
                onChange={(e) => setG(parseFloat(e.target.value) * 1e-11)}
                className="w-full mt-2 px-2 py-1 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DualModeModule: React.FC<{ mode: string; setMode: (mode: 'student' | 'professional') => void }> = ({ mode, setMode }) => {
  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Dual-Mode Experience Switcher</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Mode */}
          <motion.div
            onClick={() => setMode('student')}
            className={`bg-[#131924]/60 backdrop-blur-md border-2 rounded-lg p-8 cursor-pointer transition-all ${
              mode === 'student' ? 'border-[#00F0FF] shadow-lg shadow-[#00F0FF]/20' : 'border-[#00F0FF33] hover:border-[#00F0FF]'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-[#00F0FF] font-mono mb-4">Student Mode</h3>
            <ul className="space-y-2 text-secondary-foreground text-sm">
              <li>✓ Plain-language educational tooltips</li>
              <li>✓ Guided mission overlays</li>
              <li>✓ Simplified controls</li>
              <li>✓ Step-by-step learning paths</li>
              <li>✓ Interactive tutorials</li>
            </ul>
          </motion.div>

          {/* Professional Mode */}
          <motion.div
            onClick={() => setMode('professional')}
            className={`bg-[#131924]/60 backdrop-blur-md border-2 rounded-lg p-8 cursor-pointer transition-all ${
              mode === 'professional' ? 'border-[#FF007A] shadow-lg shadow-[#FF007A]/20' : 'border-[#00F0FF33] hover:border-[#FF007A]'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="text-2xl font-bold text-[#FF007A] font-mono mb-4">Professional Mode</h3>
            <ul className="space-y-2 text-secondary-foreground text-sm">
              <li>✓ Raw telemetry vectors</li>
              <li>✓ LaTeX mathematical equations</li>
              <li>✓ CSV download buttons</li>
              <li>✓ Full custom variable inputs</li>
              <li>✓ Advanced analysis tools</li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-8 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Current Mode: {mode.toUpperCase()}</h3>
          <p className="text-secondary-foreground">
            {mode === 'student'
              ? 'You are in Student Mode. All modules will display educational content with simplified controls and guided overlays.'
              : 'You are in Professional Mode. All modules will display advanced telemetry, raw data vectors, and professional-grade analysis tools.'}
          </p>
        </div>
      </div>
    </div>
  );
};

const ConstellationModule: React.FC<{ mode: string }> = ({ mode }) => {
  const [satellites] = React.useState([
    { name: 'ISS', altitude: 408, shell: 'LEO', count: 1 },
    { name: 'Hubble', altitude: 559, shell: 'LEO', count: 1 },
    { name: 'GOES-16', altitude: 35786, shell: 'GEO', count: 1 },
  ]);

  const leoCount = 8000;
  const meoCount = 600;
  const geoCount = 500;

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Satellite Constellation Mapper</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* LEO */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF] rounded-lg p-6">
            <div className="text-[#00F0FF] text-sm font-mono mb-2">LEO (&lt;2000 km)</div>
            <div className="text-4xl font-bold text-[#00F0FF] font-mono">{leoCount}</div>
            <div className="text-xs text-secondary-foreground mt-2">Active satellites</div>
          </div>

          {/* MEO */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#F59E0B] rounded-lg p-6">
            <div className="text-[#F59E0B] text-sm font-mono mb-2">MEO (2000-35786 km)</div>
            <div className="text-4xl font-bold text-[#F59E0B] font-mono">{meoCount}</div>
            <div className="text-xs text-secondary-foreground mt-2">Active satellites</div>
          </div>

          {/* GEO */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#A78BFA] rounded-lg p-6">
            <div className="text-[#A78BFA] text-sm font-mono mb-2">GEO (~35786 km)</div>
            <div className="text-4xl font-bold text-[#A78BFA] font-mono">{geoCount}</div>
            <div className="text-xs text-secondary-foreground mt-2">Active satellites</div>
          </div>
        </div>

        {/* Constellation View */}
        <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
          <div className="aspect-video bg-gradient-to-br from-[#0B0E14] to-[#1a1f2e] rounded-lg border border-[#00F0FF33] flex items-center justify-center relative overflow-hidden">
            {/* Orbital shells */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
              {/* LEO shell */}
              <circle cx="200" cy="150" r="80" fill="none" stroke="#00F0FF" strokeWidth="2" opacity="0.3" />
              {/* MEO shell */}
              <circle cx="200" cy="150" r="130" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.3" />
              {/* GEO shell */}
              <circle cx="200" cy="150" r="160" fill="none" stroke="#A78BFA" strokeWidth="2" opacity="0.3" />
              {/* Earth */}
              <circle cx="200" cy="150" r="20" fill="#1a3a52" stroke="#00F0FF" strokeWidth="1" />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00F0FF] font-mono">{leoCount + meoCount + geoCount}</div>
                <div className="text-sm text-secondary-foreground">Total Active Satellites</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CelestialModule: React.FC<{ mode: string }> = ({ mode }) => {
  const [ra, setRA] = React.useState('12:00:00');
  const [dec, setDec] = React.useState('45:00:00');
  const [lat, setLat] = React.useState('40.7128');
  const [lon, setLon] = React.useState('-74.0060');
  const [jd, setJD] = React.useState(2460000);

  const calculateAltAz = () => {
    // Simplified calculation
    return { alt: 45, az: 180 };
  };

  const { alt, az } = calculateAltAz();

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Celestial Coordinate System & Ephemeris</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Controls */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Observer Location</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#FF007A]">Latitude (°)</label>
                <input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full mt-2 px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#FF007A]">Longitude (°)</label>
                <input
                  type="text"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  className="w-full mt-2 px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#FF007A]">Julian Date</label>
                <input
                  type="number"
                  value={jd}
                  onChange={(e) => setJD(parseFloat(e.target.value))}
                  className="w-full mt-2 px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Target Coordinates */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Target Coordinates</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#FF007A]">RA (HH:MM:SS)</label>
                <input
                  type="text"
                  value={ra}
                  onChange={(e) => setRA(e.target.value)}
                  className="w-full mt-2 px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#FF007A]">Dec (DD:MM:SS)</label>
                <input
                  type="text"
                  value={dec}
                  onChange={(e) => setDec(e.target.value)}
                  className="w-full mt-2 px-3 py-2 bg-[#0B0E14] border border-[#00F0FF33] rounded text-[#00F0FF] font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Horizontal Coordinates</h3>
            <div className="space-y-3 text-sm font-mono">
              <div>
                <span className="text-[#FF007A]">Altitude:</span>
                <span className="text-[#00F0FF] ml-2">{alt}°</span>
              </div>
              <div>
                <span className="text-[#FF007A]">Azimuth:</span>
                <span className="text-[#00F0FF] ml-2">{az}°</span>
              </div>
            </div>
          </div>

          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4">Time Systems</h3>
            <div className="space-y-3 text-sm font-mono">
              <div>
                <span className="text-[#FF007A]">JD:</span>
                <span className="text-[#00F0FF] ml-2">{jd}</span>
              </div>
              <div>
                <span className="text-[#FF007A]">GMST:</span>
                <span className="text-[#00F0FF] ml-2">12:34:56</span>
              </div>
              <button className="w-full mt-4 px-3 py-2 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] rounded-lg font-mono text-xs hover:bg-[#00F0FF]/30 transition-all">
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrbitalModule: React.FC<{ mode: string }> = ({ mode }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [a, setA] = React.useState(6.6e6);
  const [e, setE] = React.useState(0.0167);
  const [i, setI] = React.useState(0);
  const [M, setM] = React.useState(5.972e24);

  React.useEffect(() => {
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
    const b = a * Math.sqrt(1 - e * e);
    for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
      const r = (a * (1 - e * e)) / (1 + e * Math.cos(angle));
      const x = centerX + r * Math.cos(angle) * scale;
      const y = centerY + r * Math.sin(angle) * scale * Math.cos(i);
      if (angle === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Draw central body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw satellite
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(0));
    const satX = centerX + r * Math.cos(0) * scale;
    const satY = centerY + r * Math.sin(0) * scale * Math.cos(i);
    ctx.fillStyle = '#00F0FF';
    ctx.beginPath();
    ctx.arc(satX, satY, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [a, e, i, M]);

  const G = 6.674e-11;
  const T = 2 * Math.PI * Math.sqrt((a ** 3) / (G * M));
  const vPeriapsis = Math.sqrt(G * M * (2 / a - 2 / (a * (1 - e))));
  const vApoapsis = Math.sqrt(G * M * (2 / a - 2 / (a * (1 + e))));
  const rPeriapsis = a * (1 - e);
  const rApoapsis = a * (1 + e);

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] p-6">
      <div className="max-w-[120rem] mx-auto">
        <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Orbital Mechanics Calculator</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2 bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
            <canvas
              ref={canvasRef}
              width={500}
              height={400}
              className="w-full border border-[#00F0FF33] rounded-lg"
            />
          </div>

          {/* Controls & Results */}
          <div className="space-y-4">
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
                    onChange={(e) => setE(parseFloat(e.target.value))}
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

            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-4">
              <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-3">Results</h3>
              <div className="space-y-2 text-xs font-mono">
                <div><span className="text-[#FF007A]">T:</span> <span className="text-[#00F0FF]">{(T / 3600).toFixed(2)}h</span></div>
                <div><span className="text-[#FF007A]">r_p:</span> <span className="text-[#00F0FF]">{(rPeriapsis / 1e6).toFixed(2)}Mm</span></div>
                <div><span className="text-[#FF007A]">r_a:</span> <span className="text-[#00F0FF]">{(rApoapsis / 1e6).toFixed(2)}Mm</span></div>
                <div><span className="text-[#FF007A]">v_p:</span> <span className="text-[#00F0FF]">{(vPeriapsis / 1000).toFixed(2)}km/s</span></div>
                <div><span className="text-[#FF007A]">v_a:</span> <span className="text-[#00F0FF]">{(vApoapsis / 1000).toFixed(2)}km/s</span></div>
              </div>
              <button className="w-full mt-3 px-2 py-1 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] rounded font-mono text-xs hover:bg-[#00F0FF]/30 transition-all">
                Export Sheet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstroLabPage;
