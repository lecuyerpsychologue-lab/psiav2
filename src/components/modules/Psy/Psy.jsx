import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { storage } from '../../../utils/helpers';
import { callAI, containsCrisisKeywords } from '../../../utils/ai';
import Button from '../../ui/Button';
import { MessageCircle, X, Send, AlertCircle } from 'lucide-react';

const Psy = ({ onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = () => {
    if (user) {
      const saved = storage.get(`psy_messages_${user.id}`) || [];
      if (saved.length === 0) {
        // Welcome message with disclaimer (only shown once)
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: `Salut ${user.pseudo} ! 👋\n\nJe suis PsIA, ton assistant thérapeutique. Je suis là pour t'écouter et t'accompagner.\n\n💡 Disclaimer : Je suis une IA, je ne remplace pas un thérapeute humain. Pour des situations urgentes ou des problèmes graves, consulte un professionnel.\n\nComment te sens-tu aujourd'hui ?`,
            timestamp: new Date().toISOString(),
            hasDisclaimer: true
          }
        ]);
      } else {
        setMessages(saved);
      }
    }
  };

  const saveMessages = (msgs) => {
    if (user) {
      storage.set(`psy_messages_${user.id}`, msgs);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || crisisDetected) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    // Check for crisis keywords
    if (containsCrisisKeywords(inputValue)) {
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInputValue('');
      
      // Show crisis response
      const crisisMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Je perçois que tu traverses un moment très difficile. Ce que tu vis est important, mais je ne suis pas en mesure de continuer cette discussion. Ce que tu ressens mérite l'attention d'un professionnel qui pourra vraiment t'aider.\n\nClique sur le bouton SOS ci-dessous pour accéder aux ressources d'urgence.",
        timestamp: new Date().toISOString(),
        isCrisis: true
      };
      
      const finalMessages = [...updatedMessages, crisisMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
      setCrisisDetected(true);
      setShowSOS(true);
      return;
    }

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // Build conversation context for AI
      const conversationHistory = updatedMessages.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // System prompt for PsIA
      const systemPrompt = `Tu es PsIA, un assistant thérapeutique pour adolescents/jeunes adultes.

APPROCHES:
- **TCC (Thérapie Cognitivo-Comportementale)** : Tu peux donner des petits conseils prudents et des techniques concrètes (respiration, restructuration cognitive, exposition graduelle).
- **Posture analytique** : Tu utilises des images, des métaphores pour faire réfléchir l'utilisateur sur ses patterns.
- **Posture systémique** : Tu questionnes sur les relations, le contexte familial/social, les interactions.

TON:
- Naturel et authentique (pas une caricature du psy silencieux)
- Adapté aux ados (accessible, pas condescendant)
- Bienveillant et empathique
- Tu réponds vraiment aux questions, tu ne te contentes pas d'écouter passivement

RÈGLES:
- Reste dans ton rôle d'assistant thérapeutique
- Ne donne JAMAIS de diagnostic médical
- Si tu détectes un risque grave (suicide, automutilation, danger), arrête et oriente vers les urgences
- Sois concis (2-4 phrases max par réponse)
- Ne répète PAS le disclaimer à chaque message

Réponds de manière naturelle et aidante.`;

      const response = await callAI([
        { role: 'system', content: systemPrompt },
        ...conversationHistory
      ], 'psy');

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (error) {
      console.error('Error calling AI:', error);
      
      // Fallback response
      const fallbackResponses = [
        "Je t'écoute. Peux-tu m'en dire plus sur ce que tu ressens ?",
        "C'est important ce que tu partages. Comment cela affecte-t-il ton quotidien ?",
        "Je comprends. Qu'est-ce qui pourrait t'aider dans cette situation ?",
        "Tes émotions sont valides. Que ressens-tu en ce moment précis ?",
        "C'est courageux de ta part d'en parler. Qu'est-ce qui serait le plus utile pour toi maintenant ?"
      ];

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (confirm('Supprimer toute la conversation ?')) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Salut ${user.pseudo} ! 👋\n\nJe suis PsIA, ton assistant thérapeutique. Je suis là pour t'écouter et t'accompagner.\n\n💡 Disclaimer : Je suis une IA, je ne remplace pas un thérapeute humain. Pour des situations urgentes ou des problèmes graves, consulte un professionnel.\n\nComment te sens-tu aujourd'hui ?`,
          timestamp: new Date().toISOString(),
          hasDisclaimer: true
        }
      ]);
      storage.remove(`psy_messages_${user.id}`);
      setCrisisDetected(false);
      setShowSOS(false);
    }
  };

  const handleSOSClick = () => {
    // Navigate to SOS (could be integrated with Dashboard SOS modal)
    window.location.href = 'tel:3114';
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-teal/20 via-cream to-blue-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 p-4 flex items-center justify-between border-b border-slate/10 dark:border-dark-text/10 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-teal to-blue-400">
            <MessageCircle className="w-6 h-6 text-white icon-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate dark:text-dark-text">
              PsIA
            </h1>
            <p className="text-xs text-slate/70 dark:text-dark-text/70">
              En ligne
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="px-3 py-1.5 text-sm rounded-xl hover:bg-slate/10 dark:hover:bg-dark-text/10 transition-colors text-slate/70 dark:text-dark-text/70"
          >
            Effacer
          </button>
          <button
            onClick={onBack}
            className="p-2 rounded-2xl hover:bg-slate/10 dark:hover:bg-dark-text/10 transition-colors"
          >
            <X className="w-6 h-6 text-slate dark:text-dark-text" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-teal text-white ml-auto'
                    : 'glass-card'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">
                  {message.content}
                </p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-white/70' : 'text-slate/50 dark:text-dark-text/50'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass-card px-4 py-3 rounded-2xl">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          {/* SOS Button when crisis is detected */}
          {showSOS && (
            <div className="flex justify-center">
              <button
                onClick={handleSOSClick}
                className="px-6 py-4 rounded-2xl bg-coral hover:bg-coral/90 text-white font-bold shadow-lg shadow-coral/30 transition-all flex items-center gap-2"
              >
                <AlertCircle className="w-6 h-6" />
                Accéder aux ressources SOS
              </button>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-slate/10 dark:border-dark-text/10 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Écris ton message..."
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate/20 focus:border-teal focus:outline-none bg-white/50 dark:bg-dark-card/50 text-slate dark:text-dark-text"
            disabled={isTyping || crisisDetected}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping || crisisDetected}
            className="p-3 rounded-2xl bg-teal hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            <Send className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Psy;
