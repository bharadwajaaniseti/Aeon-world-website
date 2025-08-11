// Deterministic random number generator (seeded)
export class SeededRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  // Linear Congruential Generator
  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  // Random integer between min (inclusive) and max (exclusive)
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  // Random float between min and max
  nextFloat(min: number = 0, max: number = 1): number {
    return this.next() * (max - min) + min;
  }

  // Random boolean with given probability
  nextBool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  // Random element from array
  nextElement<T>(array: T[]): T {
    return array[this.nextInt(0, array.length)];
  }

  // Reset to original seed
  reset(newSeed?: number): void {
    if (newSeed !== undefined) {
      this.seed = newSeed % 2147483647;
    }
    if (this.seed <= 0) this.seed += 2147483646;
  }
}

// Global RNG instance
let globalRNG = new SeededRNG(Date.now());

export const rng = {
  setSeed: (seed: number) => {
    globalRNG = new SeededRNG(seed);
  },
  
  getSeed: () => globalRNG.seed,
  
  random: () => globalRNG.next(),
  
  randomInt: (min: number, max: number) => globalRNG.nextInt(min, max),
  
  randomFloat: (min: number = 0, max: number = 1) => globalRNG.nextFloat(min, max),
  
  randomBool: (probability: number = 0.5) => globalRNG.nextBool(probability),
  
  randomElement: <T>(array: T[]) => globalRNG.nextElement(array),
};