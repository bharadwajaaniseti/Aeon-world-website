import { useEffect, useRef } from 'react';
import { useSimStore } from '../state/useSimStore';
import { useUIStore } from '../state/useUIStore';
import { ECSWorld } from '../sim/ecs/world';
import { hungerSystem } from '../sim/ecs/systems/hunger';
import { wanderSystem } from '../sim/ecs/systems/wander';
import { agingSystem } from '../sim/ecs/systems/aging';
import { rng } from '../utils/rng';
import { simTime } from '../utils/time';
import type { EntityDetail, Event } from '../api/types';

const TICK_RATE = 50; // 20 FPS for simulation
const EVENTS_PER_SECOND = 0.5; // Average events per second

export function useSimulation() {
  const worldRef = useRef<ECSWorld | null>(null);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eventIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastEventTime = useRef<number>(0);

  const { isPaused, simulationSpeed, worldSeed } = useUIStore();
  const {
    incrementTick,
    updateEntities,
    addEvent,
    setLoading,
    setError,
    updateMetrics,
  } = useSimStore();

  // Initialize world
  useEffect(() => {
    try {
      setLoading(true);
      
      // Set RNG seed
      rng.setSeed(worldSeed);
      
      // Create ECS world
      worldRef.current = new ECSWorld();
      
      // Reset simulation time
      simTime.reset();
      
      setLoading(false);
      console.log('✅ Simulation initialized');
    } catch (error) {
      console.error('❌ Simulation initialization failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize simulation');
    }
  }, [worldSeed]);

  // Main simulation loop
  useEffect(() => {
    if (!worldRef.current || isPaused) {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      return;
    }

    const tickInterval = TICK_RATE / simulationSpeed;
    
    tickIntervalRef.current = setInterval(() => {
      if (!worldRef.current) return;

      const deltaTime = 1; // Fixed timestep

      try {
        // Run ECS systems
        hungerSystem(worldRef.current, deltaTime);
        wanderSystem(worldRef.current, deltaTime);
        agingSystem(worldRef.current, deltaTime);

        // Update stores
        incrementTick();
        updateEntitiesFromWorld();
        updateMetricsFromWorld();
      } catch (error) {
        console.error('Simulation tick error:', error);
      }
    }, tickInterval);

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    };
  }, [isPaused, simulationSpeed, worldRef.current]);

  // Event generation
  useEffect(() => {
    if (isPaused) {
      if (eventIntervalRef.current) {
        clearInterval(eventIntervalRef.current);
        eventIntervalRef.current = null;
      }
      return;
    }

    eventIntervalRef.current = setInterval(() => {
      generateRandomEvent();
    }, (1000 / EVENTS_PER_SECOND) / simulationSpeed);

    return () => {
      if (eventIntervalRef.current) {
        clearInterval(eventIntervalRef.current);
        eventIntervalRef.current = null;
      }
    };
  }, [isPaused, simulationSpeed]);

  const updateEntitiesFromWorld = () => {
    if (!worldRef.current) return;

    const entities: EntityDetail[] = [];
    
    worldRef.current.forEachEntityWith(['position', 'species', 'hunger', 'age'], (entityId, components) => {
      const entity: EntityDetail = {
        id: entityId,
        species: components.species!.kind,
        position: components.position!,
        age: components.age!.value,
        hunger: components.hunger!.value,
        createdAt: new Date().toISOString(),
        behavior: components.behavior?.current,
        health: components.health?.current,
        altitude: components.altitude?.value,
        experience: Math.floor(components.age!.value / 10),
        traits: generateTraits(components.species!.kind),
      };
      entities.push(entity);
    });

    updateEntities(entities);
  };

  const updateMetricsFromWorld = () => {
    if (!worldRef.current) return;

    const populationBySpecies = worldRef.current.getPopulationBySpecies();
    
    updateMetrics({
      timestamp: new Date().toISOString(),
      population: {
        total: worldRef.current.getEntityCount(),
        bySpecies: populationBySpecies,
      },
      births: Math.floor(rng.random() * 10),
      deaths: Math.floor(rng.random() * 5),
      discoveries: Math.floor(rng.random() * 3),
    });
  };

  const generateRandomEvent = () => {
    if (!worldRef.current) return;

    const eventTypes = ['BIRTH', 'DEATH', 'DISCOVERY', 'MIGRATION', 'INTERACTION'] as const;
    const eventType = rng.randomElement(eventTypes);
    
    const event: Event = {
      id: `event-${Date.now()}-${Math.random()}`,
      kind: eventType,
      timestamp: new Date().toISOString(),
      description: generateEventDescription(eventType),
      entityId: getRandomEntityId(),
      metadata: {},
    };

    addEvent(event);
  };

  const generateEventDescription = (eventType: string): string => {
    const descriptions = {
      BIRTH: [
        'A new life emerges in the eastern meadows',
        'Young offspring spotted near the central valley',
        'Fresh tracks indicate recent births in the forest',
      ],
      DEATH: [
        'An elder passes peacefully by the riverbank',
        'Natural causes claim a life in the northern territories',
        'The circle of life continues as one journey ends',
      ],
      DISCOVERY: [
        'Explorers uncover a new water source',
        'Rich feeding grounds discovered in the south',
        'Ancient pathways revealed by curious wanderers',
      ],
      MIGRATION: [
        'Large group movement detected across the plains',
        'Seasonal migration begins toward warmer regions',
        'Nomadic patterns shift with changing conditions',
      ],
      INTERACTION: [
        'Peaceful encounter between different species',
        'Complex social behavior observed near gathering spots',
        'Unusual cooperation witnessed during feeding time',
      ],
    };

    return rng.randomElement(descriptions[eventType as keyof typeof descriptions]);
  };

  const getRandomEntityId = (): string | undefined => {
    if (!worldRef.current) return undefined;
    
    const entities = worldRef.current.getAllEntities();
    if (entities.length === 0) return undefined;
    
    return rng.randomElement(entities);
  };

  const generateTraits = (species: string): string[] => {
    const traitPool = {
      HERBIVORE: ['Gentle', 'Alert', 'Social', 'Cautious', 'Nurturing'],
      PREDATOR: ['Fierce', 'Cunning', 'Solitary', 'Patient', 'Territorial'],
      TRIBAL: ['Wise', 'Cooperative', 'Inventive', 'Spiritual', 'Protective'],
    };

    const traits = traitPool[species as keyof typeof traitPool] || ['Mysterious'];
    const numTraits = rng.randomInt(1, 4);
    const selectedTraits: string[] = [];

    for (let i = 0; i < numTraits; i++) {
      const trait = rng.randomElement(traits);
      if (!selectedTraits.includes(trait)) {
        selectedTraits.push(trait);
      }
    }

    return selectedTraits;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
      if (eventIntervalRef.current) {
        clearInterval(eventIntervalRef.current);
      }
    };
  }, []);
}