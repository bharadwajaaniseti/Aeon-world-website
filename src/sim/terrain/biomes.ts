// Biome definitions and utilities

export enum BiomeType {
  WATER = 0,
  GRASS = 1,
  FOREST = 2,
  MOUNTAIN = 3,
  DESERT = 4,
}

export interface BiomeData {
  id: BiomeType;
  name: string;
  color: [number, number, number]; // RGB values 0-1
  fertility: number; // 0-1, affects population capacity
  waterAvailable: number; // 0-1, affects survival
  movementSpeed: number; // 0-2, affects entity movement
  resources: string[]; // Available resources
}

export const BIOME_DATA: Record<BiomeType, BiomeData> = {
  [BiomeType.WATER]: {
    id: BiomeType.WATER,
    name: 'Water',
    color: [0.2, 0.4, 0.8],
    fertility: 0.3,
    waterAvailable: 1.0,
    movementSpeed: 0.3,
    resources: ['fish', 'water'],
  },
  [BiomeType.GRASS]: {
    id: BiomeType.GRASS,
    name: 'Grassland',
    color: [0.3, 0.7, 0.2],
    fertility: 0.8,
    waterAvailable: 0.6,
    movementSpeed: 1.2,
    resources: ['grass', 'herbs', 'small_game'],
  },
  [BiomeType.FOREST]: {
    id: BiomeType.FOREST,
    name: 'Forest',
    color: [0.1, 0.5, 0.1],
    fertility: 0.9,
    waterAvailable: 0.8,
    movementSpeed: 0.8,
    resources: ['wood', 'berries', 'game', 'herbs'],
  },
  [BiomeType.MOUNTAIN]: {
    id: BiomeType.MOUNTAIN,
    name: 'Mountain',
    color: [0.5, 0.4, 0.3],
    fertility: 0.2,
    waterAvailable: 0.4,
    movementSpeed: 0.6,
    resources: ['stone', 'minerals', 'mountain_herbs'],
  },
  [BiomeType.DESERT]: {
    id: BiomeType.DESERT,
    name: 'Desert',
    color: [0.8, 0.7, 0.3],
    fertility: 0.1,
    waterAvailable: 0.1,
    movementSpeed: 0.9,
    resources: ['cacti', 'rare_minerals'],
  },
};

// Biome transition colors for smooth blending
export const BIOME_COLORS = {
  [BiomeType.WATER]: [51, 102, 204],    // Blue
  [BiomeType.GRASS]: [76, 178, 51],     // Green
  [BiomeType.FOREST]: [25, 127, 25],    // Dark Green
  [BiomeType.MOUNTAIN]: [127, 102, 76], // Brown
  [BiomeType.DESERT]: [204, 178, 76],   // Sandy Yellow
};

export function getBiomeColor(biomeType: BiomeType): [number, number, number] {
  const color = BIOME_COLORS[biomeType];
  return [color[0] / 255, color[1] / 255, color[2] / 255];
}

export function getBiomeData(biomeType: BiomeType): BiomeData {
  return BIOME_DATA[biomeType] || BIOME_DATA[BiomeType.GRASS];
}

// Calculate biome effects on entities
export function calculateBiomeModifiers(biomeType: BiomeType): {
  hungerRate: number;
  energyConsumption: number;
  reproductionRate: number;
  movementSpeed: number;
} {
  const biome = getBiomeData(biomeType);
  
  return {
    hungerRate: 1 / biome.fertility, // Less fertile = more hungry
    energyConsumption: 2 - biome.movementSpeed, // Harder terrain = more energy
    reproductionRate: biome.fertility * biome.waterAvailable,
    movementSpeed: biome.movementSpeed,
  };
}

// Check if a biome is suitable for a specific species
export function isSuitableBiome(biomeType: BiomeType, speciesKind: string): number {
  const biome = getBiomeData(biomeType);
  
  switch (speciesKind) {
    case 'HERBIVORE':
      // Herbivores prefer grassland and forest
      if (biomeType === BiomeType.GRASS) return 1.0;
      if (biomeType === BiomeType.FOREST) return 0.8;
      if (biomeType === BiomeType.WATER) return 0.3;
      if (biomeType === BiomeType.DESERT) return 0.2;
      if (biomeType === BiomeType.MOUNTAIN) return 0.1;
      break;
      
    case 'PREDATOR':
      // Predators prefer areas with prey (forest, grass)
      if (biomeType === BiomeType.FOREST) return 1.0;
      if (biomeType === BiomeType.GRASS) return 0.9;
      if (biomeType === BiomeType.MOUNTAIN) return 0.6;
      if (biomeType === BiomeType.DESERT) return 0.4;
      if (biomeType === BiomeType.WATER) return 0.2;
      break;
      
    case 'TRIBAL':
      // Tribal beings prefer diverse environments with resources
      if (biomeType === BiomeType.FOREST) return 1.0;
      if (biomeType === BiomeType.GRASS) return 0.8;
      if (biomeType === BiomeType.WATER) return 0.7;
      if (biomeType === BiomeType.MOUNTAIN) return 0.5;
      if (biomeType === BiomeType.DESERT) return 0.3;
      break;
  }
  
  return 0.5; // Default suitability
}

// Get biome name for display
export function getBiomeName(biomeType: BiomeType): string {
  return getBiomeData(biomeType).name;
}

// Generate biome description
export function getBiomeDescription(biomeType: BiomeType): string {
  const biome = getBiomeData(biomeType);
  const resourceList = biome.resources.join(', ');
  
  const fertility = biome.fertility > 0.7 ? 'very fertile' : 
                   biome.fertility > 0.4 ? 'moderately fertile' : 'sparse';
  
  const water = biome.waterAvailable > 0.7 ? 'abundant water' :
                biome.waterAvailable > 0.4 ? 'some water' : 'little water';
  
  return `${biome.name}: A ${fertility} region with ${water}. Resources: ${resourceList}.`;
}

// Utility to convert world coordinates to biome coordinates
export function worldToBiomeCoordinates(
  worldX: number,
  worldY: number,
  worldSize: number,
  biomeSize: number
): { x: number; y: number } {
  // Convert world coordinates (-worldSize/2 to worldSize/2) to biome coordinates (0 to biomeSize)
  const x = Math.floor(((worldX + worldSize / 2) / worldSize) * biomeSize);
  const y = Math.floor(((worldY + worldSize / 2) / worldSize) * biomeSize);
  
  return {
    x: Math.max(0, Math.min(biomeSize - 1, x)),
    y: Math.max(0, Math.min(biomeSize - 1, y)),
  };
}

// Sample biome at world position
export function sampleBiomeAtPosition(
  worldX: number,
  worldY: number,
  biomeData: Uint8Array,
  worldSize: number,
  biomeSize: number
): BiomeType {
  const coords = worldToBiomeCoordinates(worldX, worldY, worldSize, biomeSize);
  const index = coords.y * biomeSize + coords.x;
  return biomeData[index] || BiomeType.GRASS;
}