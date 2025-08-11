import React from 'react';
import { Globe, Sparkles } from 'lucide-react';

export const Loader: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-orange-50 dark:from-gray-900 dark:via-emerald-900 dark:to-orange-900 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Globe className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-yellow-500 animate-bounce" />
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            AeonWorld
          </span>
        </h1>
        
        <div className="space-y-2 mb-8">
          <p className="text-xl text-gray-700 dark:text-gray-300">Initializing World...</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        {/* Loading Steps */}
        <div className="glass-panel p-6 rounded-2xl max-w-md mx-auto">
          <div className="space-y-3">
            <LoadingStep text="Generating terrain..." completed />
            <LoadingStep text="Seeding life forms..." completed />
            <LoadingStep text="Initializing ecosystems..." active />
            <LoadingStep text="Starting simulation..." />
          </div>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-6">
          This may take a few moments on first load
        </p>
      </div>
    </div>
  );
};

interface LoadingStepProps {
  text: string;
  completed?: boolean;
  active?: boolean;
}

const LoadingStep: React.FC<LoadingStepProps> = ({ text, completed, active }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
        completed ? 'bg-emerald-500' : active ? 'bg-sky-500' : 'bg-gray-300'
      }`}>
        {completed && <span className="text-white text-xs">✓</span>}
        {active && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
      </div>
      <span className={`text-sm ${
        completed ? 'text-emerald-600' : active ? 'text-sky-600' : 'text-gray-500'
      }`}>
        {text}
      </span>
    </div>
  );
};