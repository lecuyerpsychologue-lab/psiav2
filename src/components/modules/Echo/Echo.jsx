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
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [situationReactions, setSituationReactions] = useState([]);
  const [selectedReactions, setSelectedReactions] = useState([]);

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
      const prompt = `Génère exactement 15 situations uniques pour un adolescent/jeune adulte avec leurs 6 réactions possibles.

RÈGLES STRICTES:
- Retourne UNIQUEMENT un tableau JSON valide
- Format: 
[
  {
    "situation": "phrase courte et claire (max 15 mots)",
    "reactions": [
      "Réaction 1 (fonctionnelle ou dysfonctionnelle)",
      "Réaction 2",
      "Réaction 3",
      "Réaction 4",
      "Réaction 5",
      "Réaction 6"
    ]
  }
]
- Chaque situation doit avoir EXACTEMENT 6 réactions
- Mix des réactions : 3 fonctionnelles (adaptées, saines) et 3 dysfonctionnelles (évitement, rumination, etc.)
- Mix des thèmes: Social, Scolaire, Famille, Avenir, Amour
- Mix des tons: Positif, Négatif, Neutre
- Variété: situations du quotidien, pas trop dramatiques

Exemples de réactions fonctionnelles: "J'en parle à quelqu'un de confiance", "Je prends du recul et je respire", "J'accepte ce que je ressens"
Exemples de réactions dysfonctionnelles: "Je me coupe des autres", "Je rumine en boucle", "Je me dis que c'est de ma faute"

Retourne UNIQUEMENT le JSON, aucun texte avant ou après.`;

      const response = await callAI([
        { role: 'user', content: prompt }
      ], 'echo');

      let situationsArray;
      try {
        situationsArray = JSON.parse(response);
      } catch (e) {
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

      // Verify each situation has 6 reactions
      const validSituations = situationsArray.every(s => 
        s.situation && Array.isArray(s.reactions) && s.reactions.length === 6
      );

      if (!validSituations) {
        throw new Error('Invalid situation format');
      }

      setSituations(situationsArray);
    } catch (error) {
      console.error('Error generating situations:', error);
      setError('Erreur lors de la génération des situations. Utilisation de situations par défaut.');
      
      // Fallback situations with reactions
      setSituations([
        {
          situation: "Tu reçois un compliment inattendu d'un ami",
          reactions: [
            "Je le remercie et j'apprécie le moment",
            "Je minimise en disant que ce n'est rien",
            "Je me demande s'il est sincère",
            "Je me sens bien et confiant(e)",
            "Je change vite de sujet",
            "Je pense qu'il veut quelque chose en retour"
          ]
        },
        {
          situation: "Tes parents se disputent à table",
          reactions: [
            "Je quitte la pièce discrètement",
            "J'essaie de détendre l'atmosphère",
            "Je me sens coupable",
            "Je me coupe émotionnellement",
            "J'en parle après à quelqu'un",
            "Je monte le son dans mes écouteurs"
          ]
        },
        {
          situation: "Tu rates un contrôle important",
          reactions: [
            "Je me dis que c'est la fin du monde",
            "J'analyse ce qui n'a pas marché",
            "Je me dis que je suis nul(le)",
            "J'en parle à un ami pour me rassurer",
            "Je rumine pendant des jours",
            "Je me fixe un plan pour m'améliorer"
          ]
        },
        {
          situation: "Quelqu'un te laisse de côté dans un groupe",
          reactions: [
            "Je me dis que personne ne m'aime",
            "Je cherche à comprendre pourquoi",
            "Je fais comme si ça m'était égal",
            "Je me ferme aux autres",
            "J'exprime calmement ce que je ressens",
            "Je trouve un autre groupe où me sentir bien"
          ]
        },
        {
          situation: "Tu réussis quelque chose dont tu es fier(e)",
          reactions: [
            "Je le partage avec mes proches",
            "Je minimise ma réussite",
            "Je savoure ce moment de fierté",
            "Je me dis que c'était facile",
            "Je m'inquiète déjà de la prochaine fois",
            "Je célèbre cette victoire"
          ]
        },
        {
          situation: "On te fait une remarque blessante sur ton apparence",
          reactions: [
            "Je rumine la remarque pendant des jours",
            "Je réponds calmement que ça me blesse",
            "Je me coupe de cette personne",
            "J'en parle à quelqu'un de confiance",
            "Je me dis que c'est vrai",
            "Je remets en perspective l'importance de ça"
          ]
        },
        {
          situation: "Tu passes une super soirée avec tes amis",
          reactions: [
            "Je profite pleinement du moment",
            "Je me demande quand ça va mal tourner",
            "Je me sens reconnaissant(e)",
            "Je prends des photos pour me souvenir",
            "J'ai peur que ça ne se reproduise pas",
            "Je savoure sans trop penser"
          ]
        },
        {
          situation: "Tu ne sais pas quoi faire après tes études",
          reactions: [
            "Je panique et je me sens perdu(e)",
            "J'en parle avec des personnes de confiance",
            "Je me dis que je vais rater ma vie",
            "Je prends le temps d'explorer mes options",
            "Je fuis en me distrayant constamment",
            "Je me fais confiance pour trouver ma voie"
          ]
        },
        {
          situation: "Quelqu'un que tu aimes ne répond pas à tes messages",
          reactions: [
            "J'imagine le pire scénario",
            "Je me dis qu'il/elle a peut-être une bonne raison",
            "Je lui envoie 10 messages de plus",
            "Je prends du recul et j'attends",
            "Je me dis que je l'ai fait fuir",
            "Je fais autre chose en attendant"
          ]
        },
        {
          situation: "Tu découvres une nouvelle passion",
          reactions: [
            "Je m'y plonge complètement",
            "Je me demande si je serai assez bon(ne)",
            "Je partage mon enthousiasme",
            "Je m'empêche d'être trop enthousiaste",
            "Je me lance sans me juger",
            "J'ai peur de décevoir si j'essaie"
          ]
        },
        {
          situation: "Tes parents comparent tes résultats à ceux d'un autre",
          reactions: [
            "Je me sens blessé(e) et incompris(e)",
            "J'explique calmement ce que je ressens",
            "Je me dis que je ne serai jamais assez bien",
            "Je prends du recul sur leur attente",
            "Je me ferme émotionnellement",
            "Je me concentre sur mes propres progrès"
          ]
        },
        {
          situation: "Tu te sens différent(e) des autres",
          reactions: [
            "Je vois ça comme une force unique",
            "Je me sens seul(e) et isolé(e)",
            "J'essaie de me conformer aux autres",
            "J'accepte ma singularité",
            "Je me cache pour ne pas être vu(e)",
            "Je cherche des personnes qui me ressemblent"
          ]
        },
        {
          situation: "On te fait confiance pour quelque chose d'important",
          reactions: [
            "Je me sens fier(e) et motivé(e)",
            "Je panique à l'idée de décevoir",
            "Je doute de mes capacités",
            "Je me prépare du mieux possible",
            "Je me dis que je ne mérite pas cette confiance",
            "Je vois ça comme une opportunité"
          ]
        },
        {
          situation: "Tu as peur de décevoir quelqu'un",
          reactions: [
            "J'en parle ouvertement avec la personne",
            "Je me mets une pression énorme",
            "J'évite la situation",
            "Je me rappelle que l'erreur est humaine",
            "Je rumine sans agir",
            "Je fais de mon mieux et j'accepte le résultat"
          ]
        },
        {
          situation: "Tu vis un moment de calme et de paix",
          reactions: [
            "Je savoure pleinement ce moment",
            "Je m'inquiète que ça ne dure pas",
            "Je me sens reconnaissant(e)",
            "Je pense déjà à ce qui m'attend après",
            "Je reste dans l'instant présent",
            "Je me demande si je mérite ce calme"
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVecu = (vecu) => {
    if (vecu) {
      setCurrentResponse({
        situation: situations[currentIndex].situation,
        vecu: true,
        emotions: [],
        reactions: []
      });
      setSelectedEmotions([]);
      setSituationReactions(situations[currentIndex].reactions);
      setShowEmotionGrid(true);
    } else {
      // Not experienced, move to next
      setResponses([...responses, {
        situation: situations[currentIndex].situation,
        vecu: false
      }]);
      
      if (currentIndex < situations.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        generateAnalysis([...responses, {
          situation: situations[currentIndex].situation,
          vecu: false
        }]);
      }
    }
  };

  const toggleEmotion = (emotionId) => {
    if (selectedEmotions.includes(emotionId)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotionId));
    } else {
      if (selectedEmotions.length < 8) {
        setSelectedEmotions([...selectedEmotions, emotionId]);
      }
    }
  };

  const handleEmotionsContinue = () => {
    if (selectedEmotions.length === 0) return;
    
    setCurrentResponse({
      ...currentResponse,
      emotions: selectedEmotions
    });
    setShowEmotionGrid(false);
    setSelectedReactions([]);
    setShowStrategyGrid(true);
  };

  const toggleReaction = (reactionIndex) => {
    if (selectedReactions.includes(reactionIndex)) {
      setSelectedReactions(selectedReactions.filter(r => r !== reactionIndex));
    } else {
      setSelectedReactions([...selectedReactions, reactionIndex]);
    }
  };

  const handleReactionsContinue = () => {
    if (selectedReactions.length === 0) return;
    
    const completeResponse = {
      ...currentResponse,
      reactions: selectedReactions.map(idx => situationReactions[idx])
    };
    
    const updatedResponses = [...responses, completeResponse];
    setResponses(updatedResponses);
    setCurrentResponse(null);
    setShowStrategyGrid(false);
    setSelectedEmotions([]);
    setSelectedReactions([]);
    setSituationReactions([]);
    
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
      const reactionsList = [];
      
      experiencedResponses.forEach(r => {
        if (r.emotions) {
          r.emotions.forEach(emotion => {
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
          });
        }
        if (r.reactions) {
          r.reactions.forEach(reaction => {
            reactionsList.push({ situation: r.situation, reaction });
          });
        }
      });

      const prompt = `Analyse ces réponses d'un adolescent/jeune adulte sur ses expériences émotionnelles:

Nombre de situations vécues: ${experiencedResponses.length}/15

Émotions ressenties (classées par fréquence):
${Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]).map(([e, c]) => `- ${e}: ${c} fois`).join('\n')}

Réactions choisies (exemples):
${reactionsList.slice(0, 10).map(p => `- "${p.situation}" → "${p.reaction}"`).join('\n')}

Génère UNE SEULE réponse JSON avec EXACTEMENT cette structure:
{
  "meteo": {
    "description": "Métaphore météo en 1 phrase (ex: 'Ta météo intérieure montre un grand Soleil avec passages nuageux')",
    "icon": "sun|cloud|rain|wind"
  },
  "analyse": {
    "schemas": "Identifie les patterns principaux dans ses émotions et réactions. Identifie spécifiquement les réactions fonctionnelles (adaptées) et dysfonctionnelles (évitement, rumination). 2-3 phrases max.",
    "forces": "Valide et encourage les stratégies fonctionnelles repérées. 2 phrases max.",
    "alternatives": "Propose 1-2 alternatives constructives pour remplacer les réactions dysfonctionnelles. 2 phrases max, ton bienveillant."
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
    setSelectedEmotions([]);
    setSituationReactions([]);
    setSelectedReactions([]);
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

            <h3 className="text-xl font-bold text-slate dark:text-dark-text mb-2 text-center">
              Quelles émotions as-tu ressenties ?
            </h3>
            <p className="text-sm text-slate/70 dark:text-dark-text/70 mb-4 text-center">
              Sélectionne 1 à 8 émotions ({selectedEmotions.length} sélectionnées)
            </p>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {emotions.map(emotion => {
                const isSelected = selectedEmotions.includes(emotion.id);
                return (
                  <button
                    key={emotion.id}
                    onClick={() => toggleEmotion(emotion.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/80 border-2 transition-all active:scale-95 ${
                      isSelected 
                        ? 'border-coral bg-coral/20 shadow-lg' 
                        : 'border-transparent hover:border-coral hover:bg-coral/10'
                    }`}
                  >
                    <div className="text-3xl">{emotion.emoji}</div>
                    <span className="text-xs font-medium text-slate dark:text-dark-text">
                      {emotion.label}
                    </span>
                    {isSelected && <div className="w-2 h-2 bg-coral rounded-full" />}
                  </button>
                );
              })}
            </div>

            <Button
              variant="coral"
              className="w-full"
              onClick={handleEmotionsContinue}
              disabled={selectedEmotions.length === 0}
            >
              Continuer
            </Button>
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

            <h3 className="text-xl font-bold text-slate dark:text-dark-text mb-2 text-center">
              Comment réagirais-tu ?
            </h3>
            <p className="text-sm text-slate/70 dark:text-dark-text/70 mb-4 text-center">
              Sélectionne les réactions qui te correspondent ({selectedReactions.length} sélectionnées)
            </p>

            <div className="space-y-3 mb-6">
              {situationReactions.map((reaction, index) => {
                const isSelected = selectedReactions.includes(index);
                return (
                  <button
                    key={index}
                    onClick={() => toggleReaction(index)}
                    className={`w-full p-4 rounded-2xl text-left border-2 transition-all active:scale-98 ${
                      isSelected 
                        ? 'border-coral bg-coral/20 shadow-lg' 
                        : 'border-transparent bg-white/80 hover:border-coral hover:bg-coral/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-coral bg-coral' : 'border-slate/30'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <p className="text-sm font-medium text-slate dark:text-dark-text flex-1">
                        {reaction}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              variant="coral"
              className="w-full"
              onClick={handleReactionsContinue}
              disabled={selectedReactions.length === 0}
            >
              Continuer
            </Button>
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
                  {situations[currentIndex].situation}
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
