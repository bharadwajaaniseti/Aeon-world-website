import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Panel visibility
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomTickerOpen: boolean;
  
  // Overlay toggles
  biomesOverlay: boolean;
  populationOverlay: boolean;
  resourcesOverlay: boolean;
  
  // Simulation controls
  isPaused: boolean;
  simulationSpeed: number;
  worldSeed: number;
  
  // Selection
  selectedEntityId: string | null;
  adoptedEntityId: string | null;
  
  // Modal states
  adoptModalOpen: boolean;
  snapshotModalOpen: boolean;
  
  // Settings
  showFPS: boolean;
  reducedMotion: boolean;
  
  // Mobile responsive
  isMobileView: boolean;
  mobileDrawerOpen: boolean;
}

interface UIActions {
  // Panel actions
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleBottomTicker: () => void;
  
  // Overlay actions
  toggleBiomesOverlay: () => void;
  togglePopulationOverlay: () => void;
  toggleResourcesOverlay: () => void;
  
  // Simulation actions
  togglePause: () => void;
  setSimulationSpeed: (speed: number) => void;
  setWorldSeed: (seed: number) => void;
  
  // Selection actions
  setSelectedEntity: (entityId: string | null) => void;
  setAdoptedEntity: (entityId: string | null) => void;
  
  // Modal actions
  openAdoptModal: () => void;
  closeAdoptModal: () => void;
  openSnapshotModal: () => void;
  closeSnapshotModal: () => void;
  
  // Settings actions
  setShowFPS: (show: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  
  // Mobile actions
  setMobileView: (isMobile: boolean) => void;
  toggleMobileDrawer: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      leftPanelOpen: true,
      rightPanelOpen: true,
      bottomTickerOpen: true,
      biomesOverlay: false,
      populationOverlay: false,
      resourcesOverlay: false,
      isPaused: false,
      simulationSpeed: 1,
      worldSeed: 12345,
      selectedEntityId: null,
      adoptedEntityId: null,
      adoptModalOpen: false,
      snapshotModalOpen: false,
      showFPS: false,
      reducedMotion: false,
      isMobileView: false,
      mobileDrawerOpen: false,

      // Panel actions
      toggleLeftPanel: () =>
        set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
      toggleRightPanel: () =>
        set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
      toggleBottomTicker: () =>
        set((state) => ({ bottomTickerOpen: !state.bottomTickerOpen })),

      // Overlay actions
      toggleBiomesOverlay: () =>
        set((state) => ({ biomesOverlay: !state.biomesOverlay })),
      togglePopulationOverlay: () =>
        set((state) => ({ populationOverlay: !state.populationOverlay })),
      toggleResourcesOverlay: () =>
        set((state) => ({ resourcesOverlay: !state.resourcesOverlay })),

      // Simulation actions
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
      setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
      setWorldSeed: (seed) => set({ worldSeed: seed }),

      // Selection actions
      setSelectedEntity: (entityId) => set({ selectedEntityId: entityId }),
      setAdoptedEntity: (entityId) => set({ adoptedEntityId: entityId }),

      // Modal actions
      openAdoptModal: () => set({ adoptModalOpen: true }),
      closeAdoptModal: () => set({ adoptModalOpen: false }),
      openSnapshotModal: () => set({ snapshotModalOpen: true }),
      closeSnapshotModal: () => set({ snapshotModalOpen: false }),

      // Settings actions
      setShowFPS: (show) => set({ showFPS: show }),
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),

      // Mobile actions
      setMobileView: (isMobile) => set({ isMobileView: isMobile }),
      toggleMobileDrawer: () =>
        set((state) => ({ mobileDrawerOpen: !state.mobileDrawerOpen })),
    }),
    {
      name: 'aeon-ui-store',
      partialize: (state) => ({
        // Persist only specific UI preferences
        showFPS: state.showFPS,
        reducedMotion: state.reducedMotion,
        simulationSpeed: state.simulationSpeed,
        worldSeed: state.worldSeed,
        leftPanelOpen: state.leftPanelOpen,
        rightPanelOpen: state.rightPanelOpen,
        bottomTickerOpen: state.bottomTickerOpen,
      }),
    }
  )
);