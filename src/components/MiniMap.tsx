import React, { useRef, useEffect, useState } from 'react';
import { useSimStore } from '../state/useSimStore';
import { useUIStore } from '../state/useUIStore';

export const MiniMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { entities } = useSimStore();
  const { biomesOverlay, populationOverlay } = useUIStore();
  const [isVisible, setIsVisible] = useState(true);

  const mapSize = 150;
  const worldSize = 1000;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, mapSize, mapSize);

    // Draw terrain background
    if (biomesOverlay) {
      drawTerrain(ctx);
    }

    // Draw entities
    drawEntities(ctx);

    // Draw camera viewport
    drawViewport(ctx);
  }, [entities, biomesOverlay, populationOverlay]);

  const drawTerrain = (ctx: CanvasRenderingContext2D) => {
    // Simple terrain representation
    const gradient = ctx.createRadialGradient(mapSize/2, mapSize/2, 0, mapSize/2, mapSize/2, mapSize/2);
    gradient.addColorStop(0, '#10b981'); // Emerald center
    gradient.addColorStop(0.6, '#059669'); // Darker emerald
    gradient.addColorStop(1, '#064e3b'); // Dark edge
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, mapSize, mapSize);
  };

  const drawEntities = (ctx: CanvasRenderingContext2D) => {
    entities.forEach((entity) => {
      const x = ((entity.position.x + worldSize / 2) / worldSize) * mapSize;
      const y = ((entity.position.y + worldSize / 2) / worldSize) * mapSize;

      if (x >= 0 && x <= mapSize && y >= 0 && y <= mapSize) {
        // Color based on species
        switch (entity.species) {
          case 'HERBIVORE':
            ctx.fillStyle = '#22c55e';
            break;
          case 'PREDATOR':
            ctx.fillStyle = '#ef4444';
            break;
          case 'TRIBAL':
            ctx.fillStyle = '#3b82f6';
            break;
          default:
            ctx.fillStyle = '#9ca3af';
        }

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const drawViewport = (ctx: CanvasRenderingContext2D) => {
    // Draw camera viewport indicator (simplified)
    const viewSize = 60; // Camera view area
    const centerX = mapSize / 2;
    const centerY = mapSize / 2;

    ctx.strokeStyle = '#ffffff88';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      centerX - viewSize / 2,
      centerY - viewSize / 2,
      viewSize,
      viewSize
    );
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / mapSize) * worldSize - worldSize / 2;
    const y = ((event.clientY - rect.top) / mapSize) * worldSize - worldSize / 2;

    // In a real implementation, this would focus the camera
    console.log(`Focus camera on: ${x.toFixed(0)}, ${y.toFixed(0)}`);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="w-8 h-8 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white/60 hover:text-white/80 transition-colors"
        aria-label="Show minimap"
      >
        📍
      </button>
    );
  }

  return (
    <div className="glass-panel p-2 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-xs font-medium">World Map</span>
        <button
          onClick={() => setIsVisible(false)}
          className="w-4 h-4 rounded text-white/60 hover:text-white/80 transition-colors text-xs"
        >
          ✕
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={mapSize}
        height={mapSize}
        onClick={handleClick}
        className="w-full h-auto cursor-crosshair rounded border border-white/20"
        style={{ width: mapSize, height: mapSize }}
      />
      <div className="text-xs text-white/60 mt-1 text-center">
        {entities.size} entities
      </div>
    </div>
  );
};