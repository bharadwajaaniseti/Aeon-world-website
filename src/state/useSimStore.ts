import { create } from 'zustand';
import type { Entity, EntityDetail, Event, WorldMetrics } from '../api/types';

interface SimulationState {
  // World state
  worldId: string;
  currentTick: number;
  dayCount: number;
  population: number;
  
  // Entities
  entities: Map<string, EntityDetail>;
  selectedEntity: EntityDetail | null;
  
  // Events
  recentEvents: Event[];
  eventFilter: string; // 'All' | 'Birth' | 'Death' | 'Discovery'
  
  // Metrics
  metrics: WorldMetrics | null;
  lastMetricsUpdate: number;
  
  // Performance
  fps: number;
  renderTime: number;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

interface SimulationActions {
  // World actions
  setWorldId: (worldId: string) => void;
  incrementTick: () => void;
  setDayCount: (count: number) => void;
  setPopulation: (population: number) => void;
  
  // Entity actions
  updateEntities: (entities: EntityDetail[]) => void;
  selectEntity: (entityId: string) => void;
  clearSelection: () => void;
  updateSelectedEntity: (entity: EntityDetail) => void;
  
  // Event actions
  addEvent: (event: Event) => void;
  addEvents: (events: Event[]) => void;
  setEventFilter: (filter: string) => void;
  clearEvents: () => void;
  
  // Metrics actions
  updateMetrics: (metrics: WorldMetrics) => void;
  
  // Performance actions
  updateFPS: (fps: number) => void;
  updateRenderTime: (ms: number) => void;
  
  // Loading actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utility actions
  reset: () => void;
}

type SimStore = SimulationState & SimulationActions;

const initialState: SimulationState = {
  worldId: 'default-world',
  currentTick: 0,
  dayCount: 0,
  population: 0,
  entities: new Map(),
  selectedEntity: null,
  recentEvents: [],
  eventFilter: 'All',
  metrics: null,
  lastMetricsUpdate: 0,
  fps: 0,
  renderTime: 0,
  isLoading: false,
  error: null,
};

export const useSimStore = create<SimStore>((set, get) => ({
  ...initialState,

  // World actions
  setWorldId: (worldId) => set({ worldId }),
  
  incrementTick: () => set((state) => ({ currentTick: state.currentTick + 1 })),
  
  setDayCount: (count) => set({ dayCount: count }),
  
  setPopulation: (population) => set({ population }),

  // Entity actions
  updateEntities: (entities) => {
    const entityMap = new Map<string, EntityDetail>();
    entities.forEach((entity) => {
      entityMap.set(entity.id, entity);
    });
    set({ entities: entityMap, population: entities.length });
  },

  selectEntity: (entityId) => {
    const { entities } = get();
    const entity = entities.get(entityId) || null;
    set({ selectedEntity: entity });
  },

  clearSelection: () => set({ selectedEntity: null }),

  updateSelectedEntity: (entity) => set({ selectedEntity: entity }),

  // Event actions
  addEvent: (event) =>
    set((state) => ({
      recentEvents: [event, ...state.recentEvents].slice(0, 100), // Keep last 100 events
    })),

  addEvents: (events) =>
    set((state) => ({
      recentEvents: [...events, ...state.recentEvents].slice(0, 100),
    })),

  setEventFilter: (filter) => set({ eventFilter: filter }),

  clearEvents: () => set({ recentEvents: [] }),

  // Metrics actions
  updateMetrics: (metrics) =>
    set({
      metrics,
      lastMetricsUpdate: Date.now(),
      population: metrics.population.total,
    }),

  // Performance actions
  updateFPS: (fps) => set({ fps }),

  updateRenderTime: (ms) => set({ renderTime: ms }),

  // Loading actions
  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  // Utility actions
  reset: () => set(initialState),
}));

// Selectors for computed values
export const useFilteredEvents = () => {
  const { recentEvents, eventFilter } = useSimStore();
  
  if (eventFilter === 'All') {
    return recentEvents;
  }
  
  return recentEvents.filter(event => 
    event.kind.toLowerCase() === eventFilter.toLowerCase()
  );
};

export const usePopulationBySpecies = () => {
  const { metrics } = useSimStore();
  return metrics?.population.bySpecies || {};
};

export const useEntityInView = (entityId: string) => {
  const { entities } = useSimStore();
  return entities.get(entityId);
};