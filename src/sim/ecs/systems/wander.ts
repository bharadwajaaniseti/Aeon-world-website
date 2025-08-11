import type { ECSWorld } from '../world';
import { rng } from '../../../utils/rng';

export function wanderSystem(world: ECSWorld, deltaTime: number): void {
  // Process movement for entities with position and behavior
  world.forEachEntityWith(['position', 'behavior', 'energy'], (entityId, components) => {
    const position = components.position!;
    const behavior = components.behavior!;
    const energy = components.energy!;

    // Skip if entity has no energy
    if (energy.current <= 0.1) {
      behavior.current = 'Resting';
      return;
    }

    // Handle behavior cooldowns
    if (behavior.cooldown > 0) {
      behavior.cooldown -= deltaTime;
      return;
    }

    // Determine movement based on species and current behavior
    const species = world.getComponent(entityId, 'species');
    const hunger = world.getComponent(entityId, 'hunger');
    
    updateBehavior(behavior, species, hunger, energy);
    executeMovement(position, behavior, species, deltaTime);
    
    // Consume energy for movement
    energy.current -= (energy.consumption * deltaTime);
    energy.current = Math.max(energy.current, 0);
  });
}

function updateBehavior(behavior: any, species: any, hunger: any, energy: any): void {
  if (!species) return;

  const energyLevel = energy?.current || 1;
  const hungerLevel = hunger?.value || 0;

  // Behavior priorities based on needs
  if (energyLevel < 0.2) {
    behavior.current = 'Resting';
    behavior.cooldown = 60; // Rest for a while
    return;
  }

  if (hungerLevel > 0.7) {
    // Very hungry - prioritize finding food
    switch (species.kind) {
      case 'HERBIVORE':
        behavior.current = 'Foraging';
        break;
      case 'PREDATOR':
        behavior.current = 'Hunting';
        break;
      case 'TRIBAL':
        behavior.current = hungerLevel > 0.8 ? 'Hunting' : 'Foraging';
        break;
    }
    return;
  }

  // Regular behavior patterns
  if (rng.randomBool(0.1)) { // 10% chance to change behavior each tick
    const behaviors = getBehaviorOptions(species.kind);
    behavior.current = rng.randomElement(behaviors);
  }
}

function getBehaviorOptions(speciesKind: string): string[] {
  switch (speciesKind) {
    case 'HERBIVORE':
      return ['Wandering', 'Foraging', 'Socializing', 'Resting'];
    case 'PREDATOR':
      return ['Patrolling', 'Hunting', 'Stalking', 'Resting'];
    case 'TRIBAL':
      return ['Wandering', 'Building', 'Crafting', 'Socializing', 'Exploring'];
    default:
      return ['Wandering'];
  }
}

function executeMovement(position: any, behavior: any, species: any, deltaTime: number): void {
  let moveSpeed = getBaseSpeed(species?.kind || 'HERBIVORE');
  let moveDistance = moveSpeed * deltaTime;

  // Modify movement based on behavior
  switch (behavior.current) {
    case 'Hunting':
    case 'Stalking':
      moveDistance *= 1.5; // Faster when hunting
      break;
    case 'Foraging':
      moveDistance *= 0.7; // Slower when foraging
      break;
    case 'Resting':
      moveDistance = 0; // No movement
      break;
    case 'Building':
    case 'Crafting':
      moveDistance *= 0.3; // Very slow when working
      break;
  }

  if (moveDistance > 0) {
    // Determine movement direction
    let targetX = position.x;
    let targetY = position.y;

    if (behavior.target) {
      // Move toward target
      const dx = behavior.target.x - position.x;
      const dy = behavior.target.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 1) {
        targetX += (dx / distance) * moveDistance;
        targetY += (dy / distance) * moveDistance;
      } else {
        // Reached target, clear it
        behavior.target = undefined;
      }
    } else {
      // Random wandering with some persistence
      const angle = rng.randomFloat(0, Math.PI * 2);
      const persistence = 0.8; // 80% chance to continue in similar direction
      
      if (!behavior.lastDirection || !rng.randomBool(persistence)) {
        behavior.lastDirection = angle;
      }

      targetX += Math.cos(behavior.lastDirection) * moveDistance;
      targetY += Math.sin(behavior.lastDirection) * moveDistance;
    }

    // Apply movement with world boundaries
    const worldSize = 1000;
    position.x = Math.max(-worldSize / 2, Math.min(worldSize / 2, targetX));
    position.y = Math.max(-worldSize / 2, Math.min(worldSize / 2, targetY));

    // Chance to set new target
    if (!behavior.target && rng.randomBool(0.05)) {
      setNewTarget(behavior, position, species);
    }
  }
}

function getBaseSpeed(speciesKind: string): number {
  switch (speciesKind) {
    case 'HERBIVORE':
      return 0.8;
    case 'PREDATOR':
      return 1.2;
    case 'TRIBAL':
      return 1.0;
    default:
      return 1.0;
  }
}

function setNewTarget(behavior: any, currentPosition: any, species: any): void {
  const maxDistance = getMaxWanderDistance(species?.kind || 'HERBIVORE');
  
  const angle = rng.randomFloat(0, Math.PI * 2);
  const distance = rng.randomFloat(10, maxDistance);
  
  behavior.target = {
    x: currentPosition.x + Math.cos(angle) * distance,
    y: currentPosition.y + Math.sin(angle) * distance,
  };

  // Clamp target to world boundaries
  const worldSize = 1000;
  behavior.target.x = Math.max(-worldSize / 2, Math.min(worldSize / 2, behavior.target.x));
  behavior.target.y = Math.max(-worldSize / 2, Math.min(worldSize / 2, behavior.target.y));
}

function getMaxWanderDistance(speciesKind: string): number {
  switch (speciesKind) {
    case 'HERBIVORE':
      return 100; // Short range foraging
    case 'PREDATOR':
      return 200; // Larger hunting territory
    case 'TRIBAL':
      return 150; // Moderate exploration range
    default:
      return 100;
  }
}