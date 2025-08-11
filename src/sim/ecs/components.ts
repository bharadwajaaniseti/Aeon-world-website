// ECS Components for the simulation

export interface Position {
  x: number;
  y: number;
}

export interface Altitude {
  value: number;
}

export interface Species {
  kind: 'HERBIVORE' | 'PREDATOR' | 'TRIBAL';
}

export interface Hunger {
  value: number; // 0 = full, 1 = starving
  rate: number;  // how fast hunger increases
}

export interface Age {
  value: number;       // current age in simulation ticks
  maxAge: number;      // natural lifespan
  maturityAge: number; // age at which reproduction is possible
}

export interface Health {
  current: number; // 0-1
  maximum: number; // usually 1
}

export interface Behavior {
  current: string;
  target?: Position;
  cooldown: number;
}

export interface VillageId {
  id: string | null;
}

export interface Selected {
  timestamp: number;
}

export interface Reproduction {
  cooldown: number;
  fertility: number; // 0-1 chance of reproduction when conditions are met
}

export interface Energy {
  current: number; // 0-1
  consumption: number; // energy consumed per tick
}

// Entity ID type
export type EntityId = string;

// Component registry
export interface ComponentData {
  position: Position;
  altitude: Altitude;
  species: Species;
  hunger: Hunger;
  age: Age;
  health: Health;
  behavior: Behavior;
  villageId: VillageId;
  selected: Selected;
  reproduction: Reproduction;
  energy: Energy;
}

export type ComponentType = keyof ComponentData;

// Component creation helpers
export const createPosition = (x: number = 0, y: number = 0): Position => ({ x, y });

export const createAltitude = (value: number = 0): Altitude => ({ value });

export const createSpecies = (kind: Species['kind'] = 'HERBIVORE'): Species => ({ kind });

export const createHunger = (value: number = 0, rate: number = 0.01): Hunger => ({ value, rate });

export const createAge = (
  value: number = 0,
  maxAge: number = 1000,
  maturityAge: number = 100
): Age => ({ value, maxAge, maturityAge });

export const createHealth = (current: number = 1, maximum: number = 1): Health => ({ current, maximum });

export const createBehavior = (current: string = 'Wandering'): Behavior => ({
  current,
  cooldown: 0,
});

export const createVillageId = (id: string | null = null): VillageId => ({ id });

export const createReproduction = (
  cooldown: number = 0,
  fertility: number = 0.1
): Reproduction => ({ cooldown, fertility });

export const createEnergy = (
  current: number = 1,
  consumption: number = 0.005
): Energy => ({ current, consumption });

// Entity templates
export function createHerbivore(x: number, y: number): Partial<ComponentData> {
  return {
    position: createPosition(x, y),
    altitude: createAltitude(0),
    species: createSpecies('HERBIVORE'),
    hunger: createHunger(0, 0.008),
    age: createAge(0, 800, 80),
    health: createHealth(),
    behavior: createBehavior('Foraging'),
    energy: createEnergy(1, 0.004),
    reproduction: createReproduction(0, 0.12),
  };
}

export function createPredator(x: number, y: number): Partial<ComponentData> {
  return {
    position: createPosition(x, y),
    altitude: createAltitude(0),
    species: createSpecies('PREDATOR'),
    hunger: createHunger(0, 0.015),
    age: createAge(0, 600, 60),
    health: createHealth(),
    behavior: createBehavior('Hunting'),
    energy: createEnergy(1, 0.008),
    reproduction: createReproduction(0, 0.08),
  };
}

export function createTribal(x: number, y: number): Partial<ComponentData> {
  return {
    position: createPosition(x, y),
    altitude: createAltitude(0),
    species: createSpecies('TRIBAL'),
    hunger: createHunger(0, 0.01),
    age: createAge(0, 1200, 120),
    health: createHealth(),
    behavior: createBehavior('Building'),
    energy: createEnergy(1, 0.003),
    reproduction: createReproduction(0, 0.06),
    villageId: createVillageId(),
  };
}