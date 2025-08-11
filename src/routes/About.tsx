import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Database, Cpu, Globe, Zap, Users, Heart } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-orange-50 dark:from-gray-900 dark:via-emerald-900 dark:to-orange-900">
      {/* Header */}
      <header className="w-full p-6">
        <nav className="flex items-center max-w-6xl mx-auto">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to AeonWorld</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
              About AeonWorld
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A next-generation persistent world simulation built with cutting-edge web technologies
          </p>
        </div>

        {/* Vision Section */}
        <section className="panel p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3">
            <Globe className="w-8 h-8 text-emerald-600" />
            <span>Our Vision</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            AeonWorld represents the future of interactive simulations—a persistent digital ecosystem 
            where life evolves naturally through emergent behavior, complex interactions, and evolutionary pressures. 
            Unlike traditional games or static simulations, AeonWorld continues to grow and change even when you're not watching.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            We believe in the power of emergence: simple rules creating complex, beautiful, and surprising behaviors. 
            Every creature in AeonWorld follows basic survival instincts, yet together they create civilizations, 
            ecosystems, and stories that unfold over time.
          </p>
        </section>

        {/* Technology Stack */}
        <section className="panel p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3">
            <Code className="w-8 h-8 text-sky-600" />
            <span>Technology Stack</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-emerald-600">Frontend</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• <strong>React 18</strong> with TypeScript for type-safe development</li>
                <li>• <strong>Vite</strong> for lightning-fast development and builds</li>
                <li>• <strong>Babylon.js</strong> for high-performance 3D rendering</li>
                <li>• <strong>Tailwind CSS</strong> with custom glassmorphism design</li>
                <li>• <strong>Zustand</strong> for efficient state management</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-sky-600">Simulation</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• <strong>ECS Architecture</strong> for scalable entity management</li>
                <li>• <strong>Deterministic RNG</strong> for reproducible worlds</li>
                <li>• <strong>IndexedDB</strong> for client-side persistence</li>
                <li>• <strong>WebGPU/WebGL2</strong> for GPU-accelerated rendering</li>
                <li>• <strong>MSW</strong> for mockable API boundaries</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="panel p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3">
            <Cpu className="w-8 h-8 text-orange-600" />
            <span>System Architecture</span>
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Entity-Component-System (ECS)</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Every living being in AeonWorld is built using our custom ECS architecture. Entities have components 
                like Position, Hunger, Age, and Species, while systems like HungerSystem and WanderSystem process 
                these components each simulation tick.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">GPU Instancing</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We use advanced GPU instancing techniques to render thousands of entities at 60fps. Each species 
                uses optimized instanced meshes with Level-of-Detail (LOD) switching for maximum performance.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">API-Ready Architecture</h3>
              <p className="text-gray-700 dark:text-gray-300">
                While currently running entirely in your browser with mock data, AeonWorld is built with a 
                complete API abstraction layer. This allows seamless transition to a real backend without 
                changing any frontend code.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="panel p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3">
            <Zap className="w-8 h-8 text-purple-600" />
            <span>Current Features</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                <div>
                  <strong>Living Ecosystem:</strong> Herbivores, Predators, and Tribal beings with realistic survival behaviors
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-sky-500 rounded-full mt-2"></div>
                <div>
                  <strong>Procedural Terrain:</strong> Dynamic heightmaps with multiple biomes affecting entity behavior
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong>Real-time Events:</strong> Birth, death, discovery events with intelligent filtering
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <strong>World Snapshots:</strong> Save and load complete world states to IndexedDB
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                <div>
                  <strong>Interactive Inspection:</strong> Click any entity to see detailed stats and behavior
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                <div>
                  <strong>Performance Optimized:</strong> Stable 60fps with 2000+ entities through advanced culling
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="panel p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3">
            <Database className="w-8 h-8 text-green-600" />
            <span>Future Roadmap</span>
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-emerald-500 pl-6">
              <h3 className="text-lg font-semibold text-emerald-600">Phase 1: Backend Integration</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Real-time multiplayer support with persistent server-side worlds, user accounts, and cloud snapshots.
              </p>
            </div>
            <div className="border-l-4 border-sky-500 pl-6">
              <h3 className="text-lg font-semibold text-sky-600">Phase 2: Advanced AI</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Machine learning-driven entity behavior, evolutionary algorithms, and emergent civilization mechanics.
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-orange-600">Phase 3: User Interaction</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Entity adoption system, world modification tools, and community features for sharing discoveries.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="panel p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3">
            <Users className="w-8 h-8 text-pink-600" />
            <span>Built with ❤️</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
            AeonWorld is a passion project exploring the intersection of artificial life, 
            emergent behavior, and interactive media. We believe in open development 
            and the power of community-driven evolution.
          </p>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            to="/sim"
            className="inline-flex items-center space-x-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Globe className="w-6 h-6" />
            <span>Experience AeonWorld</span>
          </Link>
        </div>
      </main>
    </div>
  );
};