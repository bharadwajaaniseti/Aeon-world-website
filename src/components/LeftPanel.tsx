import React from 'react';
import { OverlayToggles } from './OverlayToggles';
import { Layers, TrendingUp, MapPin, Settings } from 'lucide-react';

export const LeftPanel: React.FC = () => {
  return (
    <div className="h-full bg-black/20 backdrop-blur-md border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-white font-semibold flex items-center space-x-2">
          <Layers className="w-5 h-5" />
          <span>World Controls</span>
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Overlay Controls */}
        <section>
          <h3 className="text-white/80 font-medium mb-3 text-sm uppercase tracking-wide">
            Visual Overlays
          </h3>
          <OverlayToggles />
        </section>

        {/* World Statistics */}
        <section>
          <h3 className="text-white/80 font-medium mb-3 text-sm uppercase tracking-wide flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Statistics</span>
          </h3>
          <div className="space-y-3">
            <div className="glass-panel p-3 rounded-lg">
              <div className="text-xs text-white/60 mb-1">Biome Distribution</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span className="text-white text-sm">Grassland</span>
                  </div>
                  <span className="text-white/80 text-sm">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-600 rounded-sm"></div>
                    <span className="text-white text-sm">Forest</span>
                  </div>
                  <span className="text-white/80 text-sm">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                    <span className="text-white text-sm">Water</span>
                  </div>
                  <span className="text-white/80 text-sm">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-600 rounded-sm"></div>
                    <span className="text-white text-sm">Desert</span>
                  </div>
                  <span className="text-white/80 text-sm">10%</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-3 rounded-lg">
              <div className="text-xs text-white/60 mb-2">Population Trends</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white text-sm">Birth Rate</span>
                  <span className="text-green-400 text-sm">+12/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-sm">Death Rate</span>
                  <span className="text-red-400 text-sm">-8/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-sm">Growth</span>
                  <span className="text-emerald-400 text-sm">+4/hour</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* World Settings */}
        <section>
          <h3 className="text-white/80 font-medium mb-3 text-sm uppercase tracking-wide flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Weather Effects</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Day/Night Cycle</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Entity Labels</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};