import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { callAI } from '../../../utils/ai';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { Lightbulb, X, Search } from 'lucide-react';

const Lumiere = ({ onBack }) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateArticle = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const prompt = `Tu es un vulgarisateur en psychologie pour adolescents/jeunes adultes.

L'utilisateur veut en apprendre plus sur : "${query}"

Génère UN SEUL article JSON avec EXACTEMENT cette structure:
{
  "titre": "Titre accrocheur (5-8 mots)",
  "intro": "Phrase d'accroche qui interpelle (1 phrase courte et dynamique)",
  "explication": "Explication du concept en 2-3 paragraphes courts (200-300 mots). Utilise des mots simples, des exemples concrets du quotidien d'un ado. Ton accessible mais pas infantilisant.",
  "pratique": "Section 'Ce que tu peux faire' en 2-3 paragraphes (100-150 mots). Conseils concrets et applicables immédiatement.",
  "references": [
    "Livre/ressource accessible 1",
    "Livre/ressource accessible 2"
  ]
}

CONTRAINTES IMPORTANTES:
- Spécialités: Psychologie uniquement (psychanalyse, TCC, systémique, psychologie cognitive, développementale)
- Longueur totale: 300-500 mots
- Ton: Accessible aux ados, dynamique, avec exemples concrets
- Étayé par des concepts scientifiques (sans jargon technique)
- Si le sujet n'est PAS lié à la psychologie, réponds: "Je ne peux traiter que des sujets de psychologie."

RETOURNE UNIQUEMENT LE JSON, rien d'autre.`;

      const response = await callAI([
        { role: 'user', content: prompt }
      ], 'lumiere');

      let articleData;
      try {
        articleData = JSON.parse(response);
      } catch (e) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          articleData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Format de réponse invalide');
        }
      }

      // Check if topic is not psychology-related
      if (response.includes('Je ne peux traiter que des sujets de psychologie')) {
        throw new Error('Ce sujet n\'est pas lié à la psychologie');
      }

      setArticle(articleData);
    } catch (error) {
      console.error('Error generating article:', error);
      setError('Une erreur s\'est produite. Assure-toi que ton sujet concerne la psychologie.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setArticle(null);
    setQuery('');
    setError(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-400/20 via-cream to-cyan-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400">
            <Lightbulb className="w-6 h-6 text-white icon-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Lumière
            </h1>
            <p className="text-sm text-slate/70 dark:text-dark-text/70">
              Psychoéducation
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
          {/* Search Interface */}
          {!article && !loading && (
            <Card className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-blue-400 to-cyan-400 animate-pulse">
                <Lightbulb className="w-10 h-10 text-white icon-glow" />
              </div>
              <h3 className="text-2xl font-bold text-slate dark:text-dark-text mb-4">
                En apprendre plus sur...
              </h3>
              <p className="text-slate/70 dark:text-dark-text/70 mb-6">
                Entre un sujet de psychologie qui t'intrigue
              </p>

              <div className="space-y-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && generateArticle()}
                  placeholder="Ex: l'anxiété, pourquoi je procrastine, les TOC..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-blue-400/20 focus:border-blue-400 focus:outline-none bg-white/50 dark:bg-dark-card/50 text-slate dark:text-dark-text"
                  autoFocus
                />

                {error && (
                  <p className="text-sm text-coral">{error}</p>
                )}

                <Button
                  variant="primary"
                  className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white hover:opacity-90 flex items-center justify-center gap-2"
                  onClick={generateArticle}
                  disabled={!query.trim()}
                >
                  <Search className="w-5 h-5" />
                  Découvrir
                </Button>
              </div>

              {/* Suggested Topics */}
              <div className="mt-8 pt-6 border-t border-slate/10 dark:border-dark-text/10">
                <p className="text-sm font-semibold text-slate/70 dark:text-dark-text/70 mb-3">
                  Suggestions :
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['L\'anxiété', 'La procrastination', 'L\'estime de soi', 'Le stress', 'Les émotions'].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setQuery(topic);
                        setTimeout(() => generateArticle(), 100);
                      }}
                      className="px-3 py-1.5 text-sm rounded-xl bg-blue-400/10 hover:bg-blue-400/20 text-blue-600 dark:text-cyan-400 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Loading */}
          {loading && (
            <Card className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-blue-400 to-cyan-400 animate-spin">
                <Lightbulb className="w-10 h-10 text-white icon-glow" />
              </div>
              <h3 className="text-xl font-bold text-slate dark:text-dark-text mb-2">
                Recherche en cours...
              </h3>
              <p className="text-slate/70 dark:text-dark-text/70">
                L'IA prépare ton article personnalisé
              </p>
            </Card>
          )}

          {/* Article Display */}
          {article && !loading && (
            <>
              <Card className="border-2 border-blue-400/30">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400">
                    <Lightbulb className="w-6 h-6 text-white icon-glow" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate dark:text-dark-text mb-2">
                    {article.titre}
                  </h2>
                </div>

                {/* Introduction */}
                <div className="mb-6 p-4 rounded-2xl bg-blue-400/10 border-l-4 border-blue-400">
                  <p className="text-lg font-medium text-slate dark:text-dark-text italic">
                    {article.intro}
                  </p>
                </div>

                {/* Explication */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate dark:text-dark-text mb-3">
                    📖 Comprendre
                  </h3>
                  <div className="text-slate/80 dark:text-dark-text/80 leading-relaxed space-y-3">
                    {article.explication.split('\n\n').map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* Pratique */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate dark:text-dark-text mb-3">
                    💡 Ce que tu peux faire
                  </h3>
                  <div className="text-slate/80 dark:text-dark-text/80 leading-relaxed space-y-3">
                    {article.pratique.split('\n\n').map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* Références */}
                {article.references && article.references.length > 0 && (
                  <div className="p-4 rounded-2xl bg-teal/10 border border-teal/20">
                    <h3 className="text-sm font-bold text-teal mb-2">
                      📚 Pour aller plus loin
                    </h3>
                    <ul className="space-y-1">
                      {article.references.map((ref, idx) => (
                        <li key={idx} className="text-sm text-slate/80 dark:text-dark-text/80">
                          • {ref}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleNewSearch}
              >
                Nouvelle recherche
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Lumiere;
