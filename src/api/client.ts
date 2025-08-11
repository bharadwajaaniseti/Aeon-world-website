import { MockApiAdapter } from './adapters/mockAdapter';
import { HttpApiAdapter } from './adapters/httpAdapter';
import type {
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
} from './types';

export interface AuthApi {
  login(email: string, password: string): Promise<LoginResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User>;
}

export interface ProfileApi {
  getProfile(id: string): Promise<UserProfile>;
  updateProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile>;
}

export interface WorldApi {
  getWorlds(params?: { status?: string; limit?: number }): Promise<WorldSummary[]>;
  createWorld(data: { name: string; description?: string; seed?: number }): Promise<WorldSummary>;
  getWorld(id: string): Promise<WorldDetail>;
  getWorldMetrics(id: string): Promise<WorldMetrics>;
}

export interface EntityApi {
  getEntities(
    worldId: string,
    params?: {
      bbox?: string;
      species?: string;
      offset?: number;
      limit?: number;
    }
  ): Promise<EntitiesResponse>;
  getEntity(worldId: string, entityId: string): Promise<EntityDetail>;
  nudgeEntity(worldId: string, entityId: string, request: NudgeRequest): Promise<NudgeResult>;
}

export interface EventApi {
  getEvents(
    worldId: string,
    params?: {
      since?: string;
      kind?: string;
      limit?: number;
    }
  ): Promise<EventsResponse>;
}

export interface SnapshotApi {
  getSnapshots(worldId: string, params?: { limit?: number }): Promise<SnapshotSummary[]>;
  createSnapshot(worldId: string, data: { name: string; description?: string }): Promise<SnapshotSummary>;
  getSnapshot(worldId: string, name: string): Promise<SnapshotDetail>;
}

export interface CommerceApi {
  adoptEntity(entityId: string, nickname?: string): Promise<AdoptionResponse>;
  getMyAdoptions(): Promise<Adoption[]>;
}

export interface ApiClient {
  auth: AuthApi;
  profiles: ProfileApi;
  worlds: WorldApi;
  entities: EntityApi;
  events: EventApi;
  snapshots: SnapshotApi;
  commerce: CommerceApi;
}

// Adapter selection based on environment
function createApiClient(): ApiClient {
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
  
  if (useMocks) {
    console.log('🔄 Using Mock API Adapter');
    return new MockApiAdapter();
  } else {
    console.log('🌐 Using HTTP API Adapter');
    return new HttpApiAdapter();
  }
}

// Export singleton API client
export const api = createApiClient();

// Export adapter classes for testing
export { MockApiAdapter, HttpApiAdapter };