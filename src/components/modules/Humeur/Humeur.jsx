import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { storage, getDateKey, formatDate } from '../../../utils/helpers';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { Smile, X } from 'lucide-react';

const Humeur = ({ onBack }) => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [todayEntry, setTodayEntry] = useState(null);

  const moods = [
    { id: 'joy', label: 'Joie', emoji: '😊', color: 'solar' },
    { id: 'serenity', label: 'Sérénité', emoji: '😌', color: 'teal' },
    { id: 'sadness', label: 'Tristesse', emoji: '😢', color: 'blue-400' },
    { id: 'anger', label: 'Colère', emoji: '😠', color: 'coral' },
    { id: 'fear', label: 'Peur', emoji: '😰', color: 'purple-400' },
    { id: 'fatigue', label: 'Fatigue', emoji: '😴', color: 'gray-400' },
    { id: 'confusion', label: 'Confusion', emoji: '😕', color: 'orange-300' },
    { id: 'hope', label: 'Espoir', emoji: '🌱', color: 'green-400' }
  ];

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = () => {
    if (user) {
      const saved = storage.get(`moods_${user.id}`) || [];
      setHistory(saved);
      
      // Check if there's already an entry for today
      const today = getDateKey();
      const todaysMood = saved.find(m => m.date === today);
      if (todaysMood) {
        setTodayEntry(todaysMood);
      }
    }
  };

  const saveMood = () => {
    if (!selectedMood) return;

    const today = getDateKey();
    const entry = {
      date: today,
      timestamp: new Date().toISOString(),
      mood: selectedMood,
      intensity,
      note: note.trim()
    };

    // Remove today's entry if exists, then add new one
    const filtered = history.filter(m => m.date !== today);
    const updated = [entry, ...filtered];
    
    storage.set(`moods_${user.id}`, updated);
    setHistory(updated);
    setTodayEntry(entry);
    
    // Reset form
    setSelectedMood(null);
    setIntensity(5);
    setNote('');
  };

  const getMoodColor = (moodId) => {
    const mood = moods.find(m => m.id === moodId);
    return mood ? mood.color : 'slate';
  };

  if (showHistory) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-solar/20 via-cream to-coral/10 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
        <header className="flex-shrink-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-solar to-coral">
              <Smile className="w-6 h-6 text-white icon-glow" />
            </div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Historique
            </h1>
          </div>
          <button
            onClick={() => setShowHistory(false)}
            className="p-2 rounded-2xl hover:bg-slate/10 dark:hover:bg-dark-text/10 transition-colors"
          >
            <X className="w-6 h-6 text-slate dark:text-dark-text" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          <div className="max-w-2xl mx-auto space-y-3">
            {history.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-slate/70 dark:text-dark-text/70">
                  Aucune humeur enregistrée pour le moment
                </p>
              </Card>
            ) : (
              history.map((entry, index) => {
                const mood = moods.find(m => m.id === entry.mood);
                return (
                  <Card key={index}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{mood?.emoji}</div>
                        <div>
                          <p className="font-semibold text-slate dark:text-dark-text">
                            {mood?.label}
                          </p>
                          <p className="text-sm text-slate/60 dark:text-dark-text/60">
                            {formatDate(entry.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal">
                          {entry.intensity}/10
                        </div>
                      </div>
                    </div>
                    {entry.note && (
                      <p className="mt-3 text-sm text-slate/70 dark:text-dark-text/70 italic">
                        "{entry.note}"
                      </p>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-solar/20 via-cream to-coral/10 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-solar to-coral">
            <Smile className="w-6 h-6 text-white icon-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Check-in Humeur
            </h1>
            <p className="text-sm text-slate/70 dark:text-dark-text/70">
              Comment tu te sens aujourd'hui ?
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
          {todayEntry && (
            <Card className="bg-teal/10 border-2 border-teal/30">
              <p className="text-center text-teal font-semibold mb-2">
                ✅ Tu as déjà enregistré ton humeur aujourd'hui !
              </p>
              <p className="text-center text-sm text-slate/70 dark:text-dark-text/70">
                Tu peux la mettre à jour ci-dessous si tu veux
              </p>
            </Card>
          )}

          {/* Mood Selection */}
          <Card>
            <h3 className="font-bold text-lg text-slate dark:text-dark-text mb-4">
              Quelle émotion ressens-tu ?
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {moods.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                    selectedMood === mood.id
                      ? `bg-${mood.color}/20 border-2 border-${mood.color} scale-105`
                      : 'bg-slate/5 hover:bg-slate/10 border-2 border-transparent'
                  }`}
                >
                  <div className="text-3xl">{mood.emoji}</div>
                  <span className="text-xs font-medium text-slate dark:text-dark-text">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Intensity Slider */}
          {selectedMood && (
            <>
              <Card>
                <h3 className="font-bold text-lg text-slate dark:text-dark-text mb-4">
                  Quelle intensité ? (1-10)
                </h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate/10 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #2A9D8F 0%, #2A9D8F ${intensity * 10}%, #e5e7eb ${intensity * 10}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="text-center">
                    <span className="text-4xl font-bold text-teal">
                      {intensity}
                    </span>
                    <span className="text-slate/60 dark:text-dark-text/60">/10</span>
                  </div>
                </div>
              </Card>

              {/* Optional Note */}
              <Card>
                <h3 className="font-bold text-lg text-slate dark:text-dark-text mb-4">
                  Note rapide (optionnel)
                </h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Qu'est-ce qui t'a fait ressentir ça ?"
                  className="w-full h-24 px-4 py-3 rounded-2xl border-2 border-slate/20 focus:border-teal focus:outline-none bg-white/50 dark:bg-dark-card/50 resize-none"
                />
              </Card>

              {/* Save Button */}
              <Button
                variant="primary"
                className="w-full"
                onClick={saveMood}
              >
                Enregistrer
              </Button>
            </>
          )}

          {/* View History */}
          {history.length > 0 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowHistory(true)}
            >
              Voir l'historique ({history.length} entrées)
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Humeur;
