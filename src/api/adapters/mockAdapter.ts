import type {
  ApiClient,
  AuthApi,
  ProfileApi,
  WorldApi,
  EntityApi,
  EventApi,
  SnapshotApi,
  CommerceApi,
  User,
  UserProfile,
  WorldSummary,
  WorldDetail,
  WorldMetrics,
  Entity,
  EntityDetail,
  Event,
  SnapshotSummary,
  SnapshotDetail,
  NudgeRequest,
  NudgeResult,
  Adoption,
  LoginResponse,
  EntitiesResponse,
  EventsResponse,
  AdoptionResponse,
} from '../types';

// Mock data store
class MockDataStore {
  users: Map<string, UserProfile> = new Map();
  worlds: Map<string, WorldDetail> = new Map();
  entities: Map<string, Map<string, EntityDetail>> = new Map();
  events: Map<string, Event[]> = new Map();
  snapshots: Map<string, SnapshotDetail[]> = new Map();
  adoptions: Adoption[] = [];
  currentUser: User | null = null;
  accessToken: string | null = null;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock user
    const mockUser: UserProfile = {
      id: 'user-1',
      username: 'aeon_explorer',
      email: 'explorer@aeonworld.example',
      displayName: 'Aeon Explorer',
      bio: 'Fascinated by emergent life simulations',
      createdAt: new Date().toISOString(),
    };
    this.users.set(mockUser.id, mockUser);

