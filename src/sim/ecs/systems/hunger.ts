import type { ECSWorld } from '../world';
import { rng } from '../../../utils/rng';

export function hungerSystem(world: ECSWorld, deltaTime: number): void {
  // Process hunger for all entities with hunger component
  world.forEachEntityWith(['hunger', 'health', 'energy'], (entityId, components) => {
    const hunger = components.hunger!;
    const health = components.health!;
    const energy = components.energy!;

    // Increase hunger over time
    hunger.value += hunger.rate * deltaTime;
    hunger.value = Math.min(hunger.value, 1.0);

    // Hunger affects health and energy
    if (hunger.value > 0.8) {
      // Starving - rapidly lose health and energy
      health.current -= 0.01 * deltaTime;
      energy.current -= 0.02 * deltaTime;
    } else if (hunger.value > 0.5) {
      // Hungry - slowly lose health and energy
      health.current -= 0.002 * deltaTime;
      energy.current -= 0.005 * deltaTime;
    } else if (hunger.value < 0.3) {
      // Well fed - slowly recover health and energy
      health.current = Math.min(health.current + 0.001 * deltaTime, health.maximum);
      energy.current = Math.min(energy.current + 0.003 * deltaTime, 1.0);
    }

    // Clamp values
    health.current = Math.max(health.current, 0);
    energy.current = Math.max(energy.current, 0);

    // Death from starvation
    if (health.current <= 0) {
      handleStarvationDeath(world, entityId);
      return;
    }

    // Feeding behavior
    attemptFeeding(world, entityId, components);
  });
}

function handleStarvationDeath(world: ECSWorld, entityId: string): void {
  // Get entity data before removal for potential respawn
  const entityData = world.getEntityData(entityId);
  const position = entityData.position;
  const species = entityData.species;

  // Remove the entity
  world.removeEntity(entityId);

  // Small chance of creating a new entity nearby (representing new life)
  if (rng.randomBool(0.05) && position && species) {
    const newX = position.x + rng.randomFloat(-50, 50);
    const newY = position.y + rng.randomFloat(-50, 50);

    // Create appropriate species template
    let template: any = {};
    switch (species.kind) {
      case 'HERBIVORE':
        const { createHerbivore } = require('../components');
        template = createHerbivore(newX, newY);
        break;
      case 'PREDATOR':
        const { createPredator } = require('../components');
        template = createPredator(newX, newY);
        break;
      case 'TRIBAL':
        const { createTribal } = require('../components');
        template = createTribal(newX, newY);
        break;
    }

    world.createEntity(template);
  }
}

function attemptFeeding(world: ECSWorld, entityId: string, components: any): void {
  const hunger = components.hunger;
  const species = components.species;
  const position = components.position;
  const behavior = components.behavior;

  // Only attempt feeding if hungry enough
  if (hunger.value < 0.3) return;

  const feedingChance = calculateFeedingChance(species.kind, position);
  
  if (rng.randomBool(feedingChance)) {
    // Successful feeding
    hunger.value = Math.max(hunger.value - 0.3, 0);
    
    // Update behavior
    if (behavior) {
      behavior.current = 'Feeding';
      behavior.cooldown = 30; // Feeding animation duration
    }
  }
}

function calculateFeedingChance(speciesKind: string, position: any): number {
  // Base feeding chances
  const baseChances = {
    HERBIVORE: 0.15, // Easy to find vegetation
    PREDATOR: 0.05,  // Harder to catch prey
    TRIBAL: 0.10,    // Moderate - can forage and hunt
  };

  let chance = baseChances[speciesKind as keyof typeof baseChances] || 0.01;

  // Modify based on terrain (simple biome-based feeding)
  // In a real implementation, this would check actual terrain data
  const distanceFromOrigin = Math.sqrt(position.x * position.x + position.y * position.y);
  
  if (distanceFromOrigin < 200) {
    // Near center - rich feeding area
    chance *= 1.5;
  } else if (distanceFromOrigin > 400) {
    // Far from center - sparse feeding
    chance *= 0.5;
  }

  return Math.min(chance, 0.3); // Cap at 30% per tick
}