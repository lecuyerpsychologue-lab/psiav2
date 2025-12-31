import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { callAI } from '../../../utils/ai';
import { storage } from '../../../utils/helpers';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { Heart, X, Cloud, Sun, CloudRain, Wind } from 'lucide-react';

const Echo = ({ onBack }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [situations, setSituations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showEmotionGrid, setShowEmotionGrid] = useState(false);
  const [showStrategyGrid, setShowStrategyGrid] = useState(false);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const emotions = [
    { id: 'colere', label: 'Colère', emoji: '😠', color: 'coral' },
    { id: 'peur', label: 'Peur', emoji: '😰', color: 'purple-400' },
    { id: 'tristesse', label: 'Tristesse', emoji: '😢', color: 'blue-400' },
    { id: 'honte', label: 'Honte', emoji: '😳', color: 'pink-400' },
    { id: 'vide', label: 'Vide', emoji: '😶', color: 'gray-400' },
    { id: 'calme', label: 'Calme', emoji: '😌', color: 'teal' },
    { id: 'joie', label: 'Joie', emoji: '😊', color: 'solar' },
    { id: 'confiance', label: 'Confiance', emoji: '😎', color: 'green-400' }
  ];

  const strategies = [
    { id: 'parler', label: 'Parler', emoji: '💬', color: 'teal' },
    { id: 'musique', label: 'Musique', emoji: '🎵', color: 'purple-400' },
    { id: 'isolement', label: 'Isolement', emoji: '🚪', color: 'gray-400' },
    { id: 'sport', label: 'Sport', emoji: '⚽', color: 'green-400' },
    { id: 'ecrans', label: 'Écrans', emoji: '📱', color: 'blue-400' },
    { id: 'creation', label: 'Création', emoji: '🎨', color: 'coral' },
    { id: 'gratitude', label: 'Gratitude', emoji: '🙏', color: 'solar' },
    { id: 'savourer', label: 'Savourer', emoji: '☕', color: 'orange-400' }
  ];

  useEffect(() => {
    generateSituations();
  }, []);

  const generateSituations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const prompt = `Génère exactement 15 situations uniques pour un adolescent/jeune adulte. 
      
RÈGLES STRICTES:
- Retourne UNIQUEMENT un tableau JSON valide
- Format: ["situation 1", "situation 2", ...]
- Chaque situation doit être une phrase courte et claire (max 15 mots)
- Mix des thèmes: Social, Scolaire, Famille, Avenir, Amour
- Mix des tons: Positif, Négatif, Neutre
- Variété: situations du quotidien, pas trop dramatiques

Exemples:
["Tu reçois un compliment inattendu d'un ami", "Tes parents se disputent à table", "Tu rates un contrôle important"]

Retourne UNIQUEMENT le JSON, aucun texte avant ou après.`;

      const response = await callAI([
        { role: 'user', content: prompt }
      ], 'echo');

      // Parse the response to extract JSON
      let situationsArray;
      try {
        // Try to parse directly
        situationsArray = JSON.parse(response);
      } catch (e) {
        // If that fails, try to extract JSON from the response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          situationsArray = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid response format');
        }
      }

      if (!Array.isArray(situationsArray) || situationsArray.length !== 15) {
        throw new Error('Invalid number of situations');
      }

      setSituations(situationsArray);
    } catch (error) {
      console.error('Error generating situations:', error);
      setError('Erreur lors de la génération des situations. Utilisation de situations par défaut.');
      
      // Fallback situations
      setSituations([
        "Tu reçois un compliment inattendu d'un ami",
        "Tes parents se disputent à table",
        "Tu rates un contrôle important",
        "Quelqu'un te laisse de côté dans un groupe",
        "Tu réussis quelque chose dont tu es fier(e)",
        "On te fait une remarque blessante sur ton apparence",
        "Tu passes une super soirée avec tes amis",
        "Tu ne sais pas quoi faire après tes études",
        "Quelqu'un que tu aimes ne répond pas à tes messages",
        "Tu découvres une nouvelle passion",
        "Tes parents comparent tes résultats à ceux d'un autre",
        "Tu te sens différent(e) des autres",
        "On te fait confiance pour quelque chose d'important",
        "Tu as peur de décevoir quelqu'un",
        "Tu vis un moment de calme et de paix"
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVecu = (vecu) => {
    if (vecu) {
      setCurrentResponse({
        situation: situations[currentIndex],
        vecu: true,
        emotion: null,
        strategy: null
      });
      setShowEmotionGrid(true);
    } else {
      // Not experienced, move to next
      setResponses([...responses, {
        situation: situations[currentIndex],
        vecu: false
      }]);
      
      if (currentIndex < situations.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        generateAnalysis([...responses, {
          situation: situations[currentIndex],
          vecu: false
        }]);
      }
    }
  };

  const handleEmotionSelect = (emotionId) => {
    setCurrentResponse({
      ...currentResponse,
      emotion: emotionId
    });
    setShowEmotionGrid(false);
    setShowStrategyGrid(true);
  };

  const handleStrategySelect = (strategyId) => {
    const completeResponse = {
      ...currentResponse,
      strategy: strategyId
    };
    
    const updatedResponses = [...responses, completeResponse];
    setResponses(updatedResponses);
    setCurrentResponse(null);
    setShowStrategyGrid(false);
    
    if (currentIndex < situations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      generateAnalysis(updatedResponses);
    }
  };

  const generateAnalysis = async (finalResponses) => {
    setLoading(true);
    
    try {
      // Filter only experienced situations
      const experiencedResponses = finalResponses.filter(r => r.vecu);
      
      const emotionCounts = {};
      const strategyCounts = {};
      const patterns = [];
      
      experiencedResponses.forEach(r => {
        if (r.emotion) {
          emotionCounts[r.emotion] = (emotionCounts[r.emotion] || 0) + 1;
        }
        if (r.strategy) {
          strategyCounts[r.strategy] = (strategyCounts[r.strategy] || 0) + 1;
        }
        if (r.emotion && r.strategy) {
          patterns.push({ emotion: r.emotion, strategy: r.strategy, situation: r.situation });
        }
      });

      const prompt = `Analyse ces réponses d'un adolescent/jeune adulte sur ses expériences émotionnelles:

Nombre de situations vécues: ${experiencedResponses.length}/15

Émotions principales:
${Object.entries(emotionCounts).map(([e, c]) => `- ${e}: ${c} fois`).join('\n')}

Stratégies utilisées:
${Object.entries(strategyCounts).map(([s, c]) => `- ${s}: ${c} fois`).join('\n')}

Patterns identifiés:
${patterns.slice(0, 5).map(p => `- Situation: "${p.situation}" → Émotion: ${p.emotion} → Stratégie: ${p.strategy}`).join('\n')}

Génère UNE SEULE réponse JSON avec EXACTEMENT cette structure:
{
  "meteo": {
    "description": "Métaphore météo en 1 phrase (ex: 'Ta météo intérieure montre un grand Soleil avec passages nuageux')",
    "icon": "sun|cloud|rain|wind"
  },
  "analyse": {
    "schemas": "Identifie 1-2 patterns principaux en 2 phrases max",
    "forces": "Valide 1-2 stratégies fonctionnelles en 2 phrases max",
    "alternatives": "Propose 1-2 alternatives constructives en 2 phrases max"
  }
}

RETOURNE UNIQUEMENT LE JSON, rien d'autre.`;

      const response = await callAI([
        { role: 'user', content: prompt }
      ], 'echo');

      let analysisData;
      try {
        analysisData = JSON.parse(response);
      } catch (e) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid analysis format');
        }
      }

      setAnalysis(analysisData);
      
      // Save to localStorage
      storage.set(`echo_${user.id}_last`, {
        date: new Date().toISOString(),
        responses: finalResponses,
        analysis: analysisData
      });
      
    } catch (error) {
      console.error('Error generating analysis:', error);
      setError('Erreur lors de l\'analyse. Merci d\'avoir complété le module.');
      setAnalysis({
        meteo: {
          description: "Ta météo intérieure est complexe et changeante, comme pour nous tous.",
          icon: "cloud"
        },
        analyse: {
          schemas: "Tu as partagé tes expériences avec honnêteté.",
          forces: "Continue d'observer tes émotions et tes réactions.",
          alternatives: "N'hésite pas à essayer de nouvelles stratégies quand tu en ressens le besoin."
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (icon) => {
    switch (icon) {
      case 'sun':
        return <Sun className="w-16 h-16 text-solar" />;
      case 'rain':
        return <CloudRain className="w-16 h-16 text-blue-400" />;
      case 'wind':
        return <Wind className="w-16 h-16 text-teal" />;
      default:
        return <Cloud className="w-16 h-16 text-slate/50" />;
    }
  };

  const restart = () => {
    setSituations([]);
    setCurrentIndex(0);
    setResponses([]);
    setShowEmotionGrid(false);
    setShowStrategyGrid(false);
    setCurrentResponse(null);
    setAnalysis(null);
    setError(null);
    setSaveSuccess(false);
    generateSituations();
  };

  const saveToJournal = () => {
    if (!analysis) return;

    const journalEntry = {
      id: Date.now().toString(),
      type: 'echo',
      module: 'Écho',
      moduleColor: 'coral',
      content: {
        meteo: analysis.meteo,
        analyse: analysis.analyse,
        situationsCount: responses.filter(r => r.vecu).length
      },
      timestamp: new Date().toISOString()
    };

    const existing = storage.get(`journal_${user.id}`) || [];
    const updated = [journalEntry, ...existing];
    storage.set(`journal_${user.id}`, updated);
    setSaveSuccess(true);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Loading screen
  if (loading && situations.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-coral/20 via-cream to-pink-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg">
        <div className="text-center max-w-md px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-coral to-pink-400 animate-pulse">
            <Heart className="w-10 h-10 text-white icon-glow" />
          </div>
          <h2 className="text-2xl font-bold text-slate dark:text-dark-text mb-2">
            Génération des situations...
          </h2>
          <p className="text-slate/70 dark:text-dark-text/70">
            L'IA prépare 15 situations uniques pour toi
          </p>
        </div>
      </div>
    );
  }

  // Analysis screen
  if (analysis) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-coral/20 via-cream to-pink-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
        <header className="flex-shrink-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-coral to-pink-400">
              <Heart className="w-6 h-6 text-white icon-glow" />
            </div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Ton Analyse
            </h1>
          </div>
          <button
            onClick={onBack}
            className="p-2 rounded-2xl hover:bg-slate/10 dark:hover:bg-dark-text/10 transition-colors"
          >
            <X className="w-6 h-6 text-slate dark:text-dark-text" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Météo Émotionnelle */}
            <Card className="text-center border-2 border-coral/30">
              <div className="flex justify-center mb-4">
                {getWeatherIcon(analysis.meteo.icon)}
              </div>
              <h3 className="text-xl font-bold text-slate dark:text-dark-text mb-2">
                Ta Météo Émotionnelle
              </h3>
              <p className="text-lg text-coral">
                {analysis.meteo.description}
              </p>
            </Card>

            {/* Analyse Fonctionnelle */}
            <Card>
              <h3 className="text-lg font-bold text-slate dark:text-dark-text mb-4">
                📊 Analyse Fonctionnelle
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-coral mb-2">
                    🔍 Tes schémas
                  </h4>
                  <p className="text-slate/80 dark:text-dark-text/80">
                    {analysis.analyse.schemas}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-teal mb-2">
                    💪 Tes forces
                  </h4>
                  <p className="text-slate/80 dark:text-dark-text/80">
                    {analysis.analyse.forces}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-solar mb-2">
                    ✨ Alternatives
                  </h4>
                  <p className="text-slate/80 dark:text-dark-text/80">
                    {analysis.analyse.alternatives}
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={restart}
              >
                Recommencer
              </Button>
              <Button
                variant="coral"
                className="flex-1"
                onClick={onBack}
              >
                Retour au Dashboard
              </Button>
            </div>

            {/* Save to Journal Button */}
            <Button
              variant="coral"
              className="w-full"
              onClick={saveToJournal}
              disabled={saveSuccess}
            >
              {saveSuccess ? '✓ Enregistré dans le Journal' : '💾 Enregistrer dans mon journal'}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Emotion grid
  if (showEmotionGrid) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-coral/20 via-cream to-pink-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
        <header className="flex-shrink-0 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-slate dark:text-dark-text">
              Carte {currentIndex + 1}/15
            </div>
            <div className="text-sm font-medium text-coral">
              {Math.round(((currentIndex + 1) / 15) * 100)}%
            </div>
          </div>
          <div className="w-full h-2 bg-slate/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-coral to-pink-400 transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / 15) * 100}%` }}
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          <div className="max-w-2xl mx-auto">
            <Card className="mb-6 bg-coral/10 border-2 border-coral/30">
              <p className="text-center text-slate dark:text-dark-text text-lg">
                "{currentResponse.situation}"
              </p>
            </Card>

            <h3 className="text-xl font-bold text-slate dark:text-dark-text mb-4 text-center">
              Quelle émotion as-tu ressenti ?
            </h3>

            <div className="grid grid-cols-4 gap-3">
              {emotions.map(emotion => (
                <button
                  key={emotion.id}
                  onClick={() => handleEmotionSelect(emotion.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/80 hover:bg-coral/20 border-2 border-transparent hover:border-coral transition-all active:scale-95"
                >
                  <div className="text-3xl">{emotion.emoji}</div>
                  <span className="text-xs font-medium text-slate dark:text-dark-text">
                    {emotion.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Strategy grid
  if (showStrategyGrid) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-coral/20 via-cream to-pink-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
        <header className="flex-shrink-0 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-slate dark:text-dark-text">
              Carte {currentIndex + 1}/15
            </div>
            <div className="text-sm font-medium text-coral">
              {Math.round(((currentIndex + 1) / 15) * 100)}%
            </div>
          </div>
          <div className="w-full h-2 bg-slate/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-coral to-pink-400 transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / 15) * 100}%` }}
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          <div className="max-w-2xl mx-auto">
            <Card className="mb-6 bg-coral/10 border-2 border-coral/30">
              <p className="text-center text-slate dark:text-dark-text text-lg">
                "{currentResponse.situation}"
              </p>
            </Card>

            <h3 className="text-xl font-bold text-slate dark:text-dark-text mb-4 text-center">
              Quelle stratégie as-tu utilisé ?
            </h3>

            <div className="grid grid-cols-4 gap-3">
              {strategies.map(strategy => (
                <button
                  key={strategy.id}
                  onClick={() => handleStrategySelect(strategy.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/80 hover:bg-coral/20 border-2 border-transparent hover:border-coral transition-all active:scale-95"
                >
                  <div className="text-3xl">{strategy.emoji}</div>
                  <span className="text-xs font-medium text-slate dark:text-dark-text">
                    {strategy.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Situation card
  if (situations.length > 0 && currentIndex < situations.length) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-coral/20 via-cream to-pink-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
        <header className="flex-shrink-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-coral to-pink-400">
              <Heart className="w-6 h-6 text-white icon-glow" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
                Écho
              </h1>
              <p className="text-sm text-slate/70 dark:text-dark-text/70">
                Jeu de situation
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

        <div className="flex-shrink-0 px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-slate dark:text-dark-text">
              Carte {currentIndex + 1}/15
            </div>
            <div className="text-sm font-medium text-coral">
              {Math.round(((currentIndex + 1) / 15) * 100)}%
            </div>
          </div>
          <div className="w-full h-2 bg-slate/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-coral to-pink-400 transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / 15) * 100}%` }}
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide flex items-center">
          <div className="w-full max-w-2xl mx-auto">
            {error && (
              <Card className="mb-4 bg-orange-100 border-2 border-orange-300">
                <p className="text-sm text-orange-800">{error}</p>
              </Card>
            )}
            
            <Card className="border-2 border-coral/30 shadow-xl mb-8 transform transition-all duration-300 animate-in">
              <div className="text-center py-12">
                <p className="text-2xl font-medium text-slate dark:text-dark-text leading-relaxed">
                  {situations[currentIndex]}
                </p>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 text-lg py-6"
                onClick={() => handleVecu(false)}
              >
                Pas vécu
              </Button>
              <Button
                variant="coral"
                className="flex-1 text-lg py-6"
                onClick={() => handleVecu(true)}
              >
                ✓ Vécu
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default Echo;
