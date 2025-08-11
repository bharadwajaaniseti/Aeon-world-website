import React, { useEffect, useState } from 'react';
import { BabylonCanvas } from '../sim/rendering/BabylonCanvas';
import { TopBar } from '../components/TopBar';
import { LeftPanel } from '../components/LeftPanel';
import { RightPanel } from '../components/RightPanel';
import { BottomTicker } from '../components/BottomTicker';
import { MiniMap } from '../components/MiniMap';
import { AdoptModal } from '../components/AdoptModal';
import { SnapshotButtons } from '../components/SnapshotButtons';
import { Loader } from '../components/Loader';
import { useUIStore } from '../state/useUIStore';
import { useSimStore } from '../state/useSimStore';
import { useSimulation } from '../hooks/useSimulation';

export const Sim: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    leftPanelOpen, 
    rightPanelOpen, 
    bottomTickerOpen, 
    isMobileView, 
    mobileDrawerOpen,
    adoptModalOpen 
  } = useUIStore();
  const { error } = useSimStore();
  
  // Initialize simulation
  useSimulation();

  useEffect(() => {
    // Check if mobile view
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      useUIStore.getState().setMobileView(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 2000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <div className="text-red-600 text-xl font-semibold mb-4">Simulation Error</div>
          <div className="text-red-500 mb-6">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Restart Simulation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Panel */}
        {!isMobileView && leftPanelOpen && (
          <div className="w-80 flex-shrink-0">
            <LeftPanel />
          </div>
        )}

        {/* Central 3D Canvas */}
        <div className="flex-1 relative">
          <BabylonCanvas className="w-full h-full" />
          
          {/* MiniMap Overlay */}
          <div className="absolute top-4 left-4">
            <MiniMap />
          </div>

          {/* Snapshot Controls Overlay */}
          <div className="absolute top-4 right-4">
            <SnapshotButtons />
          </div>

          {/* Mobile Drawer Backdrop */}
          {isMobileView && mobileDrawerOpen && (
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10"
              onClick={() => useUIStore.getState().toggleMobileDrawer()}
            />
          )}
        </div>

        {/* Right Panel */}
        {!isMobileView && rightPanelOpen && (
          <div className="w-80 flex-shrink-0">
            <RightPanel />
          </div>
        )}

        {/* Mobile Drawer */}
        {isMobileView && (
          <div 
            className={`absolute top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 transform transition-transform duration-300 z-20 ${
              mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="h-1/2 border-b border-gray-200 dark:border-gray-700">
              <LeftPanel />
            </div>
            <div className="h-1/2">
              <RightPanel />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Ticker */}
      {!isMobileView && bottomTickerOpen && (
        <div className="h-24 flex-shrink-0">
          <BottomTicker />
        </div>
      )}

      {/* Modals */}
      {adoptModalOpen && <AdoptModal />}
    </div>
  );
};