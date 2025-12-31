import React from 'react';
import { Heart, Trophy, MessageCircle, User } from 'lucide-react';

const FloatingDock = ({ currentModule, onNavigate }) => {
  // Don't show dock on immersive modules
  const immersiveModules = ['respiration', 'ancrage'];
  if (immersiveModules.includes(currentModule)) {
    return null;
  }

  const dockItems = [
    {
      id: 'echo',
      name: 'Écho',
      icon: Heart,
      color: 'coral',
      bgClass: 'bg-coral',
      textClass: 'text-coral'
    },
    {
      id: 'heros',
      name: 'Héros',
      icon: Trophy,
      color: 'solar',
      bgClass: 'bg-solar',
      textClass: 'text-solar'
    },
    {
      id: 'psy',
      name: 'PsIA',
      icon: MessageCircle,
      color: 'teal',
      bgClass: 'bg-teal',
      textClass: 'text-teal'
    },
    {
      id: 'identite',
      name: 'Identité',
      icon: User,
      color: 'purple-400',
      bgClass: 'bg-purple-400',
      textClass: 'text-purple-400'
    }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-card px-4 py-3 rounded-3xl shadow-2xl border-2 border-white/30 dark:border-dark-text/20">
        <div className="flex items-center gap-3">
          {dockItems.map((item) => {
            const isActive = currentModule === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative group p-3 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? `${item.bgClass} shadow-lg transform scale-110` 
                    : 'hover:bg-slate/10 dark:hover:bg-dark-text/10 hover:scale-105'
                }`}
                title={item.name}
              >
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive 
                      ? 'text-white icon-glow' 
                      : item.textClass
                  }`} 
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate dark:bg-dark-card text-white dark:text-dark-text text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {item.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate dark:border-t-dark-card" />
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FloatingDock;
