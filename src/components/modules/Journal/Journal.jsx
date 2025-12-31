import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { storage, formatDateTime } from '../../../utils/helpers';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import { BookOpen, X, Plus, Trash2, Trophy, CheckSquare, Square } from 'lucide-react';

const Journal = ({ onBack }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [showQuests, setShowQuests] = useState(false);
  const [herosProgram, setHerosProgram] = useState(null);
  const [questProgress, setQuestProgress] = useState({});

  useEffect(() => {
    loadEntries();
    loadHerosProgram();
  }, [user]);

  const loadEntries = () => {
    if (user) {
      const saved = storage.get(`journal_${user.id}`) || [];
      setEntries(saved);
    }
  };

  const loadHerosProgram = () => {
    if (user) {
      const program = storage.get(`heros_${user.id}_program`);
      if (program) {
        setHerosProgram(program);
        setQuestProgress(program.progress || {});
      }
    }
  };

  const toggleQuest = (weekIndex, questIndex) => {
    const questKey = `${weekIndex}-${questIndex}`;
    const newProgress = {
      ...questProgress,
      [questKey]: !questProgress[questKey]
    };
    
    setQuestProgress(newProgress);
    
    // Save to localStorage
    if (herosProgram) {
      storage.set(`heros_${user.id}_program`, {
        ...herosProgram,
        progress: newProgress
      });
    }
  };

  const addEntry = () => {
    if (!newEntry.trim()) return;

    const entry = {
      id: Date.now().toString(),
      content: newEntry,
      timestamp: new Date().toISOString()
    };

    const updated = [entry, ...entries];
    storage.set(`journal_${user.id}`, updated);
    setEntries(updated);
    setNewEntry('');
    setShowAddModal(false);
  };

  const deleteEntry = (id) => {
    if (confirm('Supprimer cette note ?')) {
      const updated = entries.filter(e => e.id !== id);
      storage.set(`journal_${user.id}`, updated);
      setEntries(updated);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate/10 via-cream to-gray-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-slate to-gray-600">
            <BookOpen className="w-6 h-6 text-white icon-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Journal
            </h1>
            <p className="text-sm text-slate/70 dark:text-dark-text/70">
              {showQuests ? 'Tes quêtes Héros' : 'Tes notes et réflexions'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {herosProgram && (
            <button
              onClick={() => setShowQuests(!showQuests)}
              className="p-2 rounded-2xl bg-solar hover:bg-solar/90 transition-colors shadow-lg"
            >
              {showQuests ? (
                <BookOpen className="w-6 h-6 text-white" />
              ) : (
                <Trophy className="w-6 h-6 text-white" />
              )}
            </button>
          )}
          {!showQuests && (
            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 rounded-2xl bg-teal hover:bg-teal/90 transition-colors shadow-lg"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          )}
          <button
            onClick={onBack}
            className="p-2 rounded-2xl hover:bg-slate/10 dark:hover:bg-dark-text/10 transition-colors"
          >
            <X className="w-6 h-6 text-slate dark:text-dark-text" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
        <div className="max-w-2xl mx-auto space-y-4">
          {showQuests && herosProgram ? (
            // Quests View
            <>
              <Card className="bg-solar/10 border-2 border-solar/30">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-solar" />
                  <h3 className="text-lg font-bold text-slate dark:text-dark-text">
                    Programme Héros - 60 jours
                  </h3>
                </div>
                <p className="text-sm text-slate/70 dark:text-dark-text/70">
                  Coche les quêtes accomplies pour suivre ta progression
                </p>
              </Card>

              {herosProgram.programme.map((week, weekIndex) => (
                <Card key={weekIndex}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-solar/20 flex items-center justify-center font-bold text-solar">
                      {week.semaine}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate dark:text-dark-text">
                        {week.focus}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {week.quetes.map((quete, questIndex) => {
                      const questKey = `${weekIndex}-${questIndex}`;
                      const isCompleted = questProgress[questKey];
                      
                      return (
                        <button
                          key={questIndex}
                          onClick={() => toggleQuest(weekIndex, questIndex)}
                          className="w-full flex items-start gap-3 p-3 rounded-xl bg-slate/5 hover:bg-slate/10 transition-colors text-left"
                        >
                          {isCompleted ? (
                            <CheckSquare className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-5 h-5 text-slate/40 flex-shrink-0 mt-0.5" />
                          )}
                          <p className={`text-sm flex-1 ${
                            isCompleted 
                              ? 'text-slate/50 dark:text-dark-text/50 line-through' 
                              : 'text-slate dark:text-dark-text'
                          }`}>
                            {quete}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </>
          ) : (
            // Journal Entries View
            <>
              {entries.length === 0 ? (
                <Card className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-slate/30 dark:text-dark-text/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate dark:text-dark-text mb-2">
                    Ton journal est vide
                  </h3>
                  <p className="text-slate/70 dark:text-dark-text/70 mb-6">
                    Commence à écrire tes pensées et réflexions
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowAddModal(true)}
                  >
                    Ajouter une note
                  </Button>
                </Card>
              ) : (
                entries.map(entry => {
                  // Check if this is a module entry or a personal note
                  const isModuleEntry = entry.type && entry.module;
                  
                  return (
                    <Card key={entry.id} className="relative">
                      {/* Module Banner */}
                      {isModuleEntry && (
                        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-${entry.moduleColor}`} />
                      )}
                      
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Module Label */}
                          {isModuleEntry && (
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-${entry.moduleColor}/10 mb-2`}>
                              <span className={`text-xs font-semibold text-${entry.moduleColor}`}>
                                {entry.module}
                              </span>
                            </div>
                          )}
                          
                          <p className="text-sm text-slate/60 dark:text-dark-text/60 mb-2">
                            {formatDateTime(entry.timestamp)}
                          </p>
                          
                          {/* Content based on type */}
                          {entry.type === 'echo' && (
                            <div className="space-y-2">
                              <div className="p-3 rounded-xl bg-coral/10">
                                <p className="font-semibold text-coral mb-1">Météo émotionnelle</p>
                                <p className="text-sm text-slate dark:text-dark-text">{entry.content.meteo.description}</p>
                              </div>
                              <div className="text-sm text-slate/80 dark:text-dark-text/80">
                                <p className="font-semibold mb-1">Analyse :</p>
                                <p className="mb-1">{entry.content.analyse.schemas}</p>
                                <p className="mb-1">{entry.content.analyse.forces}</p>
                                <p>{entry.content.analyse.alternatives}</p>
                              </div>
                            </div>
                          )}
                          
                          {entry.type === 'heros' && (
                            <div className="space-y-2">
                              <div className="p-3 rounded-xl bg-solar/10">
                                <p className="font-semibold text-solar mb-1">Score de confiance : {entry.content.score}%</p>
                                <p className="text-sm text-slate dark:text-dark-text">{entry.content.commentaire}</p>
                              </div>
                              <p className="text-xs text-slate/60 dark:text-dark-text/60">
                                Programme 60 jours avec {entry.content.programme.length} semaines
                              </p>
                            </div>
                          )}
                          
                          {entry.type === 'oracle' && (
                            <div className="space-y-2">
                              <div className="p-3 rounded-xl bg-solar/10">
                                <p className="font-bold text-solar mb-1">{entry.content.title}</p>
                                <p className="text-xs text-solar/70 mb-2">{entry.content.source}</p>
                                <p className="text-sm text-slate/80 dark:text-dark-text/80 mb-2">{entry.content.story}</p>
                                <p className="text-sm font-medium text-teal dark:text-cyan-400">{entry.content.moral}</p>
                              </div>
                            </div>
                          )}
                          
                          {entry.type === 'identite' && (
                            <div className="p-3 rounded-xl bg-purple-400/10">
                              <p className="font-semibold text-purple-400 mb-2">Mon portrait narratif</p>
                              <p className="text-sm text-slate dark:text-dark-text leading-relaxed">
                                {entry.content.portrait}
                              </p>
                            </div>
                          )}
                          
                          {/* Personal note (no type) */}
                          {!isModuleEntry && (
                            <p className="text-slate dark:text-dark-text whitespace-pre-wrap">
                              {entry.content}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="flex-shrink-0 p-2 rounded-full hover:bg-coral/10 text-coral transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  );
                })
              )}
            </>
          )}
        </div>
      </main>

      {/* Add Entry Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewEntry('');
        }}
        title="Nouvelle note"
      >
        <div className="space-y-4">
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Écris ce que tu penses, ressens, ou ce qui te passe par la tête..."
            className="w-full h-48 px-4 py-3 rounded-2xl border-2 border-slate/20 focus:border-teal focus:outline-none bg-white/50 dark:bg-dark-card/50 resize-none text-slate dark:text-dark-text"
            autoFocus
          />
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowAddModal(false);
                setNewEntry('');
              }}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={addEntry}
              disabled={!newEntry.trim()}
            >
              Sauvegarder
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Journal;
