import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { callAI } from '../../../utils/ai';
import { storage } from '../../../utils/helpers';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { Trophy, X, ChevronDown, ChevronUp } from 'lucide-react';

const Heros = ({ onBack }) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState([0]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const questions = [
    // Rosenberg Self-Esteem Scale + 4 pillars
    { id: 1, text: "Je pense que je suis une personne de valeur", pillar: "Connaissance" },
    { id: 2, text: "Je pense que je possède un certain nombre de qualités", pillar: "Connaissance" },
    { id: 3, text: "Tout bien considéré, je suis porté(e) à me considérer comme un(e) raté(e)", pillar: "Connaissance", reverse: true },
    { id: 4, text: "Je suis capable de faire les choses aussi bien que la plupart des gens", pillar: "Compétence" },
    { id: 5, text: "Je sens que je n'ai pas grand-chose dont je peux être fier(e)", pillar: "Compétence", reverse: true },
    { id: 6, text: "J'ai une attitude positive envers moi-même", pillar: "Connaissance" },
    { id: 7, text: "Dans l'ensemble, je suis satisfait(e) de moi", pillar: "Connaissance" },
    { id: 8, text: "J'aimerais avoir plus de respect pour moi-même", pillar: "Connaissance", reverse: true },
    { id: 9, text: "Parfois, je me sens vraiment inutile", pillar: "Compétence", reverse: true },
    { id: 10, text: "Il m'arrive de penser que je suis bon(ne) à rien", pillar: "Compétence", reverse: true },
    { id: 11, text: "Je me sens en sécurité dans mes relations", pillar: "Sécurité" },
    { id: 12, text: "Je me sens accepté(e) par mon entourage", pillar: "Appartenance" },
    { id: 13, text: "Je sais que je peux compter sur certaines personnes", pillar: "Sécurité" },
    { id: 14, text: "J'ai ma place dans un groupe d'amis", pillar: "Appartenance" },
    { id: 15, text: "Je connais mes forces et mes faiblesses", pillar: "Connaissance" },
    { id: 16, text: "Je me sens capable de relever les défis", pillar: "Compétence" },
    { id: 17, text: "Je me sens souvent seul(e) même entouré(e)", pillar: "Appartenance", reverse: true },
    { id: 18, text: "Je fais confiance à mon jugement", pillar: "Compétence" },
    { id: 19, text: "J'ose exprimer mes opinions", pillar: "Sécurité" },
    { id: 20, text: "Je me sens légitime d'exister tel(le) que je suis", pillar: "Connaissance" }
  ];

  const likertOptions = [
    { value: 1, label: "Pas du tout d'accord" },
    { value: 2, label: "Plutôt pas d'accord" },
    { value: 3, label: "Plutôt d'accord" },
    { value: 4, label: "Tout à fait d'accord" }
  ];

  const handleAnswer = (value) => {
    const question = questions[currentQuestion];
    const score = question.reverse ? (5 - value) : value;
    
    setAnswers({
      ...answers,
      [question.id]: { value, score, pillar: question.pillar }
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateResults({
        ...answers,
        [question.id]: { value, score, pillar: question.pillar }
      });
    }
  };

  const calculateScore = (answersData) => {
    let total = 0;
    Object.values(answersData).forEach(answer => {
      total += answer.score;
    });
    return Math.round((total / (questions.length * 4)) * 100);
  };

  const generateResults = async (finalAnswers) => {
    setLoading(true);
    
    try {
      const score = calculateScore(finalAnswers);
      
      // Calculate pillar scores
      const pillarScores = {
        'Compétence': [],
        'Sécurité': [],
        'Appartenance': [],
        'Connaissance': []
      };
      
      Object.values(finalAnswers).forEach(answer => {
        pillarScores[answer.pillar].push(answer.score);
      });
      
      const pillarAverages = {};
      Object.keys(pillarScores).forEach(pillar => {
        const scores = pillarScores[pillar];
        pillarAverages[pillar] = Math.round(
          (scores.reduce((a, b) => a + b, 0) / (scores.length * 4)) * 100
        );
      });

      const prompt = `Un adolescent/jeune adulte a complété un test d'estime de soi.

Score global: ${score}/100

Scores par pilier:
- Compétence: ${pillarAverages['Compétence']}/100
- Sécurité: ${pillarAverages['Sécurité']}/100
- Appartenance: ${pillarAverages['Appartenance']}/100
- Connaissance de soi: ${pillarAverages['Connaissance']}/100

Génère UNE SEULE réponse JSON avec EXACTEMENT cette structure:
{
  "commentaire": "Commentaire encourageant de ~20 mots sur l'estime de soi",
  "programme": [
    {
      "semaine": 1,
      "focus": "Thème de la semaine (ex: 'Découvre tes forces')",
      "quetes": [
        "Quête 1: action minuscule et réalisable",
        "Quête 2: action minuscule et réalisable",
        "Quête 3: action minuscule et réalisable"
      ]
    }
  ]
}

RÈGLES IMPORTANTES:
- Le programme DOIT contenir exactement 8 semaines
- Chaque semaine DOIT avoir 1 focus et exactement 3 quêtes
- Les quêtes doivent être MINUSCULES et RÉALISABLES (ex: "Complimente-toi devant le miroir", "Liste 3 choses que tu fais bien")
- Adapter au score et aux piliers faibles
- Ton motivant mais pas condescendant

RETOURNE UNIQUEMENT LE JSON, rien d'autre.`;

      const response = await callAI([
        { role: 'user', content: prompt }
      ], 'heros');

      let resultsData;
      try {
        resultsData = JSON.parse(response);
      } catch (e) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          resultsData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid results format');
        }
      }

      // Ensure 8 weeks
      if (!resultsData.programme || resultsData.programme.length !== 8) {
        throw new Error('Invalid program structure');
      }

      const finalResults = {
        score,
        pillarScores: pillarAverages,
        commentaire: resultsData.commentaire,
        programme: resultsData.programme,
        date: new Date().toISOString()
      };

      setResults(finalResults);
      
      // Save to localStorage
      storage.set(`heros_${user.id}_results`, finalResults);
      storage.set(`heros_${user.id}_program`, {
        programme: resultsData.programme,
        date: new Date().toISOString(),
        progress: {} // Will track completed quests
      });
      
    } catch (error) {
      console.error('Error generating results:', error);
      
      // Fallback results
      const score = calculateScore(finalAnswers);
      setResults({
        score,
        pillarScores: {},
        commentaire: "Tu as pris le temps de mieux te connaître, c'est un premier pas important.",
        programme: generateFallbackProgram(),
        date: new Date().toISOString()
      });
      
      storage.set(`heros_${user.id}_results`, {
        score,
        commentaire: "Tu as pris le temps de mieux te connaître, c'est un premier pas important.",
        programme: generateFallbackProgram(),
        date: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackProgram = () => {
    return [
      {
        semaine: 1,
        focus: "Découvre tes forces",
        quetes: [
          "Liste 3 choses que tu fais bien",
          "Demande à un ami ce qu'il apprécie chez toi",
          "Note une réussite de ta journée"
        ]
      },
      {
        semaine: 2,
        focus: "Prends soin de toi",
        quetes: [
          "Fais une activité que tu aimes pendant 15 minutes",
          "Complimente-toi devant le miroir",
          "Dis 'non' à quelque chose qui ne te convient pas"
        ]
      },
      {
        semaine: 3,
        focus: "Connecte avec les autres",
        quetes: [
          "Envoie un message gentil à quelqu'un",
          "Partage un moment avec un proche",
          "Rejoins une conversation de groupe"
        ]
      },
      {
        semaine: 4,
        focus: "Défis minuscules",
        quetes: [
          "Essaie une nouvelle activité pendant 5 minutes",
          "Lève la main en classe",
          "Commence une tâche que tu reportes"
        ]
      },
      {
        semaine: 5,
        focus: "Gratitude et positif",
        quetes: [
          "Note 3 choses positives de ta journée",
          "Remercie quelqu'un",
          "Célèbre une petite victoire"
        ]
      },
      {
        semaine: 6,
        focus: "Corps et énergie",
        quetes: [
          "Fais 5 minutes d'exercice",
          "Dors 30 minutes plus tôt",
          "Mange un repas en pleine conscience"
        ]
      },
      {
        semaine: 7,
        focus: "Expression et créativité",
        quetes: [
          "Dessine ou écris pendant 10 minutes",
          "Exprime une émotion à quelqu'un",
          "Écoute une musique qui te fait du bien"
        ]
      },
      {
        semaine: 8,
        focus: "Vision d'avenir",
        quetes: [
          "Imagine une journée idéale dans 1 an",
          "Note un objectif petit mais important",
          "Fais un pas vers cet objectif"
        ]
      }
    ];
  };

  const toggleWeek = (weekIndex) => {
    if (expandedWeeks.includes(weekIndex)) {
      setExpandedWeeks(expandedWeeks.filter(w => w !== weekIndex));
    } else {
      setExpandedWeeks([...expandedWeeks, weekIndex]);
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    setExpandedWeeks([0]);
    setSaveSuccess(false);
  };

  const saveToJournal = () => {
    if (!results) return;

    const journalEntry = {
      id: Date.now().toString(),
      type: 'heros',
      module: 'Héros',
      moduleColor: 'solar',
      content: {
        score: results.score,
        commentaire: results.commentaire,
        programme: results.programme
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
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-solar/30 via-cream to-orange-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg">
        <div className="text-center max-w-md px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-solar to-orange-400 animate-pulse">
            <Trophy className="w-10 h-10 text-white icon-glow" />
          </div>
          <h2 className="text-2xl font-bold text-slate dark:text-dark-text mb-2">
            Génération de ton programme...
          </h2>
          <p className="text-slate/70 dark:text-dark-text/70">
            L'IA crée ton programme personnalisé de 60 jours
          </p>
        </div>
      </div>
    );
  }

  // Results screen
  if (results) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-solar/30 via-cream to-orange-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
        <header className="flex-shrink-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-solar to-orange-400">
              <Trophy className="w-6 h-6 text-white icon-glow" />
            </div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Tes Résultats
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
            {/* Confidence Gauge */}
            <Card className="text-center">
              <h3 className="text-lg font-bold text-slate dark:text-dark-text mb-4">
                🎯 Ta Jauge de Confiance
              </h3>
              
              <div className="relative w-full h-8 bg-slate/10 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-solar to-orange-400 transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                  style={{ width: `${results.score}%` }}
                >
                  <span className="text-white font-bold text-sm">
                    {results.score}%
                  </span>
                </div>
              </div>

              <p className="text-slate/80 dark:text-dark-text/80">
                {results.commentaire}
              </p>
            </Card>

            {/* 60-Day Program */}
            <Card>
              <h3 className="text-lg font-bold text-slate dark:text-dark-text mb-2">
                🗓️ Ton Programme 60 Jours (8 semaines)
              </h3>
              <p className="text-sm text-slate/70 dark:text-dark-text/70 mb-4">
                Chaque semaine, un focus et 3 quêtes pour grandir pas à pas
              </p>

              <div className="space-y-3">
                {results.programme.map((week, index) => (
                  <div key={index} className="border-2 border-slate/10 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleWeek(index)}
                      className="w-full p-4 flex items-center justify-between hover:bg-slate/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-solar/20 flex items-center justify-center font-bold text-solar">
                          {week.semaine}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-slate dark:text-dark-text">
                            {week.focus}
                          </p>
                        </div>
                      </div>
                      {expandedWeeks.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-slate/50" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate/50" />
                      )}
                    </button>

                    {expandedWeeks.includes(index) && (
                      <div className="px-4 pb-4 space-y-2">
                        {week.quetes.map((quete, qIndex) => (
                          <div key={qIndex} className="flex items-start gap-2 p-3 rounded-xl bg-solar/5">
                            <span className="text-solar font-bold">•</span>
                            <p className="text-sm text-slate dark:text-dark-text flex-1">
                              {quete}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-teal/10 border border-teal/20">
                <p className="text-sm text-teal text-center">
                  💡 Ce programme est sauvegardé et accessible dans ton Journal
                </p>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={restart}
              >
                Refaire le test
              </Button>
              <Button
                variant="solar"
                className="flex-1"
                onClick={onBack}
              >
                Retour au Dashboard
              </Button>
            </div>

            {/* Save to Journal Button */}
            <Button
              variant="solar"
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

  // Quiz screen
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-solar/30 via-cream to-orange-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
      <header className="flex-shrink-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-solar to-orange-400">
            <Trophy className="w-6 h-6 text-white icon-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Héros
            </h1>
            <p className="text-sm text-slate/70 dark:text-dark-text/70">
              Forge de l'estime de soi
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
            Question {currentQuestion + 1}/20
          </div>
          <div className="text-sm font-medium text-solar">
            {Math.round(progress)}%
          </div>
        </div>
        <div className="w-full h-2 bg-slate/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-solar to-orange-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide flex items-center">
        <div className="w-full max-w-2xl mx-auto">
          <Card className="mb-8 border-2 border-solar/30">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-solar/20 mb-4">
                <span className="text-2xl font-bold text-solar">{currentQuestion + 1}</span>
              </div>
              <p className="text-xl font-medium text-slate dark:text-dark-text leading-relaxed">
                {question.text}
              </p>
            </div>
          </Card>

          <div className="space-y-3">
            {likertOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-5 rounded-2xl bg-white/80 hover:bg-solar/20 border-2 border-transparent hover:border-solar transition-all active:scale-98 text-left"
              >
                <p className="font-medium text-slate dark:text-dark-text">
                  {option.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Heros;
