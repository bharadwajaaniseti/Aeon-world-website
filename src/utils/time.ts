// Time utilities for the simulation
export class SimulationTime {
  private startTime: number = Date.now();
  private pausedTime: number = 0;
  private isPaused: boolean = false;
  private pauseStartTime: number = 0;
  
  // Simulation parameters
  private dayLengthMs: number = 60000; // 1 minute = 1 day
  
  constructor(dayLengthMs: number = 60000) {
    this.dayLengthMs = dayLengthMs;
  }

  pause(): void {
    if (!this.isPaused) {
      this.isPaused = true;
      this.pauseStartTime = Date.now();
    }
  }

  resume(): void {
    if (this.isPaused) {
      this.pausedTime += Date.now() - this.pauseStartTime;
      this.isPaused = false;
      this.pauseStartTime = 0;
    }
  }

  reset(): void {
    this.startTime = Date.now();
    this.pausedTime = 0;
    this.isPaused = false;
    this.pauseStartTime = 0;
  }

  // Get elapsed real time (excluding paused time)
  getElapsedMs(): number {
    const currentPausedTime = this.isPaused 
      ? this.pausedTime + (Date.now() - this.pauseStartTime)
      : this.pausedTime;
    
    return Date.now() - this.startTime - currentPausedTime;
  }

  // Get current simulation day (floating point)
  getCurrentDay(): number {
    return this.getElapsedMs() / this.dayLengthMs;
  }

  // Get current time within the day (0-1)
  getTimeOfDay(): number {
    const currentDay = this.getCurrentDay();
    return currentDay - Math.floor(currentDay);
  }

  // Get day/time string for display
  getDisplayTime(): string {
    const currentDay = this.getCurrentDay();
    const day = Math.floor(currentDay);
    const timeOfDay = currentDay - day;
    const hours = Math.floor(timeOfDay * 24);
    const minutes = Math.floor((timeOfDay * 24 * 60) % 60);
    
    return `Day ${day + 1} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Check if simulation is paused
  isSimulationPaused(): boolean {
    return this.isPaused;
  }

  // Set day length
  setDayLength(ms: number): void {
    this.dayLengthMs = ms;
  }

  // Get current day length
  getDayLength(): number {
    return this.dayLengthMs;
  }
}

// Utility functions for time formatting
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  
  return date.toLocaleDateString();
}

// Create a singleton simulation time instance
export const simTime = new SimulationTime();