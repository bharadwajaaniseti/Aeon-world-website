import React, { useRef, useEffect, useState } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color3, FreeCamera } from '@babylonjs/core';
import { useUIStore } from '../../state/useUIStore';
import { useSimStore } from '../../state/useSimStore';
import { createTerrain } from './instancing';
import { setupCameraControls } from './cameraControls';
import { throttle } from '../../utils/guards';

interface BabylonCanvasProps {
  className?: string;
}

export const BabylonCanvas: React.FC<BabylonCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const animationFrameRef = useRef<number>();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isPaused, worldSeed, selectedEntityId, biomesOverlay } = useUIStore();
  const { entities, updateFPS, updateRenderTime, setError: setSimError } = useSimStore();

  // Performance monitoring
  const lastTimeRef = useRef(Date.now());
  const fpsCounterRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const initializeBabylon = async () => {
      try {
        // Create engine with WebGPU fallback to WebGL2
        const engine = new Engine(canvasRef.current, true, {
          powerPreference: "high-performance",
          antialias: true,
          stencil: true,
          adaptToDeviceRatio: true,
        });

        // Enable WebGPU if available
        if (engine.getCaps().supportComputeShaders && navigator.gpu) {
          console.log('🚀 WebGPU support detected');
        } else {
          console.log('📱 Using WebGL2 fallback');
        }

        const scene = new Scene(engine);
        scene.actionManager = null; // Disable action manager for performance

        // Set up camera
        const camera = new ArcRotateCamera(
          'camera',
          -Math.PI / 2,
          Math.PI / 2.5,
          300,
          Vector3.Zero(),
          scene
        );

        // Set up lighting
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        light.diffuse = new Color3(1, 0.9, 0.8);
        light.specular = new Color3(0.2, 0.2, 0.3);

        // Create terrain
        await createTerrain(scene, worldSeed);

        // Set up camera controls
        setupCameraControls(camera, canvasRef.current);

        // Store references
        engineRef.current = engine;
        sceneRef.current = scene;

        // Start render loop
        startRenderLoop();
        
        setIsInitialized(true);
        console.log('✅ Babylon.js scene initialized');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize 3D scene';
        console.error('❌ Babylon.js initialization error:', err);
        setError(errorMessage);
        setSimError(errorMessage);
      }
    };

    initializeBabylon();

    return () => {
      cleanup();
    };
  }, [worldSeed]);

  // Throttled render function
  const throttledRender = throttle(() => {
    if (!sceneRef.current || !engineRef.current || isPaused) return;

    const startTime = performance.now();
    
    try {
      sceneRef.current.render();
      
      // Update performance metrics
      const renderTime = performance.now() - startTime;
      updateRenderTime(renderTime);
      
      // FPS calculation
      fpsCounterRef.current++;
      const now = Date.now();
      if (now - lastTimeRef.current >= 1000) {
        updateFPS(fpsCounterRef.current);
        fpsCounterRef.current = 0;
        lastTimeRef.current = now;
      }
    } catch (err) {
      console.error('Render error:', err);
    }
  }, 16); // ~60 FPS

  const startRenderLoop = () => {
    const renderLoop = () => {
      throttledRender();
      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = throttle(() => {
      if (engineRef.current) {
        engineRef.current.resize();
      }
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update scene based on store changes
  useEffect(() => {
    if (!sceneRef.current || !isInitialized) return;

    // Update entity positions and selections
    // This would typically update instanced meshes
    // For now, we'll just log the entity count
    console.log(`Entities in scene: ${entities.size}`);
  }, [entities, selectedEntityId, biomesOverlay, isInitialized]);

  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (sceneRef.current) {
      sceneRef.current.dispose();
      sceneRef.current = null;
    }
    
    if (engineRef.current) {
      engineRef.current.dispose();
      engineRef.current = null;
    }
    
    setIsInitialized(false);
  };

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-red-50 border border-red-200 rounded-lg`}>
        <div className="text-center p-8">
          <div className="text-red-600 text-lg font-semibold mb-2">3D Rendering Error</div>
          <div className="text-red-500 text-sm">{error}</div>
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full simulation-canvas"
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="text-white text-center">
            <div className="loading-spinner w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
            <div className="text-lg font-semibold">Initializing World</div>
            <div className="text-sm opacity-75">Loading terrain and entities...</div>
          </div>
        </div>
      )}
    </div>
  );
};