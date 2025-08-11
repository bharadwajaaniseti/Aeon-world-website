import { rng } from '../../utils/rng';

export interface HeightmapData {
  width: number;
  height: number;
  data: Float32Array;
  minHeight: number;
  maxHeight: number;
}

export interface TerrainConfig {
  width: number;
  height: number;
  scale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
  seed: number;
}

// Simple noise function using seeded random
function noise2D(x: number, y: number, seed: number): number {
  // Create a simple hash-based noise
  let hash = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return (hash - Math.floor(hash)) * 2 - 1; // Return value between -1 and 1
}

// Interpolation functions
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

// Perlin-like noise using interpolated hash noise
function smoothNoise2D(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  // Get noise values at grid corners
  const a = noise2D(ix, iy, seed);
  const b = noise2D(ix + 1, iy, seed);
  const c = noise2D(ix, iy + 1, seed);
  const d = noise2D(ix + 1, iy + 1, seed);

  // Smooth interpolation
  const sx = smoothstep(fx);
  const sy = smoothstep(fy);

  // Interpolate
  const i1 = lerp(a, b, sx);
  const i2 = lerp(c, d, sx);
  return lerp(i1, i2, sy);
}

// Fractal noise (multiple octaves)
function fractalNoise(x: number, y: number, config: TerrainConfig): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < config.octaves; i++) {
    value += smoothNoise2D(x * frequency / config.scale, y * frequency / config.scale, config.seed) * amplitude;
    maxValue += amplitude;
    amplitude *= config.persistence;
    frequency *= config.lacunarity;
  }

  return value / maxValue; // Normalize to [-1, 1]
}

export function generateHeightmap(config: TerrainConfig): HeightmapData {
  const { width, height } = config;
  const data = new Float32Array(width * height);
  
  let minHeight = Infinity;
  let maxHeight = -Infinity;

  // Generate height values
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      
      // Generate base terrain using fractal noise
      let heightValue = fractalNoise(x, y, config);
      
      // Apply additional terrain features
      heightValue = applyTerrainFeatures(x, y, width, height, heightValue, config);
      
      data[index] = heightValue;
      minHeight = Math.min(minHeight, heightValue);
      maxHeight = Math.max(maxHeight, heightValue);
    }
  }

  // Normalize heights to [0, 1] range
  const heightRange = maxHeight - minHeight;
  if (heightRange > 0) {
    for (let i = 0; i < data.length; i++) {
      data[i] = (data[i] - minHeight) / heightRange;
    }
  }

  return {
    width,
    height,
    data,
    minHeight: 0,
    maxHeight: 1,
  };
}

function applyTerrainFeatures(
  x: number,
  y: number,
  width: number,
  height: number,
  baseHeight: number,
  config: TerrainConfig
): number {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
  
  // Distance from center
  const distanceFromCenter = Math.sqrt(
    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
  );
  const normalizedDistance = distanceFromCenter / maxDistance;
  
  // Create circular falloff from center (valley effect)
  const valleyFactor = 1 - Math.pow(normalizedDistance, 1.5);
  
  // Add ridges using additional noise
  const ridgeNoise = smoothNoise2D(x / (config.scale * 0.3), y / (config.scale * 0.3), config.seed + 1000);
  const ridges = Math.abs(ridgeNoise) * 0.3;
  
  // Add rivers/valleys using noise
  const riverNoise = smoothNoise2D(x / (config.scale * 2), y / (config.scale * 2), config.seed + 2000);
  const rivers = -Math.abs(riverNoise) * 0.2;
  
  // Combine all features
  let finalHeight = baseHeight;
  finalHeight *= valleyFactor; // Apply valley shape
  finalHeight += ridges; // Add ridges
  finalHeight += rivers; // Add river valleys
  
  // Ensure height stays within bounds
  return Math.max(-1, Math.min(1, finalHeight));
}

// Generate biome data based on height and additional noise
export function generateBiomes(heightmap: HeightmapData, seed: number = 12345): Uint8Array {
  const { width, height, data } = heightmap;
  const biomes = new Uint8Array(width * height);
  
  // Biome constants
  const WATER = 0;
  const GRASS = 1;
  const FOREST = 2;
  const MOUNTAIN = 3;
  const DESERT = 4;
  
  for (let i = 0; i < data.length; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    const altitude = data[i];
    
    // Temperature and moisture based on position and noise
    const temperature = smoothNoise2D(x / 100, y / 100, seed + 3000) * 0.5 + 0.5;
    const moisture = smoothNoise2D(x / 80, y / 80, seed + 4000) * 0.5 + 0.5;
    
    let biome = GRASS; // Default
    
    if (altitude < 0.2) {
      biome = WATER;
    } else if (altitude > 0.7) {
      biome = MOUNTAIN;
    } else if (temperature < 0.3 && moisture > 0.6) {
      biome = FOREST;
    } else if (temperature > 0.7 && moisture < 0.3) {
      biome = DESERT;
    } else {
      biome = GRASS;
    }
    
    biomes[i] = biome;
  }
  
  return biomes;
}

// Utility function to sample height at any position
export function sampleHeight(heightmap: HeightmapData, x: number, y: number): number {
  const { width, height, data } = heightmap;
  
  // Clamp coordinates to valid range
  x = Math.max(0, Math.min(width - 1, x));
  y = Math.max(0, Math.min(height - 1, y));
  
  const index = Math.floor(y) * width + Math.floor(x);
  return data[index] || 0;
}

// Create default terrain configuration
export function createTerrainConfig(overrides: Partial<TerrainConfig> = {}): TerrainConfig {
  return {
    width: 256,
    height: 256,
    scale: 100,
    octaves: 6,
    persistence: 0.5,
    lacunarity: 2.0,
    seed: 12345,
    ...overrides,
  };
}