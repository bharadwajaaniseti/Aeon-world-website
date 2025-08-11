import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Vector3,
  VertexData,
  Mesh,
  InstancedMesh,
  Color3,
  Matrix,
} from '@babylonjs/core';
import { generateHeightmap, generateBiomes, createTerrainConfig } from '../terrain/generateHeightmap';
import { getBiomeColor, BiomeType } from '../terrain/biomes';

let terrainMesh: Mesh | null = null;
let entityInstances: InstancedMesh[] = [];

export async function createTerrain(scene: Scene, seed: number): Promise<void> {
  // Clean up existing terrain
  if (terrainMesh) {
    terrainMesh.dispose();
    terrainMesh = null;
  }

  // Generate heightmap and biomes
  const terrainConfig = createTerrainConfig({
    width: 128,
    height: 128,
    seed,
    scale: 50,
  });

  const heightmap = generateHeightmap(terrainConfig);
  const biomes = generateBiomes(heightmap, seed);

  // Create terrain mesh
  terrainMesh = createTerrainMesh(scene, heightmap, biomes);
  
  // Create initial entity instances
  createEntityInstances(scene);
  
  console.log('✅ Terrain created with instancing support');
}

function createTerrainMesh(scene: Scene, heightmap: any, biomes: Uint8Array): Mesh {
  const { width, height, data } = heightmap;
  
  // Create vertices
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const worldSize = 1000;
  const scaleX = worldSize / width;
  const scaleZ = worldSize / height;
  const heightScale = 100;

  // Generate vertices
  for (let z = 0; z < height; z++) {
    for (let x = 0; x < width; x++) {
      const index = z * width + x;
      const heightValue = data[index] * heightScale;
      const biome = biomes[index];

      // Position
      const worldX = (x - width / 2) * scaleX;
      const worldZ = (z - height / 2) * scaleZ;
      positions.push(worldX, heightValue, worldZ);

      // Color based on biome
      const [r, g, b] = getBiomeColor(biome);
      colors.push(r, g, b, 1.0);

      // Calculate normal (simplified)
      let nx = 0, ny = 1, nz = 0;
      
      if (x > 0 && x < width - 1 && z > 0 && z < height - 1) {
        const heightL = data[z * width + (x - 1)] * heightScale;
        const heightR = data[z * width + (x + 1)] * heightScale;
        const heightD = data[(z - 1) * width + x] * heightScale;
        const heightU = data[(z + 1) * width + x] * heightScale;
        
        nx = (heightL - heightR) / (2 * scaleX);
        nz = (heightD - heightU) / (2 * scaleZ);
        
        const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
        nx /= length;
        ny /= length;
        nz /= length;
      }
      
      normals.push(nx, ny, nz);
    }
  }

  // Generate indices
  for (let z = 0; z < height - 1; z++) {
    for (let x = 0; x < width - 1; x++) {
      const topLeft = z * width + x;
      const topRight = z * width + (x + 1);
      const bottomLeft = (z + 1) * width + x;
      const bottomRight = (z + 1) * width + (x + 1);

      // First triangle
      indices.push(topLeft, bottomLeft, topRight);
      // Second triangle
      indices.push(topRight, bottomLeft, bottomRight);
    }
  }

  // Create mesh
  const terrain = new Mesh('terrain', scene);
  const vertexData = new VertexData();
  
  vertexData.positions = positions;
  vertexData.normals = normals;
  vertexData.colors = colors;
  vertexData.indices = indices;
  
  vertexData.applyToMesh(terrain);

  // Create material
  const material = new StandardMaterial('terrainMaterial', scene);
  material.diffuseColor = new Color3(1, 1, 1);
  material.specularColor = new Color3(0.1, 0.1, 0.1);
  material.emissiveColor = new Color3(0.05, 0.05, 0.05);
  terrain.material = material;

  return terrain;
}

function createEntityInstances(scene: Scene): void {
  // Clear existing instances
  entityInstances.forEach(instance => instance.dispose());
  entityInstances = [];

  // Create base meshes for different species
  const herbivoreBase = createSpeciesMesh(scene, 'herbivore');
  const predatorBase = createSpeciesMesh(scene, 'predator');
  const tribalBase = createSpeciesMesh(scene, 'tribal');

  // These would be updated with actual entity data
  // For now, create some placeholder instances
  createSpeciesInstances(herbivoreBase, 'HERBIVORE', 100);
  createSpeciesInstances(predatorBase, 'PREDATOR', 50);
  createSpeciesInstances(tribalBase, 'TRIBAL', 25);
}

function createSpeciesMesh(scene: Scene, species: string): Mesh {
  let mesh: Mesh;
  let material: StandardMaterial;

  switch (species) {
    case 'herbivore':
      mesh = MeshBuilder.CreateSphere(`${species}Base`, { diameter: 2 }, scene);
      material = new StandardMaterial(`${species}Material`, scene);
      material.diffuseColor = new Color3(0.2, 0.8, 0.2); // Green
      break;
    case 'predator':
      mesh = MeshBuilder.CreateBox(`${species}Base`, { size: 2 }, scene);
      material = new StandardMaterial(`${species}Material`, scene);
      material.diffuseColor = new Color3(0.8, 0.2, 0.2); // Red
      break;
    case 'tribal':
      mesh = MeshBuilder.CreateCylinder(`${species}Base`, { height: 3, diameter: 2 }, scene);
      material = new StandardMaterial(`${species}Material`, scene);
      material.diffuseColor = new Color3(0.2, 0.2, 0.8); // Blue
      break;
    default:
      mesh = MeshBuilder.CreateSphere(`${species}Base`, { diameter: 1 }, scene);
      material = new StandardMaterial(`${species}Material`, scene);
      material.diffuseColor = new Color3(0.5, 0.5, 0.5); // Gray
  }

  mesh.material = material;
  mesh.setEnabled(false); // Base mesh is not rendered directly
  
  return mesh;
}

function createSpeciesInstances(baseMesh: Mesh, species: string, count: number): void {
  for (let i = 0; i < count; i++) {
    const instance = baseMesh.createInstance(`${species}_${i}`);
    
    // Random position for now (would be updated with real entity data)
    const x = (Math.random() - 0.5) * 800;
    const z = (Math.random() - 0.5) * 800;
    const y = 5; // Height above terrain (would be calculated from heightmap)
    
    instance.position = new Vector3(x, y, z);
    
    // Random scale variation
    const scale = 0.8 + Math.random() * 0.4;
    instance.scaling = new Vector3(scale, scale, scale);
    
    entityInstances.push(instance);
  }
}

// Function to update entity positions (called from the main simulation)
export function updateEntityInstances(entityData: Map<string, any>): void {
  // This would update the positions of instanced meshes based on ECS entity data
  // For now, just log the count
  console.log(`Updating ${entityData.size} entity instances`);
  
  // In a real implementation, this would:
  // 1. Match entity IDs to instance IDs
  // 2. Update positions, rotations, and scales
  // 3. Handle LOD (level of detail) switching
  // 4. Frustum culling for performance
}

// Performance optimization: LOD system
export function updateLOD(camera: any): void {
  // This would switch between different levels of detail based on distance from camera
  // - Close entities: full geometry
  // - Medium distance: simplified geometry  
  // - Far distance: billboards/impostors
}

// Cleanup function
export function disposeInstancing(): void {
  if (terrainMesh) {
    terrainMesh.dispose();
    terrainMesh = null;
  }
  
  entityInstances.forEach(instance => instance.dispose());
  entityInstances = [];
}