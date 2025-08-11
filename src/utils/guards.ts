// Type guards and validation utilities
export function isValidCoordinate(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value);
}

export function isValidPosition(pos: unknown): pos is { x: number; y: number } {
  return (
    typeof pos === 'object' &&
    pos !== null &&
    'x' in pos &&
    'y' in pos &&
    isValidCoordinate((pos as any).x) &&
    isValidCoordinate((pos as any).y)
  );
}

export function isValidEntity(entity: unknown): entity is {
  id: string;
  position: { x: number; y: number };
  species: string;
} {
  return (
    typeof entity === 'object' &&
    entity !== null &&
    'id' in entity &&
    'position' in entity &&
    'species' in entity &&
    typeof (entity as any).id === 'string' &&
    isValidPosition((entity as any).position) &&
    typeof (entity as any).species === 'string'
  );
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitMs);
  };
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limitMs);
    }
  };
}

// Check if a value is within a bounding box
export function isInBounds(
  point: { x: number; y: number },
  bounds: { minX: number; minY: number; maxX: number; maxY: number }
): boolean {
  return (
    point.x >= bounds.minX &&
    point.x <= bounds.maxX &&
    point.y >= bounds.minY &&
    point.y <= bounds.maxY
  );
}

// Generate a UUID v4
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Safe array access
export function safeArrayAccess<T>(array: T[], index: number): T | undefined {
  return index >= 0 && index < array.length ? array[index] : undefined;
}

// Deep clone object (simple implementation)
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}