import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Sparkles, Globe, Users, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-orange-50 dark:from-gray-900 dark:via-emerald-900 dark:to-orange-900">
      {/* Header */}
      <header className="w-full p-6">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
              AeonWorld
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/about"
              className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Persistent World Simulation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 via-sky-600 to-orange-600 bg-clip-text text-transparent">
              Life Evolves
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-100">
              While You Watch
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Enter AeonWorld, where thousands of autonomous beings live, hunt, reproduce, and build civilizations 
            in a persistent 3D world that never stops evolving.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/sim"
              className="flex items-center space-x-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Play className="w-6 h-6" />
              <span>Launch Simulation</span>
            </Link>
            
            <Link
              to="/about"
              className="flex items-center space-x-3 bg-white/80 hover:bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg transition-all backdrop-blur-sm border border-white/20"
            >
              <Info className="w-6 h-6" />
              <span>Learn More</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="panel text-center p-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Living Ecosystem</h3>
            <p className="text-gray-600">
              Watch herbivores graze, predators hunt, and tribal societies emerge naturally 
              through emergent behavior and evolution.
            </p>
          </div>

          <div className="panel text-center p-8">
            <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="w-8 h-8 text-sky-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Persistent World</h3>
            <p className="text-gray-600">
              Your world continues evolving even when you're away. Save snapshots 
              and return to see how life has changed.
            </p>
          </div>

          <div className="panel text-center p-8">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Real-Time 3D</h3>
            <p className="text-gray-600">
              Experience your world in stunning 3D with GPU-accelerated rendering 
              supporting thousands of entities at 60fps.
            </p>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="panel p-8 text-center bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-emerald-200/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">2,847</div>
              <div className="text-sm text-gray-600">Living Beings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-600 mb-2">142</div>
              <div className="text-sm text-gray-600">Days Elapsed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">7</div>
              <div className="text-sm text-gray-600">Biome Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
              <div className="text-sm text-gray-600">Possibilities</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 mt-16 border-t border-gray-200/50">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>© 2025 AeonWorld. Experience life evolving in real-time.</p>
        </div>
      </footer>
    </div>
  );
};