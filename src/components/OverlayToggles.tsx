import React from 'react';
import { useUIStore } from '../state/useUIStore';
import { Layers, Users, TreePine, Mountain } from 'lucide-react';

export const OverlayToggles: React.FC = () => {
  const {
    biomesOverlay,
    populationOverlay,
    resourcesOverlay,
    toggleBiomesOverlay,
    togglePopulationOverlay,
    toggleResourcesOverlay,
  } = useUIStore();

  const toggles = [
    {
      icon: TreePine,
      label: 'Biomes',
      active: biomesOverlay,
      onClick: toggleBiomesOverlay,
      color: 'text-green-400',
    },
    {
      icon: Users,
      label: 'Population',
      active: populationOverlay,
      onClick: togglePopulationOverlay,
      color: 'text-blue-400',
    },
    {
      icon: Mountain,
      label: 'Resources',
      active: resourcesOverlay,
      onClick: toggleResourcesOverlay,
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="space-y-2">
      {toggles.map(({ icon: Icon, label, active, onClick, color }) => (
        <button
          key={label}
          onClick={onClick}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
            active
              ? 'bg-white/20 border border-white/30'
              : 'bg-white/10 hover:bg-white/15 border border-transparent'
          }`}
        >
          <Icon className={`w-5 h-5 ${active ? color : 'text-white/60'}`} />
          <span className={`text-sm font-medium ${active ? 'text-white' : 'text-white/80'}`}>
            {label}
          </span>
          <div className="flex-1" />
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              active ? color.replace('text-', 'bg-') : 'bg-white/30'
            }`}
          />
        </button>
      ))}
    </div>
  );
};