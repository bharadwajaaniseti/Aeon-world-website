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
  EntityDetail,
  NudgeRequest,
  NudgeResult,
  Adoption,
  LoginResponse,
  EntitiesResponse,
  EventsResponse,
  AdoptionResponse,
  SnapshotSummary,
  SnapshotDetail,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE;

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

// HTTP client utility
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    let errorCode = 'HTTP_ERROR';
    
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error.message;
        errorCode = errorData.error.code;
      }
    } catch {
      // Fallback to status text if JSON parsing fails
      errorMessage = response.statusText;
    }
    
    throw new HttpError(response.status, errorMessage, errorCode);
  }

  return response.json();
}

// Token storage utility
class TokenStorage {
  private static readonly TOKEN_KEY = 'aeon_access_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}

// Authenticated request helper
async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = TokenStorage.getToken();
  
  return request<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}

export class HttpApiAdapter implements ApiClient {
  auth: AuthApi = {
    async login(email: string, password: string): Promise<LoginResponse> {
      throw new Error('HTTP adapter not wired yet - login endpoint needs implementation');
      
      // Future implementation:
      // const response = await request<LoginResponse>('/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password }),
      // });
      // 
      // TokenStorage.setToken(response.accessToken);
      // return response;
    },

    async logout(): Promise<void> {
      throw new Error('HTTP adapter not wired yet - logout endpoint needs implementation');
      
      // Future implementation:
      // try {
      //   await authenticatedRequest('/auth/logout', {
      //     method: 'POST',
      //   });
      // } finally {
      //   TokenStorage.clearToken();
      // }
    },

    async getCurrentUser(): Promise<User> {
      throw new Error('HTTP adapter not wired yet - user endpoint needs implementation');
      
      // Future implementation:
      // return authenticatedRequest<User>('/auth/me');
    },
  };

  profiles: ProfileApi = {
    async getProfile(id: string): Promise<UserProfile> {
      throw new Error('HTTP adapter not wired yet - profiles endpoint needs implementation');
      
      // Future implementation:
      // return request<UserProfile>(`/profiles/${id}`);
    },

    async updateProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
      throw new Error('HTTP adapter not wired yet - profile update endpoint needs implementation');
      
      // Future implementation:
      // return authenticatedRequest<UserProfile>(`/profiles/${id}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify(updates),
      // });
    },
  };

  worlds: WorldApi = {
    async getWorlds(params = {}): Promise<WorldSummary[]> {
      throw new Error('HTTP adapter not wired yet - worlds endpoint needs implementation');
      
      // Future implementation:
      // const searchParams = new URLSearchParams();
      // if (params.status) searchParams.set('status', params.status);
      // if (params.limit) searchParams.set('limit', params.limit.toString());
      // 
      // const query = searchParams.toString();
      // return request<WorldSummary[]>(`/worlds${query ? `?${query}` : ''}`);
    },

    async createWorld(data): Promise<WorldSummary> {
      throw new Error('HTTP adapter not wired yet - world creation endpoint needs implementation');
      
      // Future implementation:
      // return authenticatedRequest<WorldSummary>('/worlds', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
    },

    async getWorld(id: string): Promise<WorldDetail> {
      throw new Error('HTTP adapter not wired yet - world detail endpoint needs implementation');
      
      // Future implementation:
      // return request<WorldDetail>(`/worlds/${id}`);
    },

    async getWorldMetrics(id: string): Promise<WorldMetrics> {
      throw new Error('HTTP adapter not wired yet - world metrics endpoint needs implementation');
      
      // Future implementation:
      // return request<WorldMetrics>(`/worlds/${id}/metrics`);
    },
  };

  entities: EntityApi = {
    async getEntities(worldId: string, params = {}): Promise<EntitiesResponse> {
      throw new Error('HTTP adapter not wired yet - entities endpoint needs implementation');
      
      // Future implementation:
      // const searchParams = new URLSearchParams();
      // if (params.bbox) searchParams.set('bbox', params.bbox);
      // if (params.species) searchParams.set('species', params.species);
      // if (params.offset) searchParams.set('offset', params.offset.toString());
      // if (params.limit) searchParams.set('limit', params.limit.toString());
      // 
      // const query = searchParams.toString();
      // return request<EntitiesResponse>(`/worlds/${worldId}/entities${query ? `?${query}` : ''}`);
    },

    async getEntity(worldId: string, entityId: string): Promise<EntityDetail> {
      throw new Error('HTTP adapter not wired yet - entity detail endpoint needs implementation');
      
      // Future implementation:
      // return request<EntityDetail>(`/worlds/${worldId}/entities/${entityId}`);
    },

    async nudgeEntity(worldId: string, entityId: string, request: NudgeRequest): Promise<NudgeResult> {
      throw new Error('HTTP adapter not wired yet - entity nudge endpoint needs implementation');
      
      // Future implementation:
      // return authenticatedRequest<NudgeResult>(`/worlds/${worldId}/entities/${entityId}/nudge`, {
      //   method: 'POST',
      //   body: JSON.stringify(request),
      // });
    },
  };

  events: EventApi = {
    async getEvents(worldId: string, params = {}): Promise<EventsResponse> {
      throw new Error('HTTP adapter not wired yet - events endpoint needs implementation');
      
      // Future implementation:
      // const searchParams = new URLSearchParams();
      // if (params.since) searchParams.set('since', params.since);
      // if (params.kind) searchParams.set('kind', params.kind);
      // if (params.limit) searchParams.set('limit', params.limit.toString());
      // 
      // const query = searchParams.toString();
      // return request<EventsResponse>(`/worlds/${worldId}/events${query ? `?${query}` : ''}`);
    },
  };

  snapshots: SnapshotApi = {
    async getSnapshots(worldId: string, params = {}): Promise<SnapshotSummary[]> {
      throw new Error('HTTP adapter not wired yet - snapshots list endpoint needs implementation');
      
      // Future implementation:
      // const searchParams = new URLSearchParams();
      // if (params.limit) searchParams.set('limit', params.limit.toString());
      // 
      // const query = searchParams.toString();
      // return authenticatedRequest<SnapshotSummary[]>(`/worlds/${worldId}/snapshots${query ? `?${query}` : ''}`);
    },

    async createSnapshot(worldId: string, data): Promise<SnapshotSummary> {
      throw new Error('HTTP adapter not wired yet - snapshot creation endpoint needs implementation');
      
      // Future implementation:
      // return authenticatedRequest<SnapshotSummary>(`/worlds/${worldId}/snapshots`, {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
    },

    async getSnapshot(worldId: string, name: string): Promise<SnapshotDetail> {
      throw new Error('HTTP adapter not wired yet - snapshot detail endpoint needs implementation');
      
      // Future implementation:
      // return authenticatedRequest<SnapshotDetail>(`/worlds/${worldId}/snapshots/${name}`);
    },
  };

  commerce: CommerceApi = {
    async adoptEntity(entityId: string, nickname?: string): Promise<AdoptionResponse> {
      throw new Error('HTTP adapter not wired yet - adoption endpoint needs implementation');
      
      // Future implementation:
      // return authenticatedRequest<AdoptionResponse>('/purchase/adopt', {
      //   method: 'POST',
      //   body: JSON.stringify({ entityId, nickname }),
      // });
    },

    async getMyAdoptions(): Promise<Adoption[]> {
      throw new Error('HTTP adapter not wired yet - adoptions endpoint needs implementation');
      
      // Future implementation:
      // return authenticatedRequest<Adoption[]>('/adoptions/me');
    },
  };
}