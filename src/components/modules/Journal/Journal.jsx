import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { storage, formatDateTime } from '../../../utils/helpers';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import { BookOpen, X, Plus, Trash2 } from 'lucide-react';

const Journal = ({ onBack }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState('');

  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = () => {
    if (user) {
      const saved = storage.get(`journal_${user.id}`) || [];
      setEntries(saved);
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
              Tes notes et réflexions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-2xl bg-teal hover:bg-teal/90 transition-colors shadow-lg"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
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
            entries.map(entry => (
              <Card key={entry.id} className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-slate/60 dark:text-dark-text/60 mb-2">
                      {formatDateTime(entry.timestamp)}
                    </p>
                    <p className="text-slate dark:text-dark-text whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="flex-shrink-0 p-2 rounded-full hover:bg-coral/10 text-coral transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))
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
