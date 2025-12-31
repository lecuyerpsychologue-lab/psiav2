import React, { useState } from 'react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { Anchor, X, ArrowRight } from 'lucide-react';

const Ancrage = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState(['', '', '', '', '']);

  const steps = [
    {
      number: 5,
      sense: 'VOIS',
      emoji: '👁️',
      prompt: 'Nomme 5 choses que tu VOIS autour de toi',
      color: 'from-blue-400 to-teal',
      placeholder: 'Ex: un arbre, mon téléphone, une chaise...'
    },
    {
      number: 4,
      sense: 'TOUCHES',
      emoji: '✋',
      prompt: 'Nomme 4 choses que tu peux TOUCHER',
      color: 'from-teal to-cyan-400',
      placeholder: 'Ex: le sol sous mes pieds, mes vêtements...'
    },
    {
      number: 3,
      sense: 'ENTENDS',
      emoji: '👂',
      prompt: 'Nomme 3 choses que tu ENTENDS',
      color: 'from-cyan-400 to-blue-300',
      placeholder: 'Ex: des oiseaux, ma respiration, le vent...'
    },
    {
      number: 2,
      sense: 'SENS',
      emoji: '👃',
      prompt: 'Nomme 2 choses que tu SENS (odeurs)',
      color: 'from-blue-300 to-purple-400',
      placeholder: 'Ex: l\'air frais, mon parfum...'
    },
    {
      number: 1,
      sense: 'GOÛTES',
      emoji: '👅',
      prompt: 'Nomme 1 chose que tu peux GOÛTER',
      color: 'from-purple-400 to-pink-400',
      placeholder: 'Ex: mon café, ma salive...'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show completion
      setCurrentStep(steps.length);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setResponses(['', '', '', '', '']);
  };

  if (currentStep >= steps.length) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-teal/20 via-cream to-blue-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
        <header className="flex-shrink-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-blue-400 to-teal">
              <Anchor className="w-6 h-6 text-white icon-glow" />
            </div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Ancrage
            </h1>
          </div>
          <button
            onClick={onBack}
            className="p-2 rounded-2xl hover:bg-slate/10 dark:hover:bg-dark-text/10 transition-colors"
          >
            <X className="w-6 h-6 text-slate dark:text-dark-text" />
          </button>
        </header>

        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-lg text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-3xl bg-gradient-to-br from-teal to-blue-400 animate-pulse">
                <Anchor className="w-10 h-10 text-white icon-glow" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-slate dark:text-dark-text mb-4">
              Bien joué ! 🎉
            </h2>
            
            <div className="space-y-4 mb-6">
              <p className="text-xl text-teal font-semibold">
                Tu es ici.
              </p>
              <p className="text-xl text-teal font-semibold">
                Tu es en sécurité.
              </p>
              <p className="text-xl text-teal font-semibold">
                Respire.
              </p>
            </div>

            <p className="text-slate/70 dark:text-dark-text/70 mb-6">
              Cet exercice t'a reconnecté au moment présent. 
              Tu peux y revenir quand tu en as besoin.
            </p>

            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleRestart}
              >
                Recommencer
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={onBack}
              >
                Retour
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-teal/20 via-cream to-blue-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-blue-400 to-teal">
            <Anchor className="w-6 h-6 text-white icon-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Ancrage 5-4-3-2-1
            </h1>
            <p className="text-sm text-slate/70 dark:text-dark-text/70">
              Étape {currentStep + 1} sur {steps.length}
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

      {/* Progress Bar */}
      <div className="flex-shrink-0 px-4">
        <div className="h-2 bg-slate/10 dark:bg-dark-text/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal to-blue-400 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            {/* Step Header */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-24 h-24 mb-4 rounded-3xl bg-gradient-to-br ${step.color} shadow-lg animate-pulse`}>
                <div className="text-5xl">{step.emoji}</div>
              </div>
              <h2 className="text-4xl font-bold text-slate dark:text-dark-text mb-2">
                {step.number}
              </h2>
              <p className="text-xl font-semibold text-teal">
                {step.prompt}
              </p>
            </div>

            {/* Description */}
            <p className="text-center text-slate/70 dark:text-dark-text/70 mb-6">
              Prends ton temps. Regarde autour de toi. Ressens le moment présent.
            </p>

            {/* Input */}
            <textarea
              value={responses[currentStep]}
              onChange={(e) => {
                const newResponses = [...responses];
                newResponses[currentStep] = e.target.value;
                setResponses(newResponses);
              }}
              placeholder={step.placeholder}
              className="w-full h-32 px-4 py-3 rounded-2xl border-2 border-teal/20 focus:border-teal focus:outline-none bg-white/50 dark:bg-dark-card/50 resize-none text-slate dark:text-dark-text"
            />
          </Card>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
              >
                Précédent
              </Button>
            )}
            <Button
              variant="primary"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={handleNext}
            >
              {currentStep < steps.length - 1 ? 'Suivant' : 'Terminer'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ancrage;
