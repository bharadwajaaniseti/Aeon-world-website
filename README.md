# AeonWorld - Persistent World Simulation

A next-generation persistent world simulation built with cutting-edge web technologies. Experience an ever-evolving 3D ecosystem where thousands of autonomous beings live, hunt, reproduce, and build civilizations.

## ✨ Features

- **Living Ecosystem**: Watch herbivores graze, predators hunt, and tribal societies emerge naturally
- **Persistent World**: Your world continues evolving even when you're away
- **Real-Time 3D**: GPU-accelerated rendering with Babylon.js supporting 2000+ entities at 60fps
- **Entity Adoption**: Follow individual creatures on their life journeys
- **World Snapshots**: Save and restore complete world states
- **Responsive Design**: Seamless experience across desktop and mobile devices

## 🚀 Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd aeonworld
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎮 Controls & Hotkeys

### Camera Controls
- **Mouse Drag**: Orbit around the world
- **Scroll Wheel**: Zoom in/out  
- **Shift + Drag**: Pan the camera
- **WASD Keys**: Pan camera
- **Q/E Keys**: Zoom in/out
- **R Key**: Reset camera to default position

### Simulation Controls
- **Space**: Pause/Resume simulation
- **1-4 Keys**: Change simulation speed (0.25x to 4x)
- **Click Entity**: Inspect detailed stats
- **Esc**: Clear selection

### Interface
- **Mouse Hover on Ticker**: Pause event stream
- **Click MiniMap**: Focus camera (coming soon)

## 🔧 Configuration

### Environment Modes

The app supports two modes via environment variables:

#### Mock Mode (Default - Client Only)
```bash
VITE_USE_MOCKS=true
```
- Runs entirely in your browser
- No network calls
- Uses MSW (Mock Service Worker) for API simulation
- IndexedDB for local persistence

#### HTTP Mode (Future Backend Integration)
```bash
VITE_USE_MOCKS=false
VITE_API_BASE=https://your-backend-api.com
```
- Connects to real backend API
- Currently stubbed (throws errors)
- Ready for future backend integration

### Switching Modes

1. Copy `.env.example` to `.env`
2. Modify `VITE_USE_MOCKS` as needed
3. Restart the development server

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for development and building
- **Babylon.js** for 3D rendering with WebGPU/WebGL2 fallback
- **Tailwind CSS** with glassmorphism design system
- **Zustand** for state management
- **React Router** for navigation

### Simulation Engine
- **ECS (Entity-Component-System)** architecture for scalable entity management
- **Deterministic RNG** for reproducible worlds based on seed
- **Systems**: Hunger, Movement, Aging, Reproduction
- **Components**: Position, Species, Health, Behavior, Age
- **GPU Instancing** for high-performance rendering

### API Design
- **Adapter Pattern**: Seamlessly switch between mock and real APIs
- **TypeScript + Zod**: Type-safe API contracts
- **MSW Integration**: Runtime API mocking
- **OpenAPI 3.1**: Complete backend specification ready

## 📊 World Snapshots

Snapshots capture complete world state including:
- All entity positions, stats, and relationships
- World seed and terrain configuration  
- Simulation day/time and population metrics
- User preferences and camera position

### Snapshot Management
- **Save**: Creates timestamped snapshot in IndexedDB
- **Load**: Restores complete world state
- **Delete**: Removes snapshot from local storage
- **Size**: Typically 100-500KB per snapshot

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
- ✅ API adapter switching
- ✅ Event ticker filtering  
- ✅ Snapshot save/load to IndexedDB
- ✅ Component rendering
- ✅ ECS system logic

## 📋 API Reference

The application is built with a complete API abstraction layer defined in `src/api/openapi.yaml`. Key endpoints:

### Worlds
- `GET /worlds` - List all worlds
- `GET /worlds/{id}` - Get world details
- `GET /worlds/{id}/metrics` - Get population metrics

### Entities  
- `GET /worlds/{id}/entities` - List entities with spatial filtering
- `GET /worlds/{id}/entities/{entityId}` - Get entity details
- `POST /worlds/{id}/entities/{entityId}/nudge` - Influence entity behavior

### Events
- `GET /worlds/{id}/events` - Get world events with cursor pagination

See `src/api/openapi.yaml` for complete specification.

## 🔄 Mock vs Production Architecture

### Current (Mock Mode)
```
Frontend → MockApiAdapter → MSW → In-Memory Store → IndexedDB
```

### Future (Production Mode)  
```
Frontend → HttpApiAdapter → Real Backend API → Database
```

The adapter pattern ensures **zero frontend changes** when switching modes.

## 🎯 Roadmap

### Phase 1: Backend Integration
- [ ] Real-time multiplayer support
- [ ] Server-side world persistence
- [ ] User accounts and authentication
- [ ] Cloud snapshot storage

### Phase 2: Advanced AI
- [ ] Machine learning entity behavior
- [ ] Evolutionary algorithms
- [ ] Emergent civilization mechanics
- [ ] Complex ecosystem interactions

### Phase 3: User Interaction
- [ ] Entity adoption with real effects
- [ ] World modification tools
- [ ] Community features
- [ ] Achievement system

## 🚀 Performance

### Targets
- **60 FPS** stable rendering with 2000+ entities
- **< 2s** initial load time
- **< 500KB** bundle size (gzipped)
- **< 100ms** simulation tick time

### Optimizations
- GPU instancing for entity rendering
- Frustum culling and LOD systems
- Throttled input handlers
- Efficient state management
- Web Workers for heavy computation (planned)

## 📱 Browser Support

- **Chrome 90+** (Full WebGPU support)
- **Firefox 88+** (WebGL2 fallback)  
- **Safari 14+** (WebGL2 fallback)
- **Edge 90+** (Full WebGPU support)

### Mobile Support
- Responsive design with touch controls
- Performance optimized for mobile GPUs
- Progressive enhancement for capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`  
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Babylon.js** team for the incredible 3D engine
- **React** team for the robust UI framework  
- **Tailwind CSS** for the beautiful design system
- **MSW** team for seamless API mocking
- The broader **TypeScript** and **WebGL** communities

---

Experience life evolving in real-time. Welcome to **AeonWorld**. 🌍✨