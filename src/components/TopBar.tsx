import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Save, 
  Menu, 
  Gauge,
  Calendar
} from 'lucide-react';
import { useUIStore } from '../state/useUIStore';
import { useSimStore } from '../state/useSimStore';
import { simTime } from '../utils/time';

export const TopBar: React.FC = () => {
  const [seedInput, setSeedInput] = useState('12345');
  
  const {
    isPaused,
    simulationSpeed,
    worldSeed,
    showFPS,
    isMobileView,
    togglePause,
    setSimulationSpeed,
    setWorldSeed,
    setShowFPS,
    toggleMobileDrawer,
    openSnapshotModal,
  } = useUIStore();

  const { fps, dayCount, population } = useSimStore();

  const handleSeedChange = (newSeed: string) => {
    setSeedInput(newSeed);
    const numericSeed = parseInt(newSeed) || 12345;
    setWorldSeed(numericSeed);
  };

  const resetSimulation = () => {
    // Reset the simulation world
    useSimStore.getState().reset();
    simTime.reset();
  };

  const speedOptions = [
    { value: 0.25, label: '0.25×' },
    { value: 0.5, label: '0.5×' },
    { value: 1, label: '1×' },
    { value: 2, label: '2×' },
    { value: 4, label: '4×' },
  ];

  return (
    <div className="h-16 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        {isMobileView && (
          <button
            onClick={toggleMobileDrawer}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-white font-semibold hidden sm:block">AeonWorld</span>
        </div>

        {/* World Time */}
        <div className="flex items-center space-x-2 text-white/80">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-mono">
            {simTime.getDisplayTime()}
          </span>
        </div>
      </div>

      {/* Center Section - Controls */}
      <div className="flex items-center space-x-4">
        {/* Play/Pause */}
        <button
          onClick={togglePause}
          className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
          aria-label={isPaused ? 'Play simulation' : 'Pause simulation'}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>

        {/* Speed Control */}
        <select
          value={simulationSpeed}
          onChange={(e) => setSimulationSpeed(Number(e.target.value))}
          className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {speedOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-800">
              {option.label}
            </option>
          ))}
        </select>

        {/* Reset Button */}
        <button
          onClick={resetSimulation}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Reset simulation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Stats */}
        <div className="flex items-center space-x-4 text-white/80 text-sm hidden md:flex">
          <div className="flex items-center space-x-1">
            <span>Population:</span>
            <span className="font-mono text-emerald-400">{population.toLocaleString()}</span>
          </div>
          
          {showFPS && (
            <div className="flex items-center space-x-1">
              <Gauge className="w-3 h-3" />
              <span className="font-mono text-sky-400">{fps} FPS</span>
            </div>
          )}
        </div>

        {/* Seed Input */}
        <div className="flex items-center space-x-2">
          <label className="text-white/60 text-sm hidden sm:block">Seed:</label>
          <input
            type="text"
            value={seedInput}
            onChange={(e) => handleSeedChange(e.target.value)}
            className="w-20 px-2 py-1 bg-white/10 text-white border border-white/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            placeholder="12345"
          />
        </div>

        {/* Snapshot Button */}
        <button
          onClick={openSnapshotModal}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Save snapshot"
        >
          <Save className="w-4 h-4" />
        </button>

        {/* Settings */}
        <div className="relative">
          <button
            onClick={() => setShowFPS(!showFPS)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Toggle settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Badge */}
        <div className="hidden sm:flex items-center">
          <span className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full text-xs font-medium">
            Mock Mode
          </span>
        </div>
      </div>
    </div>
  );
};