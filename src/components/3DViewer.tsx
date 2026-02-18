import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AeroForgeDSL } from '@/services/dslSchema';
import { Maximize2, RotateCcw, Download, Minimize2 } from 'lucide-react';

interface Viewer3DProps {
  dsl: AeroForgeDSL | null;
  isLoading?: boolean;
}

export default function Viewer3D({ dsl, isLoading = false }: Viewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stats, setStats] = useState({ vertices: 0, faces: 0 });

  // Initialize Three.js scene
  useEffect(() => {
    const targetContainer = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
    if (!targetContainer) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera setup
    const width = targetContainer.clientWidth;
    const height = targetContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(150, 150, 150);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    targetContainer.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(150, 150, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -300;
    directionalLight.shadow.camera.right = 300;
    directionalLight.shadow.camera.top = 300;
    directionalLight.shadow.camera.bottom = -300;
    scene.add(directionalLight);

    // Point light for better depth
    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.position.set(-100, 100, 100);
    scene.add(pointLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(400, 40, 0xcccccc, 0xeeeeee);
    scene.add(gridHelper);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(120);
    scene.add(axesHelper);

    // Simple orbit controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (isDragging && cameraRef.current) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        const radius = cameraRef.current.position.length();
        const theta = Math.atan2(cameraRef.current.position.x, cameraRef.current.position.z);
        const phi = Math.acos(cameraRef.current.position.y / radius);

        const newTheta = theta - deltaX * 0.01;
        const newPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + deltaY * 0.01));

        cameraRef.current.position.x = radius * Math.sin(newPhi) * Math.sin(newTheta);
        cameraRef.current.position.y = radius * Math.cos(newPhi);
        cameraRef.current.position.z = radius * Math.sin(newPhi) * Math.cos(newTheta);
        cameraRef.current.lookAt(0, 0, 0);

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false;
    });

    renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (cameraRef.current) {
        const direction = cameraRef.current.position.clone().normalize();
        const distance = cameraRef.current.position.length();
        const newDistance = Math.max(50, Math.min(500, distance + e.deltaY * 0.5));
        cameraRef.current.position.copy(direction.multiplyScalar(newDistance));
        cameraRef.current.lookAt(0, 0, 0);
      }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const resizeContainer = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
      if (!resizeContainer) return;
      const newWidth = resizeContainer.clientWidth;
      const newHeight = resizeContainer.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', () => {});
      renderer.domElement.removeEventListener('mousemove', () => {});
      renderer.domElement.removeEventListener('mouseup', () => {});
      renderer.domElement.removeEventListener('wheel', () => {});
      targetContainer?.removeChild(renderer.domElement);
    };
  }, [isFullscreen]);

  // Update 3D model based on DSL
  useEffect(() => {
    if (!sceneRef.current || !dsl) return;

    // Clear previous meshes
    meshesRef.current.forEach((mesh) => {
      sceneRef.current!.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    meshesRef.current = [];

    let totalVertices = 0;
    let totalFaces = 0;

    // Create geometries from DSL features
    dsl.features?.forEach((feature, index) => {
      let geometry: THREE.BufferGeometry | null = null;
      let position = { x: 0, y: 0, z: 0 };
      const colors = [
        0x3498db, // blue
        0xe74c3c, // red
        0x2ecc71, // green
        0xf39c12, // orange
        0x9b59b6, // purple
        0x1abc9c, // turquoise
      ];
      const color = colors[index % colors.length];

      if (feature.type === 'PAD') {
        if (feature.padProfile === 'RECTANGULAR') {
          const width = (feature.padWidth?.value || 100) * 0.5;
          const length = (feature.padLength?.value || 100) * 0.5;
          const height = (feature.padHeight?.value || 10) * 0.5;
          geometry = new THREE.BoxGeometry(width * 2, height * 2, length * 2);
          position.y = height;
        } else if (feature.padProfile === 'CIRCULAR') {
          const radius = (feature.padWidth?.value || 50) * 0.5;
          const height = (feature.padHeight?.value || 50) * 0.5;
          geometry = new THREE.CylinderGeometry(radius, radius, height * 2, 32);
          position.y = height;
        }
      } else if (feature.type === 'HOLE') {
        const diameter = (feature.holeDiameter?.value || 6) * 0.5;
        geometry = new THREE.CylinderGeometry(diameter, diameter, 100, 32);
        if (feature.coordinate) {
          position.x = feature.coordinate.x?.value || 0;
          position.z = feature.coordinate.z?.value || 0;
        }
      } else if (feature.type === 'FILLET') {
        const radius = (feature.radius?.value || 2) * 0.5;
        geometry = new THREE.SphereGeometry(radius, 16, 16);
      } else if (feature.type === 'POCKET') {
        const width = (feature.padWidth?.value || 50) * 0.5;
        const length = (feature.padLength?.value || 50) * 0.5;
        const height = (feature.padHeight?.value || 5) * 0.5;
        geometry = new THREE.BoxGeometry(width * 2, height * 2, length * 2);
      }

      if (geometry) {
        // Count vertices and faces
        if (geometry.attributes.position) {
          totalVertices += geometry.attributes.position.count;
        }
        if (geometry.index) {
          totalFaces += geometry.index.count / 3;
        }

        const material = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.7,
          roughness: 0.3,
          emissive: 0x000000,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        sceneRef.current!.add(mesh);
        meshesRef.current.push(mesh);
      }
    });

    setStats({ vertices: totalVertices, faces: totalFaces });

    // Auto-fit camera to view all objects
    if (meshesRef.current.length > 0) {
      const box = new THREE.Box3();
      meshesRef.current.forEach((mesh) => box.expandByObject(mesh));
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = cameraRef.current!.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.5;

      const center = box.getCenter(new THREE.Vector3());
      cameraRef.current!.position.set(center.x + cameraZ, center.y + cameraZ, center.z + cameraZ);
      cameraRef.current!.lookAt(center);
    }
  }, [dsl]);

  const handleResetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(150, 150, 150);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const handleDownloadScreenshot = () => {
    if (rendererRef.current) {
      const link = document.createElement('a');
      link.href = rendererRef.current.domElement.toDataURL('image/png');
      link.download = `aeroforge-3d-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <>
      {/* Normal View */}
      <div
        ref={containerRef}
        className={`relative bg-gray-100 overflow-hidden ${
          isFullscreen ? 'hidden' : 'w-full h-full rounded-lg border border-secondary/20'
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="font-paragraph text-sm text-foreground">Generating 3D model...</p>
            </div>
          </div>
        )}

        {!dsl && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <p className="font-paragraph text-base text-foreground/60">
                Write a prompt to see your 3D model here
              </p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button
            onClick={handleResetView}
            className="p-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            title="Reset view"
          >
            <RotateCcw className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={handleDownloadScreenshot}
            className="p-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            title="Download screenshot"
          >
            <Download className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            title="Toggle fullscreen"
          >
            <Maximize2 className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-3 rounded-lg shadow text-xs font-paragraph text-foreground/70 z-20">
          <div>🖱 Drag to rotate • Scroll to zoom</div>
          {dsl && (
            <div className="mt-2 text-foreground/60">
              {dsl.features?.length || 0} features • {stats.vertices} vertices • {stats.faces} faces
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen View */}
      {isFullscreen && (
        <div
          ref={fullscreenContainerRef}
          className="fixed inset-0 z-50 bg-gray-100 flex flex-col"
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="font-paragraph text-sm text-foreground">Generating 3D model...</p>
              </div>
            </div>
          )}

          {/* Fullscreen Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <button
              onClick={handleResetView}
              className="p-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              title="Reset view"
            >
              <RotateCcw className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={handleDownloadScreenshot}
              className="p-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              title="Download screenshot"
            >
              <Download className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              title="Exit fullscreen"
            >
              <Minimize2 className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Fullscreen Info */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-3 rounded-lg shadow text-xs font-paragraph text-foreground/70 z-20">
            <div>🖱 Drag to rotate • Scroll to zoom</div>
            {dsl && (
              <div className="mt-2 text-foreground/60">
                {dsl.features?.length || 0} features • {stats.vertices} vertices • {stats.faces} faces
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
