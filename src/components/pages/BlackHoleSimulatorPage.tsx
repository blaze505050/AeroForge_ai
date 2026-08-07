import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Info, Zap, Gauge } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

interface BlackHoleParams {
  mass: number; // Solar masses
  spin: number; // 0 to 1 (Kerr parameter)
  accretionRate: number; // 0 to 1
  temperature: number; // Kelvin
}

export default function BlackHoleSimulatorPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<BlackHoleParams>({
    mass: 10,
    spin: 0.5,
    accretionRate: 0.7,
    temperature: 1000000,
  });
  const [selectedMetric, setSelectedMetric] = useState<'schwarzschild' | 'ergosphere' | 'accretion'>('schwarzschild');

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create black hole visualization
    const schwarzschildRadius = params.mass * 3; // Simplified calculation

    // Event horizon (black hole)
    const horizonGeometry = new THREE.SphereGeometry(schwarzschildRadius, 64, 64);
    const horizonMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      emissive: 0x1a1a2e,
    });
    const eventHorizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
    scene.add(eventHorizon);

    // Accretion disk
    const diskGeometry = new THREE.TorusGeometry(schwarzschildRadius * 2.5, schwarzschildRadius * 1.5, 32, 128);
    const diskMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.05, 1, 0.5),
      emissive: new THREE.Color().setHSL(0.05, 1, 0.3),
      emissiveIntensity: params.accretionRate,
      metalness: 0.3,
      roughness: 0.7,
    });
    const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
    accretionDisk.rotation.x = Math.PI / 4;
    scene.add(accretionDisk);

    // Ergosphere (for Kerr black holes)
    if (params.spin > 0) {
      const ergoGeometry = new THREE.SphereGeometry(schwarzschildRadius * 1.5, 32, 32);
      const ergoMaterial = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      });
      const ergosphere = new THREE.Mesh(ergoGeometry, ergoMaterial);
      scene.add(ergosphere);
    }

    // Particle system for accretion
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = schwarzschildRadius * 2 + Math.random() * schwarzschildRadius * 2;
      const height = (Math.random() - 0.5) * schwarzschildRadius;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      velocities[i * 3] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff6347,
      size: 0.3,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(100, 100, 100);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (isPlaying) {
        eventHorizon.rotation.y += 0.001;
        accretionDisk.rotation.z += 0.005 * params.spin;

        // Update particles
        const positionAttribute = particleGeometry.getAttribute('position') as THREE.BufferAttribute;
        const positions = positionAttribute.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += velocities[i * 3] * params.accretionRate;
          positions[i * 3 + 1] += velocities[i * 3 + 1] * params.accretionRate;
          positions[i * 3 + 2] += velocities[i * 3 + 2] * params.accretionRate;

          // Pull towards center
          const dx = -positions[i * 3];
          const dy = -positions[i * 3 + 1];
          const dz = -positions[i * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist > schwarzschildRadius) {
            velocities[i * 3] += (dx / dist) * 0.01 * params.accretionRate;
            velocities[i * 3 + 1] += (dy / dist) * 0.01 * params.accretionRate;
            velocities[i * 3 + 2] += (dz / dist) * 0.01 * params.accretionRate;
          } else {
            // Reset particle
            const angle = Math.random() * Math.PI * 2;
            const radius = schwarzschildRadius * 3 + Math.random() * schwarzschildRadius * 2;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = (Math.random() - 0.5) * schwarzschildRadius;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
          }
        }
        positionAttribute.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isPlaying, params]);

  const schwarzschildRadius = params.mass * 3;
  const ergosphereRadius = params.spin > 0 ? schwarzschildRadius * 1.5 : 0;
  const photonSphere = schwarzschildRadius * 1.5;

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 md:p-12 max-w-[120rem] mx-auto w-full">
          {/* 3D Visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-3 rounded-lg overflow-hidden border border-aerospace-blue/20 bg-aerospace-dark/50"
          >
            <div ref={containerRef} className="w-full h-[600px] md:h-[700px]" />
          </motion.div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            <Card className="bg-primary/40 border-aerospace-blue/20 p-6">
              <h2 className="font-heading text-2xl font-bold mb-6">
                <span className="text-aerospace-blue">Black Hole</span> Simulator
              </h2>

              {/* Playback Controls */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1 p-3 bg-aerospace-blue/20 border border-aerospace-blue/50 rounded-lg hover:bg-aerospace-blue/30 transition-colors flex items-center justify-center gap-2"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="text-sm font-mono">{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 p-3 bg-primary/40 border border-aerospace-blue/20 rounded-lg hover:border-aerospace-blue/50 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm font-mono">Reset</span>
                </button>
              </div>

              {/* Parameters */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-2">
                    Mass ({params.mass} M☉)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={params.mass}
                    onChange={(e) => setParams({ ...params, mass: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-2">
                    Spin Parameter ({params.spin.toFixed(2)})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={params.spin}
                    onChange={(e) => setParams({ ...params, spin: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-2">
                    Accretion Rate ({params.accretionRate.toFixed(2)})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={params.accretionRate}
                    onChange={(e) => setParams({ ...params, accretionRate: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                  <p className="text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-1">
                    Schwarzschild Radius
                  </p>
                  <p className="text-lg font-bold">{schwarzschildRadius.toFixed(1)} km</p>
                </div>

                <div className="p-3 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                  <p className="text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-1">
                    Photon Sphere
                  </p>
                  <p className="text-lg font-bold">{photonSphere.toFixed(1)} km</p>
                </div>

                {params.spin > 0 && (
                  <div className="p-3 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                    <p className="text-xs font-mono text-aerospace-blue uppercase tracking-wider mb-1">
                      Ergosphere
                    </p>
                    <p className="text-lg font-bold">{ergosphereRadius.toFixed(1)} km</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 bg-aerospace-dark/50 rounded-lg border border-aerospace-blue/20">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-aerospace-blue shrink-0 mt-1" />
                  <p className="text-xs text-foreground/70">
                    Adjust parameters to explore different black hole configurations and their effects on spacetime.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
