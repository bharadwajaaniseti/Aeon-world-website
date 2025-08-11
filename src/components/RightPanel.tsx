import React from 'react';
import { useSimStore } from '../state/useSimStore';
import { useUIStore } from '../state/useUIStore';
import { 
  User, 
  Heart, 
  Zap, 
  Clock, 
  MapPin, 
  Activity,
  Award,
  Star
} from 'lucide-react';

export const RightPanel: React.FC = () => {
  const { selectedEntity } = useSimStore();
  const { setAdoptedEntity, openAdoptModal } = useUIStore();

  const handleAdoptEntity = () => {
    if (selectedEntity) {
      setAdoptedEntity(selectedEntity.id);
      openAdoptModal();
    }
  };

  if (!selectedEntity) {
    return (
      <div className="h-full bg-black/20 backdrop-blur-md border-l border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-white font-semibold flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Entity Inspector</span>
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white/60 text-sm">
              Click on any entity in the world to inspect its details
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getSpeciesColor = (species: string) => {
    switch (species) {
      case 'HERBIVORE':
        return 'text-green-400 bg-green-500/20';
      case 'PREDATOR':
        return 'text-red-400 bg-red-500/20';
      case 'TRIBAL':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getHealthColor = (health: number) => {
    if (health > 0.7) return 'text-green-400';
    if (health > 0.4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBehaviorIcon = (behavior: string) => {
    switch (behavior?.toLowerCase()) {
      case 'hunting':
        return '🏹';
      case 'foraging':
        return '🌿';
      case 'wandering':
        return '🚶';
      case 'resting':
        return '😴';
      case 'socializing':
        return '👥';
      case 'building':
        return '🏗️';
      default:
        return '❓';
    }
  };

  return (
    <div className="h-full bg-black/20 backdrop-blur-md border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-white font-semibold flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Entity Inspector</span>
        </h2>
      </div>

      {/* Entity Details */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Species Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSpeciesColor(selectedEntity.species)}`}>
            {selectedEntity.species}
          </span>
          <span className="text-white/60 text-xs font-mono">
            #{selectedEntity.id.slice(0, 8)}
          </span>
        </div>

        {/* Core Stats */}
        <div className="glass-panel p-3 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-white text-sm">Health</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${getHealthColor(selectedEntity.health || 1)}`}
                  style={{ 
                    width: `${((selectedEntity.health || 1) * 100)}%`,
                    backgroundColor: selectedEntity.health && selectedEntity.health > 0.7 ? '#10b981' : 
                                   selectedEntity.health && selectedEntity.health > 0.4 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
              <span className={`text-sm ${getHealthColor(selectedEntity.health || 1)}`}>
                {Math.round((selectedEntity.health || 1) * 100)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm">Hunger</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all"
                  style={{ width: `${(selectedEntity.hunger * 100)}%` }}
                />
              </div>
              <span className="text-orange-400 text-sm">
                {Math.round(selectedEntity.hunger * 100)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm">Age</span>
            </div>
            <span className="text-blue-400 text-sm">
              {Math.round(selectedEntity.age)} ticks
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="text-white text-sm font-medium">Location</span>
          </div>
          <div className="text-white/80 text-sm space-y-1">
            <div>X: {Math.round(selectedEntity.position.x)}</div>
            <div>Y: {Math.round(selectedEntity.position.y)}</div>
            {selectedEntity.altitude !== undefined && (
              <div>Altitude: {Math.round(selectedEntity.altitude)}m</div>
            )}
          </div>
        </div>

        {/* Behavior */}
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-white text-sm font-medium">Behavior</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getBehaviorIcon(selectedEntity.behavior || '')}</span>
            <div>
              <div className="text-white text-sm">{selectedEntity.behavior || 'Unknown'}</div>
              <div className="text-white/60 text-xs">Current activity</div>
            </div>
          </div>
        </div>

        {/* Traits */}
        {selectedEntity.traits && selectedEntity.traits.length > 0 && (
          <div className="glass-panel p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-medium">Traits</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedEntity.traits.map((trait, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/10 text-white/80 rounded text-xs"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {selectedEntity.experience !== undefined && (
          <div className="glass-panel p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-white text-sm">Experience</span>
              </div>
              <span className="text-amber-400 text-sm">
                {selectedEntity.experience.toLocaleString()} XP
              </span>
            </div>
          </div>
        )}

        {/* Adoption Button */}
        <div className="pt-4">
          <button
            onClick={handleAdoptEntity}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <Heart className="w-5 h-5" />
            <span>Adopt This Life</span>
          </button>
          <p className="text-white/60 text-xs text-center mt-2">
            Follow this entity's journey and receive updates
          </p>
        </div>
      </div>
    </div>
  );
};