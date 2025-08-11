import React, { useRef, useEffect, useState } from 'react';
import { useSimStore, useFilteredEvents } from '../state/useSimStore';
import { Filter, Pause, Play } from 'lucide-react';
import { formatTimestamp } from '../utils/time';

export const BottomTicker: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { eventFilter, setEventFilter } = useSimStore();
  const filteredEvents = useFilteredEvents();

  const eventFilters = ['All', 'Birth', 'Death', 'Discovery', 'Migration', 'Interaction'];

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [filteredEvents, isPaused]);

  const getEventIcon = (kind: string) => {
    switch (kind.toLowerCase()) {
      case 'birth':
        return '🐣';
      case 'death':
        return '💀';
      case 'discovery':
        return '🔍';
      case 'migration':
        return '🌍';
      case 'interaction':
        return '🤝';
      default:
        return '📡';
    }
  };

  const getEventColor = (kind: string) => {
    switch (kind.toLowerCase()) {
      case 'birth':
        return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'death':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'discovery':
        return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'migration':
        return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'interaction':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      default:
        return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  return (
    <div className="h-full bg-black/20 backdrop-blur-md border-t border-white/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <h3 className="text-white font-semibold text-sm">Event Stream</h3>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-white/60" />
          <div className="flex space-x-1">
            {eventFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setEventFilter(filter)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  eventFilter === filter
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event Stream */}
      <div className="flex-1 p-3">
        <div
          ref={scrollRef}
          className="h-full overflow-x-auto overflow-y-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex space-x-3 h-full items-center">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`flex-shrink-0 ticker-item border rounded-lg p-3 min-w-[280px] ${getEventColor(event.kind)}`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{getEventIcon(event.kind)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium opacity-80">
                        {event.kind}
                      </span>
                      <span className="text-xs opacity-60">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      {event.description}
                    </p>
                    {event.entityId && (
                      <div className="text-xs opacity-60 mt-1 font-mono">
                        Entity: #{event.entityId.slice(0, 8)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="flex-shrink-0 flex items-center justify-center h-full px-8">
                <p className="text-white/60 text-sm">
                  No {eventFilter.toLowerCase()} events yet. Life is getting started...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};