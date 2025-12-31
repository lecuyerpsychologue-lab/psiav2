import React, { useState } from 'react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { Sparkles, X, RefreshCw } from 'lucide-react';

const Oracle = ({ onBack }) => {
  const [oracle, setOracle] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pre-defined oracles (can be replaced with AI generation)
  const oracles = [
    {
      title: "Le Chêne et le Roseau",
      story: "Un grand chêne se moquait d'un roseau qui pliait au moindre vent. Mais quand vint la tempête, le chêne rigide se brisa tandis que le roseau flexible survécut en se courbant.",
      moral: "La force n'est pas toujours dans la rigidité. Parfois, savoir s'adapter et accepter de plier temporairement nous permet de traverser les tempêtes de la vie.",
      source: "Ésope"
    },
    {
      title: "La Tasse de Thé",
      story: "Un maître Zen verse du thé dans la tasse d'un visiteur jusqu'à ce qu'elle déborde. Le visiteur s'exclame : 'Elle est pleine !' Le maître répond : 'Comme cette tasse, ton esprit est trop plein de certitudes pour recevoir quoi que ce soit de nouveau.'",
      moral: "Pour grandir et apprendre, il faut parfois vider notre esprit de nos préjugés et faire de la place pour de nouvelles perspectives.",
      source: "Sagesse Zen"
    },
    {
      title: "Le Papillon et la Chrysalide",
      story: "Un homme voulait aider un papillon à sortir de sa chrysalide. Il l'ouvrit délicatement. Le papillon sortit mais ne put jamais voler, car c'est la lutte pour sortir qui fortifie ses ailes.",
      moral: "Les difficultés que tu traverses ne sont pas des obstacles inutiles. Elles te rendent plus fort(e) et te préparent à voler de tes propres ailes.",
      source: "Conte populaire"
    },
    {
      title: "Les Deux Loups",
      story: "Un vieil homme dit à son petit-fils : 'En chacun de nous, deux loups se battent. L'un est la colère, la jalousie, la tristesse. L'autre est la joie, l'amour, l'espoir.' Le garçon demande : 'Lequel gagne ?' Le grand-père répond : 'Celui que tu nourris.'",
      moral: "Tu as le pouvoir de choisir sur quelles pensées et émotions tu veux te concentrer. Ce à quoi tu prêtes attention grandit en toi.",
      source: "Sagesse Amérindienne"
    },
    {
      title: "Le Pot Fêlé",
      story: "Une porteuse d'eau avait deux pots. L'un était intact, l'autre fêlé perdait de l'eau. Le pot fêlé avait honte. Mais la femme lui montra que sur son chemin, des fleurs avaient poussé grâce à l'eau qu'il avait laissée couler.",
      moral: "Ce que tu perçois comme tes faiblesses ou tes 'fêlures' peuvent en réalité être source de beauté et aider les autres d'une façon unique.",
      source: "Conte Chinois"
    },
    {
      title: "L'Archer et la Cible",
      story: "Un maître archer tire toujours dans le mille. Son élève lui demande son secret. Il répond : 'Je ne vise pas la cible. Je deviens la flèche, je sens le vent, je fais un avec le but.'",
      moral: "Parfois, trop réfléchir empêche de réussir. Fais confiance à ton intuition et à ce que tu as appris. Deviens ce que tu veux accomplir.",
      source: "Sagesse du Tir à l'Arc Zen"
    },
    {
      title: "La Graine de Bambou",
      story: "On plante une graine de bambou et on l'arrose pendant 5 ans sans voir aucune pousse. Puis la 6ème année, il grandit de 25 mètres en 6 semaines. Pendant ces 5 ans, il développait ses racines sous terre.",
      moral: "Tes efforts ne sont jamais perdus, même quand tu ne vois pas de résultats immédiats. Tu construis des fondations solides qui te permettront de grandir au bon moment.",
      source: "Sagesse Orientale"
    },
    {
      title: "Le Voyageur et les Deux Villes",
      story: "Un voyageur demande à un sage : 'Comment sont les gens dans la prochaine ville ?' Le sage demande : 'Comment étaient-ils dans la dernière ?' 'Méchants et froids.' 'Tu trouveras les mêmes dans la prochaine.' Un autre voyageur pose la même question. 'Dans la dernière, ils étaient gentils et accueillants.' 'Tu trouveras les mêmes dans la prochaine.'",
      moral: "Ce que tu vois chez les autres est souvent le reflet de ce que tu portes en toi. Change ton regard et le monde autour de toi change aussi.",
      source: "Conte Soufi"
    }
  ];

  const generateOracle = () => {
    setLoading(true);
    setTimeout(() => {
      const randomOracle = oracles[Math.floor(Math.random() * oracles.length)];
      setOracle(randomOracle);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-solar/30 via-cream to-yellow-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-solar to-yellow-300">
            <Sparkles className="w-6 h-6 text-white icon-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              Oracle
            </h1>
            <p className="text-sm text-slate/70 dark:text-dark-text/70">
              Sagesse symbolique
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
          {!oracle && !loading && (
            <Card className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-solar to-yellow-300 animate-pulse">
                <Sparkles className="w-10 h-10 text-white icon-glow" />
              </div>
              <h3 className="text-2xl font-bold text-slate dark:text-dark-text mb-4">
                L'Oracle est prêt
              </h3>
              <p className="text-slate/70 dark:text-dark-text/70 mb-6">
                Clique ci-dessous pour recevoir un message de sagesse inspiré 
                des grands contes et mythes de l'humanité.
              </p>
              <Button
                variant="solar"
                onClick={generateOracle}
                className="inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Consulter l'Oracle
              </Button>
            </Card>
          )}

          {loading && (
            <Card className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-solar to-yellow-300 animate-spin">
                <Sparkles className="w-10 h-10 text-white icon-glow" />
              </div>
              <p className="text-lg text-slate dark:text-dark-text">
                L'Oracle consulte les anciennes sagesses...
              </p>
            </Card>
          )}

          {oracle && !loading && (
            <>
              <Card className="border-2 border-solar/30 shadow-xl">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-solar to-yellow-300">
                    <Sparkles className="w-8 h-8 text-white icon-glow" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate dark:text-dark-text mb-2">
                    {oracle.title}
                  </h2>
                  <p className="text-sm text-solar font-medium">
                    {oracle.source}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate dark:text-dark-text mb-2">
                      📖 L'histoire
                    </h4>
                    <p className="text-slate/80 dark:text-dark-text/80 leading-relaxed">
                      {oracle.story}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-solar/20">
                    <h4 className="font-semibold text-slate dark:text-dark-text mb-2">
                      💡 La sagesse pour toi
                    </h4>
                    <p className="text-teal dark:text-cyan-400 leading-relaxed font-medium">
                      {oracle.moral}
                    </p>
                  </div>
                </div>
              </Card>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={generateOracle}
              >
                <RefreshCw className="w-5 h-5" />
                Consulter un autre oracle
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Oracle;
