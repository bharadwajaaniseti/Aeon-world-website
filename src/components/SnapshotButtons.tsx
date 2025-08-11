import React, { useState } from 'react';
import { Save, Download, Upload, Clock } from 'lucide-react';
import { useUIStore } from '../state/useUIStore';
import { idbStorage } from '../utils/idb';
import { useSimStore } from '../state/useSimStore';

export const SnapshotButtons: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [savedSnapshots, setSavedSnapshots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { worldSeed } = useUIStore();
  const { entities, dayCount } = useSimStore();

  React.useEffect(() => {
    loadSnapshots();
  }, []);

  const loadSnapshots = async () => {
    try {
      const snapshots = await idbStorage.listSnapshots();
      setSavedSnapshots(snapshots);
    } catch (error) {
      console.error('Failed to load snapshots:', error);
    }
  };

  const saveSnapshot = async () => {
    setIsLoading(true);
    try {
      const timestamp = new Date().toISOString();
      const snapshotName = `snapshot_${Date.now()}`;
      
      const snapshot = {
        name: snapshotName,
        timestamp,
        seed: worldSeed,
        worldState: {
          entities: Array.from(entities.values()),
          settings: { seed: worldSeed },
          dayCount,
          population: entities.size,
        },
        description: `World at Day ${dayCount} with ${entities.size} entities`,
      };

      await idbStorage.saveSnapshot(snapshot);
      await loadSnapshots();
      
      console.log('Snapshot saved:', snapshotName);
    } catch (error) {
      console.error('Failed to save snapshot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSnapshot = async (snapshotName: string) => {
    setIsLoading(true);
    try {
      const snapshot = await idbStorage.loadSnapshot(snapshotName);
      if (snapshot) {
        // In a real implementation, this would restore the world state
        console.log('Loading snapshot:', snapshot.name);
        // Reset world with snapshot data
        useSimStore.getState().reset();
        useUIStore.getState().setWorldSeed(snapshot.seed);
      }
    } catch (error) {
      console.error('Failed to load snapshot:', error);
    } finally {
      setIsLoading(false);
      setIsMenuOpen(false);
    }
  };

  const deleteSnapshot = async (snapshotName: string) => {
    try {
      await idbStorage.deleteSnapshot(snapshotName);
      await loadSnapshots();
      console.log('Snapshot deleted:', snapshotName);
    } catch (error) {
      console.error('Failed to delete snapshot:', error);
    }
  };

  return (
    <div className="relative">
      {/* Save Button */}
      <div className="flex space-x-2">
        <button
          onClick={saveSnapshot}
          disabled={isLoading}
          className="glass-panel p-3 rounded-xl text-white hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center space-x-2"
          title="Save snapshot"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="glass-panel p-3 rounded-xl text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
          title="Load snapshot"
        >
          <Upload className="w-5 h-5" />
        </button>
      </div>

      {/* Snapshot Menu */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 glass-panel rounded-xl p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Saved Snapshots</h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {savedSnapshots.length === 0 ? (
              <div className="text-white/60 text-sm text-center py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No snapshots saved yet
              </div>
            ) : (
              savedSnapshots.map((snapshot) => (
                <div
                  key={snapshot.name}
                  className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">
                      Day {snapshot.worldState.dayCount}
                    </span>
                    <span className="text-white/60 text-xs">
                      {new Date(snapshot.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-white/80 text-xs mb-3">
                    Population: {snapshot.worldState.population.toLocaleString()}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => loadSnapshot(snapshot.name)}
                      className="flex-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteSnapshot(snapshot.name)}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};