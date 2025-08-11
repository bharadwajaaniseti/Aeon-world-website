import React, { useState } from 'react';
import { X, Heart, User, Star } from 'lucide-react';
import { useUIStore } from '../state/useUIStore';
import { useSimStore } from '../state/useSimStore';

export const AdoptModal: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { adoptedEntityId, closeAdoptModal } = useUIStore();
  const { selectedEntity } = useSimStore();

  const handleAdopt = async () => {
    if (!selectedEntity) return;

    setIsSubmitting(true);
    
    try {
      // Simulate adoption process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would call the API
      console.log(`Adopted entity ${selectedEntity.id} with nickname "${nickname}"`);
      
      closeAdoptModal();
      setNickname('');
    } catch (error) {
      console.error('Adoption failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSpeciesName = (species: string) => {
    switch (species) {
      case 'HERBIVORE':
        return 'Peaceful Grazer';
      case 'PREDATOR':
        return 'Apex Hunter';
      case 'TRIBAL':
        return 'Wise Builder';
      default:
        return 'Unknown Being';
    }
  };

  if (!selectedEntity) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Adopt This Life</h2>
              <p className="text-white/60 text-sm">Follow this entity's journey</p>
            </div>
          </div>
          <button
            onClick={closeAdoptModal}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Entity Preview */}
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">{getSpeciesName(selectedEntity.species)}</h3>
              <p className="text-white/60 text-sm">
                Age: {Math.round(selectedEntity.age)} • 
                Health: {Math.round((selectedEntity.health || 1) * 100)}%
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                  {selectedEntity.species}
                </span>
                <span className="text-xs text-white/60 font-mono">
                  #{selectedEntity.id.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nickname Input */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Give your companion a name:
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter a nickname..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            maxLength={20}
          />
          <p className="text-white/60 text-xs mt-2">
            You'll receive notifications about this entity's major life events
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-6">
          <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>Adoption Benefits</span>
          </h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Track life events and milestones</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
              <span>Gentle influence on behavior</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
              <span>Access to detailed genealogy</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={closeAdoptModal}
            className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-medium transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={handleAdopt}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Adopting...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" />
                <span>Adopt Life</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};