import type { ECSWorld } from '../world';
import { rng } from '../../../utils/rng';

export function agingSystem(world: ECSWorld, deltaTime: number): void {
  // Process aging for all entities with age component
  world.forEachEntityWith(['age', 'health'], (entityId, components) => {
    const age = components.age!;
    const health = components.health!;

    // Increment age
    age.value += deltaTime;

    // Age-based health effects
    applyAgeEffects(age, health);

    // Check for natural death
    if (shouldDieFromAge(age, health)) {
      handleNaturalDeath(world, entityId);
      return;
    }

    // Check for reproduction opportunity
    attemptReproduction(world, entityId, components);
  });
}

function applyAgeEffects(age: any, health: any): void {
  const ageRatio = age.value / age.maxAge;

  if (ageRatio > 0.8) {
    // Elderly - significant health decline
    health.current -= 0.005;
  } else if (ageRatio > 0.6) {
    // Middle-aged - gradual health decline
    health.current -= 0.001;
  } else if (ageRatio < 0.2) {
    // Young - slight health bonus
    health.current = Math.min(health.current + 0.0005, health.maximum);
  }

  // Clamp health
  health.current = Math.max(health.current, 0);
}

function shouldDieFromAge(age: any, health: any): boolean {
  const ageRatio = age.value / age.maxAge;
  
  // Natural lifespan exceeded
  if (age.value >= age.maxAge) {
    return true;
  }

  // Increased death chance as health declines with age
  if (ageRatio > 0.7 && health.current < 0.3) {
    const deathChance = (ageRatio - 0.7) * 0.1; // Up to 3% chance per tick at very old age
    return rng.randomBool(deathChance);
  }

  return false;
}

function handleNaturalDeath(world: ECSWorld, entityId: string): void {
  const entityData = world.getEntityData(entityId);
  const position = entityData.position;
  const species = entityData.species;

  // Remove the entity
  world.removeEntity(entityId);

  // Small chance of creating offspring nearby (represents life continuing)
  if (rng.randomBool(0.1) && position && species) {
    const newX = position.x + rng.randomFloat(-30, 30);
    const newY = position.y + rng.randomFloat(-30, 30);

    // Create young entity of the same species
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

    // Make the new entity young
    if (template.age) {
      template.age.value = 0;
    }

    world.createEntity(template);
  }
}

function attemptReproduction(world: ECSWorld, entityId: string, components: any): void {
  const age = components.age;
  const reproduction = world.getComponent(entityId, 'reproduction');
  const health = components.health;
  const hunger = world.getComponent(entityId, 'hunger');
  const energy = world.getComponent(entityId, 'energy');

  // Must have reproduction component
  if (!reproduction) return;

  // Must be mature
  if (age.value < age.maturityAge) return;

  // Must be healthy and well-fed
  if (health.current < 0.7 || (hunger && hunger.value > 0.4)) return;

  // Must have energy
  if (energy && energy.current < 0.5) return;

  // Must not be in reproduction cooldown
  if (reproduction.cooldown > 0) {
    reproduction.cooldown -= 1; // Reduce cooldown each tick
    return;
  }

  // Check for suitable conditions and nearby mates
  const position = components.position;
  const species = components.species;
  
  if (position && species && findNearbyMate(world, entityId, position, species)) {
    if (rng.randomBool(reproduction.fertility)) {
      // Successful reproduction
      createOffspring(world, position, species);
      
      // Set reproduction cooldown
      reproduction.cooldown = 200; // Prevent immediate re-reproduction
      
      // Reproduction costs energy
      if (energy) {
        energy.current -= 0.3;
        energy.current = Math.max(energy.current, 0);
      }
    }
  }
}

function findNearbyMate(world: ECSWorld, entityId: string, position: any, species: any): boolean {
  // Simple mate-finding logic - look for nearby entities of same species
  const mateSearchRadius = 50;
  
  const nearbyEntities = world.queryEntities(['position', 'species', 'age']);
  
  for (const nearbyId of nearbyEntities) {
    if (nearbyId === entityId) continue; // Skip self
    
    const nearbyPosition = world.getComponent(nearbyId, 'position');
    const nearbySpecies = world.getComponent(nearbyId, 'species');
    const nearbyAge = world.getComponent(nearbyId, 'age');
    
    if (!nearbyPosition || !nearbySpecies || !nearbyAge) continue;
    
    // Must be same species
    if (nearbySpecies.kind !== species.kind) continue;
    
    // Must be mature
    if (nearbyAge.value < nearbyAge.maturityAge) continue;
    
    // Check distance
    const dx = nearbyPosition.x - position.x;
    const dy = nearbyPosition.y - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= mateSearchRadius) {
      return true; // Found a suitable mate
    }
  }
  
  return false;
}

function createOffspring(world: ECSWorld, parentPosition: any, parentSpecies: any): void {
  // Create offspring near parent
  const offsetX = rng.randomFloat(-20, 20);
  const offsetY = rng.randomFloat(-20, 20);
  const newX = parentPosition.x + offsetX;
  const newY = parentPosition.y + offsetY;

  // Create appropriate species template
  let template: any = {};
  switch (parentSpecies.kind) {
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

  // Offspring start young and with good health
  if (template.age) {
    template.age.value = 0;
  }
  if (template.health) {
    template.health.current = template.health.maximum;
  }
  if (template.hunger) {
    template.hunger.value = 0.2; // Slightly hungry but not starving
  }

  world.createEntity(template);
}