    // Mock world
    const mockWorld: WorldDetail = {
      id: 'default-world',
      name: 'Genesis Valley',
      status: 'ACTIVE',
      population: 2847,
      dayCount: 142,
      description: 'A lush valley where life first emerged in AeonWorld',
      seed: 12345,
      timeScale: 1.0,
      settings: {
        maxPopulation: 5000,
        hungerRate: 0.1,
        reproductionRate: 0.05,
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    this.worlds.set(mockWorld.id, mockWorld);

    // Mock entities
    const mockEntities = new Map<string, EntityDetail>();
    for (let i = 0; i < 100; i++) {
      const entity: EntityDetail = {
        id: `entity-${i}`,
        species: ['HERBIVORE', 'PREDATOR', 'TRIBAL'][i % 3] as any,
        position: {
          x: Math.random() * 1000 - 500,
          y: Math.random() * 1000 - 500,
        },
        altitude: Math.random() * 100,
        age: Math.random() * 1000,
        hunger: Math.random(),
        behavior: ['Wandering', 'Foraging', 'Resting', 'Hunting'][Math.floor(Math.random() * 4)],
        health: Math.random() * 0.5 + 0.5,
        experience: Math.floor(Math.random() * 1000),
        traits: ['Curious', 'Aggressive', 'Social', 'Cautious'].filter(() => Math.random() > 0.5),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      mockEntities.set(entity.id, entity);
    }
    this.entities.set('default-world', mockEntities);

    // Mock events
    const mockEvents: Event[] = [];
    for (let i = 0; i < 50; i++) {
      const event: Event = {
        id: `event-${i}`,
        kind: ['BIRTH', 'DEATH', 'DISCOVERY', 'MIGRATION', 'INTERACTION'][Math.floor(Math.random() * 5)] as any,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: this.generateEventDescription(),
        entityId: Math.random() > 0.3 ? `entity-${Math.floor(Math.random() * 100)}` : undefined,
        metadata: {},
      };
      mockEvents.push(event);
    }
    this.events.set('default-world', mockEvents.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }

  private generateEventDescription(): string {
    const descriptions = [
      'A new herbivore was born in the northern meadows',
      'Elder predator passed away peacefully',
      'Tribal group discovered a new water source',
      'Large migration spotted near the eastern cliffs',
      'Unique interaction observed between species',
      'New plant species discovered by foragers',
      'Weather pattern shift affects local population',
      'Territorial dispute resolved without conflict',
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
}

const mockStore = new MockDataStore();

// Simulate network delay
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiAdapter implements ApiClient {
  auth: AuthApi = {
    async login(email: string, password: string): Promise<LoginResponse> {
      await delay();
      
      const user = Array.from(mockStore.users.values()).find(u => u.email === email);
      if (!user || password !== 'password') {
        throw new Error('Invalid credentials');
      }

      mockStore.currentUser = user;
      mockStore.accessToken = 'mock-jwt-token';

      return {
        accessToken: mockStore.accessToken,
        user,
      };
    },

    async logout(): Promise<void> {
      await delay();
      mockStore.currentUser = null;
      mockStore.accessToken = null;
    },

    async getCurrentUser(): Promise<User> {
      await delay();
      if (!mockStore.currentUser) {
        throw new Error('Not authenticated');
      }
      return mockStore.currentUser;
    },
  };

  profiles: ProfileApi = {
    async getProfile(id: string): Promise<UserProfile> {
      await delay();
      const profile = mockStore.users.get(id);
      if (!profile) {
        throw new Error('Profile not found');
      }
      return profile;
    },

    async updateProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
      await delay();
      const profile = mockStore.users.get(id);
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      const updated = { ...profile, ...updates };
      mockStore.users.set(id, updated);
      return updated;
    },
  };

  worlds: WorldApi = {
    async getWorlds(params = {}): Promise<WorldSummary[]> {
      await delay();
      const worlds = Array.from(mockStore.worlds.values());
      return worlds.filter(world => !params.status || world.status === params.status)
        .slice(0, params.limit || 20);
    },

    async createWorld(data): Promise<WorldSummary> {
      await delay();
      const world: WorldDetail = {
        id: `world-${Date.now()}`,
        name: data.name,
        status: 'ACTIVE',
        population: 0,
        dayCount: 0,
        description: data.description,
        seed: data.seed || Math.floor(Math.random() * 1000000),
        timeScale: 1.0,
        settings: {
          maxPopulation: 5000,
          hungerRate: 0.1,
          reproductionRate: 0.05,
        },
        createdAt: new Date().toISOString(),
      };
      mockStore.worlds.set(world.id, world);
      return world;
    },

    async getWorld(id: string): Promise<WorldDetail> {
      await delay();
      const world = mockStore.worlds.get(id);
      if (!world) {
        throw new Error('World not found');
      }
      return world;
    },

    async getWorldMetrics(id: string): Promise<WorldMetrics> {
      await delay();
      const world = mockStore.worlds.get(id);
      if (!world) {
        throw new Error('World not found');
      }

      const entities = mockStore.entities.get(id) || new Map();
      const speciesCounts: Record<string, number> = {};
      
      entities.forEach(entity => {
        speciesCounts[entity.species] = (speciesCounts[entity.species] || 0) + 1;
      });

      return {
        timestamp: new Date().toISOString(),
        population: {
          total: entities.size,
          bySpecies: speciesCounts,
        },
        births: Math.floor(Math.random() * 10),
        deaths: Math.floor(Math.random() * 5),
        discoveries: Math.floor(Math.random() * 3),
      };
    },
  };

  entities: EntityApi = {
    async getEntities(worldId: string, params = {}): Promise<EntitiesResponse> {
      await delay();
      const worldEntities = mockStore.entities.get(worldId);
      if (!worldEntities) {
        return { entities: [], total: 0, hasMore: false };
      }

      let entities = Array.from(worldEntities.values());

      // Apply filters
      if (params.species) {
        entities = entities.filter(e => e.species === params.species);
      }

      if (params.bbox) {
        const [minX, minY, maxX, maxY] = params.bbox.split(',').map(Number);
        entities = entities.filter(e => 
          e.position.x >= minX && e.position.x <= maxX &&
          e.position.y >= minY && e.position.y <= maxY
        );
      }

      // Apply pagination
      const offset = params.offset || 0;
      const limit = params.limit || 100;
      const paginatedEntities = entities.slice(offset, offset + limit);

      return {
        entities: paginatedEntities,
        total: entities.length,
        hasMore: offset + limit < entities.length,
      };
    },

    async getEntity(worldId: string, entityId: string): Promise<EntityDetail> {
      await delay();
      const worldEntities = mockStore.entities.get(worldId);
      const entity = worldEntities?.get(entityId);
      if (!entity) {
        throw new Error('Entity not found');
      }
      return entity;
    },

    async nudgeEntity(worldId: string, entityId: string, request: NudgeRequest): Promise<NudgeResult> {
      await delay();
      const outcomes = ['SUCCESS', 'FAILED', 'IGNORED'] as const;
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      
      const messages = {
        SUCCESS: `Entity responded well to ${request.action.toLowerCase()}`,
        FAILED: `Entity resisted the ${request.action.toLowerCase()} attempt`,
        IGNORED: `Entity was too busy to notice the ${request.action.toLowerCase()}`,
      };

      return {
        outcome,
        message: messages[outcome],
        effects: outcome === 'SUCCESS' ? [`${request.action} effect applied`] : [],
      };
    },
  };

  events: EventApi = {
    async getEvents(worldId: string, params = {}): Promise<EventsResponse> {
      await delay();
      const worldEvents = mockStore.events.get(worldId) || [];
      
      let events = [...worldEvents];
      
      if (params.kind) {
        events = events.filter(e => e.kind === params.kind);
      }

      const limit = params.limit || 50;
      const limitedEvents = events.slice(0, limit);

      return {
        events: limitedEvents,
        nextCursor: events.length > limit ? `cursor-${Date.now()}` : null,
      };
    },
  };

  snapshots: SnapshotApi = {
    async getSnapshots(worldId: string): Promise<SnapshotSummary[]> {
      await delay();
      const snapshots = mockStore.snapshots.get(worldId) || [];
      return snapshots.map(snapshot => ({
        name: snapshot.name,
        timestamp: snapshot.timestamp,
        population: snapshot.population,
        size: snapshot.size,
      }));
    },

    async createSnapshot(worldId: string, data): Promise<SnapshotSummary> {
      await delay();
      const world = mockStore.worlds.get(worldId);
      if (!world) {
        throw new Error('World not found');
      }

      const snapshot: SnapshotDetail = {
        name: data.name,
        timestamp: new Date().toISOString(),
        population: world.population,
        size: Math.floor(Math.random() * 1000000) + 100000,
        description: data.description,
        worldState: { compressed: 'mock-state-data' },
      };

      const worldSnapshots = mockStore.snapshots.get(worldId) || [];
      worldSnapshots.push(snapshot);
      mockStore.snapshots.set(worldId, worldSnapshots);

      return {
        name: snapshot.name,
        timestamp: snapshot.timestamp,
        population: snapshot.population,
        size: snapshot.size,
      };
    },

    async getSnapshot(worldId: string, name: string): Promise<SnapshotDetail> {
      await delay();
      const snapshots = mockStore.snapshots.get(worldId) || [];
      const snapshot = snapshots.find(s => s.name === name);
      if (!snapshot) {
        throw new Error('Snapshot not found');
      }
      return snapshot;
    },
  };

  commerce: CommerceApi = {
    async adoptEntity(entityId: string, nickname?: string): Promise<AdoptionResponse> {
      await delay();
      const adoptionId = `adoption-${Date.now()}`;
      
      const adoption: Adoption = {
        id: adoptionId,
        entityId,
        userId: mockStore.currentUser?.id || 'anonymous',
        adoptedAt: new Date().toISOString(),
        status: 'ACTIVE',
        nickname,
      };

      mockStore.adoptions.push(adoption);

      return {
        adoptionId,
        entityId,
      };
    },

    async getMyAdoptions(): Promise<Adoption[]> {
      await delay();
      const userId = mockStore.currentUser?.id;
      if (!userId) {
        return [];
      }
      return mockStore.adoptions.filter(a => a.userId === userId);
    },
  };
}