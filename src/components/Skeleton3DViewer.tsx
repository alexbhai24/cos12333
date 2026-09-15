import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// Global singleton cache for preloading 3D skeleton model
let cachedSkeletonGroup: THREE.Group | null = null;
let loadPromise: Promise<THREE.Group> | null = null;

export const preloadSkeletonModel = (): Promise<THREE.Group> => {
  if (cachedSkeletonGroup) {
    return Promise.resolve(cachedSkeletonGroup.clone());
  }
  if (loadPromise) {
    return loadPromise.then((obj) => obj.clone());
  }

  loadPromise = new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    loader.load(
      '/skeleton/SubTool-0-3517926.OBJ',
      (obj) => {
        // Realistic Warm Natural Bone Shader
        const material = new THREE.MeshStandardMaterial({
          color: 0xf3e6d3, // Warm natural bone tone
          metalness: 0.04,
          roughness: 0.36,
          wireframe: false,
          emissive: 0x2b2218,
          emissiveIntensity: 0.12
        });

        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = material;
          }
        });

        // Center and scale model
        const box = new THREE.Box3().setFromObject(obj);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.3 / maxDim;
        obj.scale.set(scale, scale, scale);
        obj.position.sub(center.multiplyScalar(scale));

        cachedSkeletonGroup = obj;
        resolve(obj.clone());
      },
      undefined,
      (err) => {
        console.error('Error loading 3D skeleton model:', err);
        loadPromise = null;
        reject(err);
      }
    );
  });

  return loadPromise;
};

// Immediately start preloading in background on app startup!
if (typeof window !== 'undefined') {
  preloadSkeletonModel().catch(() => {});
}

export const Skeleton3DViewer: React.FC<{ className?: string }> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Realistic Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffae6, 3.2);
    keyLight.position.set(6, 12, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.8);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const backRimLight = new THREE.DirectionalLight(0xbae6fd, 2.2);
    backRimLight.position.set(0, -8, -8);
    scene.add(backRimLight);

    let skeletonMesh: THREE.Group | null = null;
    let animId: number;
    let mounted = true;

    // Use preloaded cached model for INSTANT rendering on tab switch
    preloadSkeletonModel()
      .then((obj) => {
        if (!mounted) return;
        scene.add(obj);
        skeletonMesh = obj;
      })
      .catch((err) => {
        console.error('Failed to attach preloaded skeleton:', err);
      });

    // Mouse drag rotation controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !skeletonMesh) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      skeletonMesh.rotation.y += deltaX * 0.01;
      skeletonMesh.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Animation Loop
    const animateLoop = () => {
      animId = requestAnimationFrame(animateLoop);
      if (skeletonMesh && !isDragging) {
        skeletonMesh.rotation.y += 0.008; // Continuous smooth rotation
      }
      renderer.render(scene, camera);
    };
    animateLoop();

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 300;
      const newH = container.clientHeight || 300;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      mounted = false;
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className || 'w-full h-72'}`}>
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
