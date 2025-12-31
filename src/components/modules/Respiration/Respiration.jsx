import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { Wind, X } from 'lucide-react';

const Respiration = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
  const [timer, setTimer] = useState(4);
  const [cycles, setCycles] = useState(0);

  const phases = {
    inhale: { duration: 4, next: 'hold', label: 'Inspire', color: 'from-teal to-cyan-400' },
    hold: { duration: 2, next: 'exhale', label: 'Bloque', color: 'from-cyan-400 to-blue-400' },
    exhale: { duration: 6, next: 'inhale', label: 'Expire', color: 'from-blue-400 to-teal' }
  };

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            const nextPhase = phases[phase].next;
            setPhase(nextPhase);
            if (nextPhase === 'inhale') {
              setCycles(c => c + 1);
            }
            return phases[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const startStop = () => {
    if (!isActive) {
      setPhase('inhale');
      setTimer(4);
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimer(4);
    setCycles(0);
  };

  const getCircleSize = () => {
    const currentPhase = phases[phase];
    if (phase === 'inhale') {
      return 100 + ((currentPhase.duration - timer) / currentPhase.duration) * 100;
    } else if (phase === 'exhale') {
      return 200 - ((currentPhase.duration - timer) / currentPhase.duration) * 100;
    }
    return 200;
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-teal/20 via-cream to-cyan-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-teal to-cyan-400">
            <Wind className="w-6 h-6 text-white icon-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Respiration
            </h1>
            <p className="text-sm text-slate/70 dark:text-dark-text/70">
              Cohérence cardiaque
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="p-2 rounded-2xl hover:bg-slate/10 dark:hover:bg-dark-text/10 transition-colors"
        >
          <X className="w-6 h-6 text-slate dark:text-dark-text" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Info Card */}
          <Card>
            <h3 className="font-bold text-lg text-slate dark:text-dark-text mb-2">
              🫁 La cohérence cardiaque
            </h3>
            <p className="text-sm text-slate/70 dark:text-dark-text/70 mb-3">
              Cette technique de respiration aide à réguler ton système nerveux, 
              réduire le stress et l'anxiété. Pratique 5 minutes par jour pour 
              des résultats optimaux.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-teal/10 text-teal font-medium">
                4s inspire
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-600 font-medium">
                2s bloque
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-400/10 text-blue-600 font-medium">
                6s expire
              </span>
            </div>
          </Card>

          {/* Breathing Circle */}
          <div className="flex flex-col items-center justify-center min-h-[400px] glass-card">
            <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
              {/* Animated Circle */}
              <div
                className={`absolute rounded-full bg-gradient-to-br ${phases[phase].color} transition-all duration-1000 ease-in-out shadow-2xl`}
                style={{
                  width: getCircleSize(),
                  height: getCircleSize(),
                  opacity: 0.7
                }}
              />
              
              {/* Center Content */}
              <div className="relative z-10 text-center">
                <div className="text-6xl font-bold text-slate dark:text-dark-text mb-2">
                  {timer}
                </div>
                <div className="text-xl font-semibold text-teal">
                  {phases[phase].label}
                </div>
              </div>
            </div>

            {/* Cycle Counter */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate/70 dark:text-dark-text/70">
                Cycles complétés
              </p>
              <p className="text-3xl font-bold text-teal">
                {cycles}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={startStop}
            >
              {isActive ? 'Pause' : 'Commencer'}
            </Button>
            {cycles > 0 && (
              <Button
                variant="outline"
                onClick={reset}
              >
                Réinitialiser
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Respiration;
