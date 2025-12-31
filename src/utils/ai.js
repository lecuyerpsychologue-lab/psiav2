// AI API helper
export const callAI = async (messages, module = 'psy', context = null) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        module,
        context
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'AI request failed');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('AI call error:', error);
    throw error;
  }
};

// Check for crisis keywords
export const containsCrisisKeywords = (text) => {
  const keywords = [
    'suicide', 'suicider', 'me tuer', 'tuer',
    'scarification', 'automutilation', 'me faire mal',
    'mourir', 'mort', 'finir', 'en finir'
  ];
  
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
};

// Crisis response
export const getCrisisResponse = () => {
  return "Je perçois que tu traverses un moment très difficile. Il est important de parler à quelqu'un maintenant :\n\n📞 **3114** - Prévention suicide (gratuit, 24/7)\n📞 **15** - Urgences médicales\n\nJe suis une IA et je ne peux pas remplacer l'aide d'un professionnel dans cette situation. Tu mérites d'être écouté(e) et aidé(e) par quelqu'un de qualifié.";
};
