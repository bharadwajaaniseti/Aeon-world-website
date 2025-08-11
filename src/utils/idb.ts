import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface AeonWorldDB extends DBSchema {
  snapshots: {
    key: string;
    value: {
      name: string;
      timestamp: string;
      seed: number;
      worldState: {
        entities: any[];
        settings: any;
        dayCount: number;
        population: number;
      };
      description?: string;
    };
  };
  settings: {
    key: string;
    value: any;
  };
}

let db: IDBPDatabase<AeonWorldDB> | null = null;

async function getDB(): Promise<IDBPDatabase<AeonWorldDB>> {
  if (!db) {
    db = await openDB<AeonWorldDB>('AeonWorldDB', 1, {
      upgrade(database) {
        // Create snapshots store
        database.createObjectStore('snapshots', { keyPath: 'name' });
        
        // Create settings store
        database.createObjectStore('settings');
      },
    });
  }
  return db;
}

export interface Snapshot {
  name: string;
  timestamp: string;
  seed: number;
  worldState: {
    entities: any[];
    settings: any;
    dayCount: number;
    population: number;
  };
  description?: string;
}

export const idbStorage = {
  // Snapshot management
  async saveSnapshot(snapshot: Snapshot): Promise<void> {
    const database = await getDB();
    await database.put('snapshots', snapshot);
  },

  async loadSnapshot(name: string): Promise<Snapshot | null> {
    const database = await getDB();
    const snapshot = await database.get('snapshots', name);
    return snapshot || null;
  },

  async listSnapshots(): Promise<Snapshot[]> {
    const database = await getDB();
    return database.getAll('snapshots');
  },

  async deleteSnapshot(name: string): Promise<void> {
    const database = await getDB();
    await database.delete('snapshots', name);
  },

  // Settings management
  async saveSetting(key: string, value: any): Promise<void> {
    const database = await getDB();
    await database.put('settings', value, key);
  },

  async loadSetting(key: string): Promise<any> {
    const database = await getDB();
    return database.get('settings', key);
  },

  async deleteSetting(key: string): Promise<void> {
    const database = await getDB();
    await database.delete('settings', key);
  },

  // Clear all data
  async clearAll(): Promise<void> {
    const database = await getDB();
    await database.clear('snapshots');
    await database.clear('settings');
  },
};

// Helper function to estimate snapshot size
export function estimateSnapshotSize(snapshot: Snapshot): number {
  try {
    return new Blob([JSON.stringify(snapshot)]).size;
  } catch {
    return 0;
  }
}