import { rng } from '../../utils/rng';
import { generateUUID } from '../../utils/guards';
import type {
  EntityId,
  ComponentData,
  ComponentType,
  createHerbivore,
  createPredator,
  createTribal,
} from './components';
import { 
  createHerbivore as _createHerbivore,
  createPredator as _createPredator,
  createTribal as _createTribal,
} from './components';

export class ECSWorld {
  private entities: Set<EntityId> = new Set();
  private components: Map<ComponentType, Map<EntityId, any>> = new Map();
  private nextEntityId = 0;

  constructor() {
    // Initialize component storage
    this.initializeComponentStorage();
    this.populateInitialEntities();
  }

  private initializeComponentStorage(): void {
    const componentTypes: ComponentType[] = [
      'position', 'altitude', 'species', 'hunger', 'age', 'health',
      'behavior', 'villageId', 'selected', 'reproduction', 'energy'
    ];

    componentTypes.forEach(type => {
      this.components.set(type, new Map());
    });
  }

  private populateInitialEntities(): void {
    // Create initial population of mixed species
    const initialPopulation = 500;
    const worldSize = 1000;

    for (let i = 0; i < initialPopulation; i++) {
      const x = rng.randomFloat(-worldSize / 2, worldSize / 2);
      const y = rng.randomFloat(-worldSize / 2, worldSize / 2);
      const speciesRoll = rng.random();

      if (speciesRoll < 0.6) {
        this.createEntity(_createHerbivore(x, y));
      } else if (speciesRoll < 0.85) {
        this.createEntity(_createPredator(x, y));
      } else {
        this.createEntity(_createTribal(x, y));
      }
    }
  }

  // Entity management
  createEntity(initialComponents: Partial<ComponentData> = {}): EntityId {
    const entityId = generateUUID();
    this.entities.add(entityId);

    // Add initial components
    for (const [componentType, componentData] of Object.entries(initialComponents)) {
      this.addComponent(entityId, componentType as ComponentType, componentData);
    }

    return entityId;
  }

  removeEntity(entityId: EntityId): void {
    if (!this.entities.has(entityId)) return;

    // Remove from all component storage
    for (const componentMap of this.components.values()) {
      componentMap.delete(entityId);
    }

    this.entities.delete(entityId);
  }

  hasEntity(entityId: EntityId): boolean {
    return this.entities.has(entityId);
  }

  getEntityCount(): number {
    return this.entities.size;
  }

  getAllEntities(): EntityId[] {
    return Array.from(this.entities);
  }

  // Component management
  addComponent<T extends ComponentType>(
    entityId: EntityId,
    componentType: T,
    data: ComponentData[T]
  ): void {
    const componentMap = this.components.get(componentType);
    if (componentMap && this.entities.has(entityId)) {
      componentMap.set(entityId, data);
    }
  }

  removeComponent(entityId: EntityId, componentType: ComponentType): void {
    const componentMap = this.components.get(componentType);
    if (componentMap) {
      componentMap.delete(entityId);
    }
  }

  getComponent<T extends ComponentType>(
    entityId: EntityId,
    componentType: T
  ): ComponentData[T] | undefined {
    const componentMap = this.components.get(componentType);
    return componentMap?.get(entityId);
  }

  hasComponent(entityId: EntityId, componentType: ComponentType): boolean {
    const componentMap = this.components.get(componentType);
    return componentMap?.has(entityId) || false;
  }

  // Query system
  queryEntities(requiredComponents: ComponentType[]): EntityId[] {
    return Array.from(this.entities).filter(entityId =>
      requiredComponents.every(component => this.hasComponent(entityId, component))
    );
  }

  queryComponents<T extends ComponentType>(
    componentType: T,
    filter?: (data: ComponentData[T]) => boolean
  ): Array<{ entityId: EntityId; component: ComponentData[T] }> {
    const componentMap = this.components.get(componentType);
    if (!componentMap) return [];

    const results: Array<{ entityId: EntityId; component: ComponentData[T] }> = [];

    for (const [entityId, component] of componentMap.entries()) {
      if (!filter || filter(component)) {
        results.push({ entityId, component });
      }
    }

    return results;
  }

  // Batch operations
  forEachEntityWith(
    requiredComponents: ComponentType[],
    callback: (entityId: EntityId, components: Partial<ComponentData>) => void
  ): void {
    const entities = this.queryEntities(requiredComponents);

    entities.forEach(entityId => {
      const components: Partial<ComponentData> = {};
      
      requiredComponents.forEach(componentType => {
        const component = this.getComponent(entityId, componentType);
        if (component) {
          (components as any)[componentType] = component;
        }
      });

      callback(entityId, components);
    });
  }

  // Utility methods
  getEntityData(entityId: EntityId): Partial<ComponentData> {
    if (!this.entities.has(entityId)) return {};

    const data: Partial<ComponentData> = {};
    
    for (const [componentType, componentMap] of this.components.entries()) {
      const component = componentMap.get(entityId);
      if (component) {
        (data as any)[componentType] = component;
      }
    }

    return data;
  }

  // Statistics
  getPopulationBySpecies(): Record<string, number> {
    const counts: Record<string, number> = {
      HERBIVORE: 0,
      PREDATOR: 0,
      TRIBAL: 0,
    };

    this.forEachEntityWith(['species'], (entityId, components) => {
      const species = components.species!;
      counts[species.kind]++;
    });

    return counts;
  }

  getAverageAge(): number {
    const ages: number[] = [];
    
    this.forEachEntityWith(['age'], (entityId, components) => {
      ages.push(components.age!.value);
    });

    if (ages.length === 0) return 0;
    return ages.reduce((sum, age) => sum + age, 0) / ages.length;
  }

  getAverageHunger(): number {
    const hungerValues: number[] = [];
    
    this.forEachEntityWith(['hunger'], (entityId, components) => {
      hungerValues.push(components.hunger!.value);
    });

    if (hungerValues.length === 0) return 0;
    return hungerValues.reduce((sum, hunger) => sum + hunger, 0) / hungerValues.length;
  }

  // Serialization for snapshots
  serialize(): any {
    const serialized: any = {
      entities: Array.from(this.entities),
      components: {},
    };

    for (const [componentType, componentMap] of this.components.entries()) {
      serialized.components[componentType] = Object.fromEntries(componentMap.entries());
    }

    return serialized;
  }

  deserialize(data: any): void {
    // Clear existing data
    this.entities.clear();
    this.components.clear();
    this.initializeComponentStorage();

    // Restore entities
    if (data.entities) {
      data.entities.forEach((entityId: EntityId) => {
        this.entities.add(entityId);
      });
    }

    // Restore components
    if (data.components) {
      for (const [componentType, componentData] of Object.entries(data.components)) {
        const componentMap = this.components.get(componentType as ComponentType);
        if (componentMap && componentData) {
          for (const [entityId, component] of Object.entries(componentData as any)) {
            componentMap.set(entityId, component);
          }
        }
      }
    }
  }

  // Reset world state
  reset(): void {
    this.entities.clear();
    this.components.clear();
    this.initializeComponentStorage();
    this.populateInitialEntities();
  }
}