import { z } from 'zod';

// Base schemas
export const SpeciesSchema = z.enum(['HERBIVORE', 'PREDATOR', 'TRIBAL']);
export type Species = z.infer<typeof SpeciesSchema>;

export const EventKindSchema = z.enum(['BIRTH', 'DEATH', 'DISCOVERY', 'MIGRATION', 'INTERACTION']);
export type EventKind = z.infer<typeof EventKindSchema>;

export const WorldStatusSchema = z.enum(['ACTIVE', 'PAUSED', 'ARCHIVED']);
export type WorldStatus = z.infer<typeof WorldStatusSchema>;

// User schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

export const UserProfileSchema = UserSchema.extend({
  displayName: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

// World schemas
export const WorldSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  status: WorldStatusSchema,
  population: z.number().int().min(0),
  dayCount: z.number().int().min(0),
  createdAt: z.string().datetime(),
});
export type WorldSummary = z.infer<typeof WorldSummarySchema>;

export const WorldDetailSchema = WorldSummarySchema.extend({
  description: z.string().optional(),
  seed: z.number().int(),
  timeScale: z.number().min(0.1).max(10.0),
  settings: z.object({
    maxPopulation: z.number().int(),
    hungerRate: z.number(),
    reproductionRate: z.number(),
  }),
});
export type WorldDetail = z.infer<typeof WorldDetailSchema>;

export const WorldMetricsSchema = z.object({
  timestamp: z.string().datetime(),
  population: z.object({
    total: z.number().int(),
    bySpecies: z.record(z.number().int()),
  }),
  births: z.number().int(),
  deaths: z.number().int(),
  discoveries: z.number().int(),
});
export type WorldMetrics = z.infer<typeof WorldMetricsSchema>;

// Entity schemas
export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});
export type Position = z.infer<typeof PositionSchema>;

export const EntitySchema = z.object({
  id: z.string().uuid(),
  species: SpeciesSchema,
  position: PositionSchema,
  altitude: z.number().optional(),
  age: z.number().min(0),
  hunger: z.number().min(0).max(1),
  villageId: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
});
export type Entity = z.infer<typeof EntitySchema>;

export const EntityDetailSchema = EntitySchema.extend({
  behavior: z.string().optional(),
  health: z.number().min(0).max(1).optional(),
  experience: z.number().int().optional(),
  traits: z.array(z.string()).optional(),
});
export type EntityDetail = z.infer<typeof EntityDetailSchema>;

// Event schemas
export const EventSchema = z.object({
  id: z.string().uuid(),
  kind: EventKindSchema,
  timestamp: z.string().datetime(),
  description: z.string(),
  entityId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});
export type Event = z.infer<typeof EventSchema>;

// Snapshot schemas
export const SnapshotSummarySchema = z.object({
  name: z.string(),
  timestamp: z.string().datetime(),
  population: z.number().int(),
  size: z.number().int(),
});
export type SnapshotSummary = z.infer<typeof SnapshotSummarySchema>;

export const SnapshotDetailSchema = SnapshotSummarySchema.extend({
  description: z.string().optional(),
  worldState: z.record(z.any()),
});
export type SnapshotDetail = z.infer<typeof SnapshotDetailSchema>;

// Action schemas
export const NudgeActionSchema = z.enum(['FEED', 'RELOCATE', 'INSPIRE']);
export type NudgeAction = z.infer<typeof NudgeActionSchema>;

export const NudgeRequestSchema = z.object({
  action: NudgeActionSchema,
  parameters: z.record(z.any()).optional(),
});
export type NudgeRequest = z.infer<typeof NudgeRequestSchema>;

export const NudgeOutcomeSchema = z.enum(['SUCCESS', 'FAILED', 'IGNORED']);
export type NudgeOutcome = z.infer<typeof NudgeOutcomeSchema>;

export const NudgeResultSchema = z.object({
  outcome: NudgeOutcomeSchema,
  message: z.string(),
  effects: z.array(z.string()).optional(),
});
export type NudgeResult = z.infer<typeof NudgeResultSchema>;

// Adoption schemas
export const AdoptionStatusSchema = z.enum(['ACTIVE', 'RELEASED', 'DECEASED']);
export type AdoptionStatus = z.infer<typeof AdoptionStatusSchema>;

export const AdoptionSchema = z.object({
  id: z.string().uuid(),
  entityId: z.string().uuid(),
  userId: z.string().uuid(),
  adoptedAt: z.string().datetime(),
  status: AdoptionStatusSchema,
  nickname: z.string().optional(),
});
export type Adoption = z.infer<typeof AdoptionSchema>;

// API Response schemas
export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const EntitiesResponseSchema = z.object({
  entities: z.array(EntitySchema),
  total: z.number().int(),
  hasMore: z.boolean(),
});
export type EntitiesResponse = z.infer<typeof EntitiesResponseSchema>;

export const EventsResponseSchema = z.object({
  events: z.array(EventSchema),
  nextCursor: z.string().nullable(),
});
export type EventsResponse = z.infer<typeof EventsResponseSchema>;

export const AdoptionResponseSchema = z.object({
  adoptionId: z.string().uuid(),
  entityId: z.string().uuid(),
});
export type AdoptionResponse = z.infer<typeof AdoptionResponseSchema>;

// Error schemas
export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;