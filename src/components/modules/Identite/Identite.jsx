import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { callAI } from '../../../utils/ai';
import { storage } from '../../../utils/helpers';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { User, X, Share2 } from 'lucide-react';

const Identite = ({ onBack }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [part, setPart] = useState(0); // 0: intro, 1: ping-pong, 2: qcm, 3: vrai-faux, 4: results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState({ part1: [], part2: [], part3: [] });
  const [answers, setAnswers] = useState({ part1: [], part2: [], part3: [] });
  const [textInput, setTextInput] = useState('');
  const [portrait, setPortrait] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (part === 1 || part === 2 || part === 3) {
      generateQuestions();
    }
  }, [part]);

  const generateQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      let prompt = '';
      
      if (part === 1) {
        prompt = `Génère 10 questions courtes de type "ping-pong" pour un adolescent/jeune adulte.

RÈGLES:
- Questions personnelles, introspectives et variées
- Maximum 8 mots par question
- Exemples: "Ton surnom ?", "Ton point faible ?", "Ton rêve le plus fou ?"

Retourne UNIQUEMENT un tableau JSON:
["question 1", "question 2", ...]`;
      } else if (part === 2) {
        prompt = `Génère 10 questions QCM pour un adolescent/jeune adulte.

RÈGLES:
- Questions de type "Si t'étais..."
- 4 choix de réponse par question
- Exemples: "Si t'étais une saison ?", "Si t'étais une matière scolaire ?"

Retourne UNIQUEMENT un tableau JSON:
[
  {
    "question": "Si t'étais une saison ?",
    "choix": ["Printemps", "Été", "Automne", "Hiver"]
  }
]`;
      } else if (part === 3) {
        prompt = `Génère 10 affirmations Vrai/Faux pour un adolescent/jeune adulte.

RÈGLES:
- Affirmations sur le comportement, les croyances, la personnalité
- Exemples: "Tu es du genre à faire tes devoirs à la dernière minute", "Tu penses que l'amour rend aveugle"

Retourne UNIQUEMENT un tableau JSON:
["affirmation 1", "affirmation 2", ...]`;
      }

      const response = await callAI([
        { role: 'user', content: prompt }
      ], 'identite');

      let questionsData;
      try {
        questionsData = JSON.parse(response);
      } catch (e) {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          questionsData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid questions format');
        }
      }

      if (part === 1) {
        setQuestions({ ...questions, part1: questionsData });
      } else if (part === 2) {
        setQuestions({ ...questions, part2: questionsData });
      } else if (part === 3) {
        setQuestions({ ...questions, part3: questionsData });
      }

    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Erreur lors de la génération des questions. Utilisation de questions par défaut.');
      
      // Fallback questions
      if (part === 1) {
        setQuestions({
          ...questions,
          part1: [
            "Ton surnom ?",
            "Ton point faible ?",
            "Ton rêve le plus fou ?",
            "Ce qui te fait rire ?",
            "Ta plus grande peur ?",
            "Ton talent caché ?",
            "Ce que tu détestes ?",
            "Ton lieu préféré ?",
            "Ta devise ?",
            "Ce qui te rend unique ?"
          ]
        });
      } else if (part === 2) {
        setQuestions({
          ...questions,
          part2: [
            { question: "Si t'étais une saison ?", choix: ["Printemps", "Été", "Automne", "Hiver"] },
            { question: "Si t'étais une matière scolaire ?", choix: ["Maths", "Français", "Sport", "Arts"] },
            { question: "Si t'étais un animal ?", choix: ["Chat", "Chien", "Oiseau", "Poisson"] },
            { question: "Si t'étais une couleur ?", choix: ["Rouge", "Bleu", "Vert", "Jaune"] },
            { question: "Si t'étais un moment de la journée ?", choix: ["Matin", "Après-midi", "Soirée", "Nuit"] },
            { question: "Si t'étais un élément ?", choix: ["Feu", "Eau", "Terre", "Air"] },
            { question: "Si t'étais un style musical ?", choix: ["Pop", "Rock", "Hip-hop", "Classique"] },
            { question: "Si t'étais un lieu ?", choix: ["Montagne", "Mer", "Ville", "Campagne"] },
            { question: "Si t'étais une émotion ?", choix: ["Joie", "Colère", "Tristesse", "Calme"] },
            { question: "Si t'étais un super-pouvoir ?", choix: ["Voler", "Invisibilité", "Téléportation", "Lire les pensées"] }
          ]
        });
      } else if (part === 3) {
        setQuestions({
          ...questions,
          part3: [
            "Tu es du genre à faire tes devoirs à la dernière minute",
            "Tu penses que l'amour rend aveugle",
            "Tu préfères être seul(e) que mal accompagné(e)",
            "Tu crois que tout arrive pour une raison",
            "Tu es plutôt du matin",
            "Tu changes souvent d'avis",
            "Tu es plus introverti(e) qu'extraverti(e)",
            "Tu accordes beaucoup d'importance au regard des autres",
            "Tu penses que le futur est déjà écrit",
            "Tu te fais facilement de nouveaux amis"
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTextAnswer = () => {
    if (!textInput.trim()) return;
    
    const updatedAnswers = {
      ...answers,
      part1: [
        ...answers.part1,
        { question: questions.part1[currentQuestion], answer: textInput }
      ]
    };
    setAnswers(updatedAnswers);
    setTextInput('');
    
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(0);
      setPart(2);
    }
  };

  const handleChoiceAnswer = (choice) => {
    const updatedAnswers = {
      ...answers,
      part2: [
        ...answers.part2,
        { question: questions.part2[currentQuestion].question, answer: choice }
      ]
    };
    setAnswers(updatedAnswers);
    
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(0);
      setPart(3);
    }
  };

  const handleBooleanAnswer = (answer) => {
    const updatedAnswers = {
      ...answers,
      part3: [
        ...answers.part3,
        { question: questions.part3[currentQuestion], answer: answer ? 'Vrai' : 'Faux' }
      ]
    };
    setAnswers(updatedAnswers);
    
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generatePortrait(updatedAnswers);
    }
  };

  const generatePortrait = async (finalAnswers) => {
    setLoading(true);
    setPart(4);
    
    try {
      const allAnswers = [
        ...finalAnswers.part1.map(a => `Q: ${a.question} → R: ${a.answer}`),
        ...finalAnswers.part2.map(a => `Q: ${a.question} → R: ${a.answer}`),
        ...finalAnswers.part3.map(a => `Q: ${a.question} → R: ${a.answer}`)
      ];

      const prompt = `Crée un portrait narratif pour un adolescent/jeune adulte basé sur ses réponses:

${allAnswers.join('\n')}

RÈGLES STRICTES:
- Maximum 100 mots
- DOIT commencer par "Tu es une personne..."
- Ton chaleureux, perspicace et bienveillant
- Style "Cold Reading" de thérapeute empathique
- Mets en valeur la singularité et les forces
- Évite les clichés, sois précis et personnel

Retourne UNIQUEMENT le portrait, rien d'autre.`;

      const response = await callAI([
        { role: 'user', content: prompt }
      ], 'identite');

      // Ensure it starts with "Tu es une personne"
      let portraitText = response.trim();
      if (!portraitText.startsWith('Tu es une personne')) {
        portraitText = 'Tu es une personne ' + portraitText.replace(/^(Tu es |T'es )/, '');
      }

      const finalPortrait = {
        portrait: portraitText,
        answers: finalAnswers,
        date: new Date().toISOString()
      };

      setPortrait(finalPortrait);
      
      // Save to localStorage
      storage.set(`identite_${user.id}`, finalPortrait);
      
    } catch (error) {
      console.error('Error generating portrait:', error);
      setError('Erreur lors de la génération du portrait.');
      setPortrait({
        portrait: "Tu es une personne qui a pris le temps de se découvrir. Cette démarche montre ta curiosité et ton désir de mieux te connaître. Continue ce chemin d'exploration, tu es unique.",
        answers: finalAnswers,
        date: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (!portrait) return;
    
    const message = encodeURIComponent(`Mon portrait Identité :\n\n${portrait.portrait}\n\n(Généré par TheraSpace)`);
    window.location.href = `sms:?body=${message}`;
  };

  const restart = () => {
    setPart(0);
    setCurrentQuestion(0);
    setQuestions({ part1: [], part2: [], part3: [] });
    setAnswers({ part1: [], part2: [], part3: [] });
    setTextInput('');
    setPortrait(null);
    setError(null);
  };

  // Intro screen
  if (part === 0) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-purple-400/20 via-cream to-pink-200 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
        <header className="flex-shrink-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400">
              <User className="w-6 h-6 text-white icon-glow" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
                Identité
              </h1>
              <p className="text-sm text-slate/70 dark:text-dark-text/70">
                Profil narratif
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

        <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide flex items-center">
          <div className="w-full max-w-2xl mx-auto">
            <Card className="text-center border-2 border-purple-400/30">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-purple-400 to-pink-400">
                <User className="w-10 h-10 text-white icon-glow" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate dark:text-dark-text mb-4">
                Découvre qui tu es vraiment
              </h2>
              
              <p className="text-slate/80 dark:text-dark-text/80 mb-6 leading-relaxed">
                Une interview en 3 parties pour créer ton portrait narratif unique. 
                30 questions qui révèlent ta singularité.
              </p>

              <div className="space-y-3 mb-8 text-left">
                <div className="p-4 rounded-2xl bg-purple-400/10">
                  <p className="font-semibold text-slate dark:text-dark-text mb-1">
                    Partie 1 : Ping-pong 🏓
                  </p>
                  <p className="text-sm text-slate/70 dark:text-dark-text/70">
                    10 questions courtes, réponses libres
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-400/10">
                  <p className="font-semibold text-slate dark:text-dark-text mb-1">
                    Partie 2 : QCM 📝
                  </p>
                  <p className="text-sm text-slate/70 dark:text-dark-text/70">
                    10 questions à choix multiples
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-400/10">
                  <p className="font-semibold text-slate dark:text-dark-text mb-1">
                    Partie 3 : Vrai/Faux ✓
                  </p>
                  <p className="text-sm text-slate/70 dark:text-dark-text/70">
                    10 affirmations sur toi
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:opacity-90"
                onClick={() => setPart(1)}
              >
                Commencer l'interview
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Loading screen
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-400/20 via-cream to-pink-200 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg">
        <div className="text-center max-w-md px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse">
            <User className="w-10 h-10 text-white icon-glow" />
          </div>
          <h2 className="text-2xl font-bold text-slate dark:text-dark-text mb-2">
            {part === 4 ? 'Création de ton portrait...' : 'Génération des questions...'}
          </h2>
          <p className="text-slate/70 dark:text-dark-text/70">
            {part === 4 ? 'L\'IA analyse tes réponses' : 'L\'IA prépare tes questions'}
          </p>
        </div>
      </div>
    );
  }

  // Portrait screen
  if (portrait) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-purple-400/20 via-cream to-pink-200 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
        <header className="flex-shrink-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400">
              <User className="w-6 h-6 text-white icon-glow" />
            </div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Ton Portrait
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
            {error && (
              <Card className="bg-orange-100 border-2 border-orange-300">
                <p className="text-sm text-orange-800">{error}</p>
              </Card>
            )}

            {/* Portrait */}
            <Card className="border-2 border-purple-400/30 shadow-xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400">
                  <User className="w-8 h-8 text-white icon-glow" />
                </div>
                <h2 className="text-2xl font-bold text-slate dark:text-dark-text mb-2">
                  Ton Portrait Narratif
                </h2>
              </div>

              <div className="p-6 rounded-2xl bg-purple-400/10">
                <p className="text-lg text-slate dark:text-dark-text leading-relaxed">
                  {portrait.portrait}
                </p>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5 mr-2" />
                Partager
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:opacity-90"
                onClick={onBack}
              >
                Retour au Dashboard
              </Button>
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={restart}
            >
              Recommencer l'interview
            </Button>

            {/* Recap of answers */}
            <Card>
              <h3 className="text-lg font-bold text-slate dark:text-dark-text mb-4">
                📋 Récapitulatif de tes réponses
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">Partie 1 : Ping-pong</h4>
                  <div className="space-y-2">
                    {portrait.answers.part1.map((a, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-slate/60 dark:text-dark-text/60">{a.question}</span>
                        <br />
                        <span className="text-slate dark:text-dark-text font-medium">{a.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">Partie 2 : QCM</h4>
                  <div className="space-y-2">
                    {portrait.answers.part2.map((a, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-slate/60 dark:text-dark-text/60">{a.question}</span>
                        <br />
                        <span className="text-slate dark:text-dark-text font-medium">{a.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">Partie 3 : Vrai/Faux</h4>
                  <div className="space-y-2">
                    {portrait.answers.part3.map((a, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-slate/60 dark:text-dark-text/60">{a.question}</span>
                        <br />
                        <span className="text-slate dark:text-dark-text font-medium">{a.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Part 1: Ping-pong
  if (part === 1 && questions.part1.length > 0) {
    const progress = ((currentQuestion + 1) / 10) * 100;

    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-purple-400/20 via-cream to-pink-200 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
        <header className="flex-shrink-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400">
              <User className="w-6 h-6 text-white icon-glow" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
                Partie 1/3 : Ping-pong
              </h1>
              <p className="text-sm text-slate/70 dark:text-dark-text/70">
                Question {currentQuestion + 1}/10
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
          <div className="w-full h-2 bg-slate/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide flex items-center">
          <div className="w-full max-w-2xl mx-auto">
            <Card className="mb-6 border-2 border-purple-400/30">
              <div className="text-center py-8">
                <p className="text-2xl font-bold text-slate dark:text-dark-text mb-6">
                  {questions.part1[currentQuestion]}
                </p>
                
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTextAnswer()}
                  placeholder="Ta réponse..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-400/20 focus:border-purple-400 focus:outline-none bg-white/50 dark:bg-dark-card/50 text-center text-lg"
                  autoFocus
                />
              </div>
            </Card>

            <Button
              variant="primary"
              className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:opacity-90"
              onClick={handleTextAnswer}
              disabled={!textInput.trim()}
            >
              Suivant
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Part 2: QCM
  if (part === 2 && questions.part2.length > 0) {
    const progress = ((currentQuestion + 1) / 10) * 100;
    const question = questions.part2[currentQuestion];

    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-purple-400/20 via-cream to-pink-200 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
        <header className="flex-shrink-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400">
              <User className="w-6 h-6 text-white icon-glow" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
                Partie 2/3 : QCM
              </h1>
              <p className="text-sm text-slate/70 dark:text-dark-text/70">
                Question {currentQuestion + 1}/10
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
          <div className="w-full h-2 bg-slate/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide flex items-center">
          <div className="w-full max-w-2xl mx-auto">
            <Card className="mb-6 border-2 border-purple-400/30">
              <div className="text-center py-8">
                <p className="text-2xl font-bold text-slate dark:text-dark-text">
                  {question.question}
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {question.choix.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoiceAnswer(choice)}
                  className="p-6 rounded-2xl bg-white/80 hover:bg-purple-400/20 border-2 border-transparent hover:border-purple-400 transition-all active:scale-95"
                >
                  <p className="font-medium text-slate dark:text-dark-text">
                    {choice}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Part 3: Vrai/Faux
  if (part === 3 && questions.part3.length > 0) {
    const progress = ((currentQuestion + 1) / 10) * 100;

    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-purple-400/20 via-cream to-pink-200 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
        <header className="flex-shrink-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400">
              <User className="w-6 h-6 text-white icon-glow" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
                Partie 3/3 : Vrai/Faux
              </h1>
              <p className="text-sm text-slate/70 dark:text-dark-text/70">
                Question {currentQuestion + 1}/10
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
          <div className="w-full h-2 bg-slate/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide flex items-center">
          <div className="w-full max-w-2xl mx-auto">
            <Card className="mb-8 border-2 border-purple-400/30">
              <div className="text-center py-8">
                <p className="text-xl font-medium text-slate dark:text-dark-text leading-relaxed">
                  {questions.part3[currentQuestion]}
                </p>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 text-lg py-6"
                onClick={() => handleBooleanAnswer(false)}
              >
                Faux
              </Button>
              <Button
                variant="primary"
                className="flex-1 text-lg py-6 bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:opacity-90"
                onClick={() => handleBooleanAnswer(true)}
              >
                Vrai
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default Identite;
