import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { 
  AlertCircle, 
  Heart, 
  MessageCircle, 
  Trophy, 
  Sparkles, 
  User, 
  Wind, 
  BookOpen,
  Anchor,
  Smile,
  Moon,
  Sun,
  Flame,
  Lightbulb
} from 'lucide-react';

const SOSModal = ({ isOpen, onClose }) => {
  const [crisisCard, setCrisisCard] = useState('');
  const [showCrisisCard, setShowCrisisCard] = useState(false);

  // Load crisis card from localStorage
  React.useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('crisisCard');
      if (saved) {
        setCrisisCard(saved);
      }
    }
  }, [isOpen]);

  const saveCrisisCard = () => {
    localStorage.setItem('crisisCard', crisisCard);
    alert('Ta fiche de crise a été sauvegardée');
  };

  const handleEmergencyCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const handleEmergencySMS = () => {
    const message = encodeURIComponent("J'ai besoin d'aide maintenant. Peux-tu me contacter ?");
    window.location.href = `sms:?body=${message}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🆘 Besoin d'aide immédiate">
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-coral/10 border border-coral/20">
          <p className="text-sm text-slate dark:text-dark-text mb-4">
            Si tu es en situation d'urgence, ces ressources sont là pour toi :
          </p>
          
          <div className="space-y-3">
            <Button
              variant="coral"
              className="w-full text-lg"
              onClick={() => handleEmergencyCall('3114')}
            >
              📞 Appeler le 3114
              <span className="block text-sm opacity-90">Prévention suicide</span>
            </Button>
            
            <Button
              variant="coral"
              className="w-full text-lg"
              onClick={() => handleEmergencyCall('15')}
            >
              📞 Appeler le 15
              <span className="block text-sm opacity-90">Urgences médicales</span>
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleEmergencySMS}
            >
              💬 Texte d'urgence
              <span className="block text-sm opacity-70">Envoyer un SMS à quelqu'un</span>
            </Button>
          </div>
        </div>

        <div className="border-t border-slate/10 dark:border-dark-text/10 pt-4">
          <button
            onClick={() => setShowCrisisCard(!showCrisisCard)}
            className="w-full text-left p-4 rounded-2xl bg-teal/10 hover:bg-teal/20 transition-colors"
          >
            <p className="font-semibold text-teal">
              📝 Ma fiche de crise personnelle
            </p>
            <p className="text-sm text-slate/70 dark:text-dark-text/70">
              {showCrisisCard ? 'Cacher' : 'Afficher'}
            </p>
          </button>

          {showCrisisCard && (
            <div className="mt-4 space-y-3">
              <textarea
                value={crisisCard}
                onChange={(e) => setCrisisCard(e.target.value)}
                placeholder="Ce qui m'aide quand ça va pas :&#10;- Ma musique préférée...&#10;- Appeler [nom]...&#10;- Aller à [lieu safe]..."
                className="w-full h-32 px-4 py-3 rounded-2xl border-2 border-teal/20 focus:border-teal focus:outline-none bg-white/50 dark:bg-dark-card/50 resize-none"
              />
              <Button
                variant="primary"
                className="w-full"
                onClick={saveCrisisCard}
              >
                Sauvegarder ma fiche
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const Dashboard = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showSOS, setShowSOS] = useState(false);

  const modules = [
    {
      id: 'humeur',
      name: 'Humeur',
      description: 'Check-in quotidien',
      icon: Smile,
      color: 'from-solar to-coral',
      bgColor: 'bg-solar/10'
    },
    {
      id: 'echo',
      name: 'Écho',
      description: 'Jeu de situation',
      icon: Heart,
      color: 'from-coral to-pink-400',
      bgColor: 'bg-coral/10'
    },
    {
      id: 'psy',
      name: 'PsIA',
      description: 'Chat thérapeutique',
      icon: MessageCircle,
      color: 'from-teal to-blue-400',
      bgColor: 'bg-teal/10'
    },
    {
      id: 'heros',
      name: 'Héros',
      description: 'Estime de soi',
      icon: Trophy,
      color: 'from-solar to-orange-400',
      bgColor: 'bg-solar/10'
    },
    {
      id: 'oracle',
      name: 'Oracle',
      description: 'Sagesse symbolique',
      icon: Sparkles,
      color: 'from-solar to-yellow-300',
      bgColor: 'bg-solar/10'
    },
    {
      id: 'identite',
      name: 'Identité',
      description: 'Profil narratif',
      icon: User,
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      id: 'lumiere',
      name: 'Lumière',
      description: 'Psychoéducation',
      icon: Lightbulb,
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      id: 'respiration',
      name: 'Respiration',
      description: 'Cohérence cardiaque',
      icon: Wind,
      color: 'from-teal to-cyan-400',
      bgColor: 'bg-teal/10'
    },
    {
      id: 'ancrage',
      name: 'Ancrage',
      description: '5-4-3-2-1',
      icon: Anchor,
      color: 'from-blue-400 to-teal',
      bgColor: 'bg-blue-400/10'
    },
    {
      id: 'journal',
      name: 'Journal',
      description: 'Notes & Quêtes',
      icon: BookOpen,
      color: 'from-slate to-gray-600',
      bgColor: 'bg-slate/10'
    }
  ];

  const greetings = [
    "Content de te revoir ! 😊",
    "Hey, tu es là ! 🌟",
    "Bienvenue dans ton espace ! ✨",
    "Prêt(e) pour aujourd'hui ? 💪",
    "Tu es au bon endroit ! 🏠"
  ];

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-cream via-white to-cream/50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
            Salut, {user?.pseudo} ! 👋
          </h1>
          <p className="text-sm text-slate/70 dark:text-dark-text/70">
            {randomGreeting}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Streak Counter */}
          <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-solar/20">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-slate dark:text-dark-text">
              {user?.currentStreak || 1}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-2xl bg-slate/10 hover:bg-slate/20 dark:bg-dark-text/10 dark:hover:bg-dark-text/20 transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-solar" />
            ) : (
              <Moon className="w-5 h-5 text-slate" />
            )}
          </button>

          {/* SOS Button */}
          <button
            onClick={() => setShowSOS(true)}
            className="p-2 rounded-2xl bg-coral hover:bg-coral/90 transition-colors shadow-lg shadow-coral/30"
          >
            <AlertCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 scrollbar-hide">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => onNavigate(module.id)}
                className="glass-card p-6 text-left hover:scale-105 transition-all duration-200 active:scale-95 border-2 border-slate/20 dark:border-dark-text/20"
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${module.color} mb-3`}>
                  <module.icon className="w-6 h-6 text-white icon-glow" />
                </div>
                <h3 className="font-bold text-slate dark:text-dark-text mb-1">
                  {module.name}
                </h3>
                <p className="text-sm text-slate/70 dark:text-dark-text/70">
                  {module.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* SOS Modal */}
      <SOSModal isOpen={showSOS} onClose={() => setShowSOS(false)} />
    </div>
  );
};

export default Dashboard;
