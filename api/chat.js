// Vercel Serverless Function for Mistral AI
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, module, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages required' });
    }

    // Get Mistral API key from environment variable
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      console.error('MISTRAL_API_KEY not configured');
      return res.status(500).json({ error: 'AI service not configured' });
    }

    // Add system prompts based on module
    const systemPrompts = {
      psy: `Tu es PsIA, un assistant thérapeutique bienveillant et professionnel. Tu utilises une approche TCC (Thérapie Cognitive et Comportementale) intégrative. 
      - Pose des questions ouvertes pour mieux comprendre
      - Reste concis (max 3-4 phrases)
      - Ne valide pas tout, aide à réfléchir
      - Si tu détectes des mots comme "suicide", "me tuer", "scarification", "automutilation", réponds immédiatement: "Je perçois que tu traverses un moment très difficile. Il est important de parler à quelqu'un : appelle le 3114 (prévention suicide) ou le 15 (urgences). Je suis une IA et ne peux pas remplacer l'aide d'un professionnel dans cette situation."
      - Ajoute toujours le disclaimer: "💡 Je suis une IA, je ne remplace pas un thérapeute humain."`,
      
      echo: `Tu es un analyste émotionnel bienveillant. Ton rôle est d'analyser les patterns émotionnels et les stratégies d'adaptation d'un utilisateur adolescent/jeune adulte.
      - Utilise des métaphores accessibles (météo, nature, etc.)
      - Valide les émotions tout en proposant des alternatives constructives si nécessaire
      - Reste positif et encourageant
      - Max 150 mots`,
      
      heros: `Tu es un coach de développement personnel spécialisé dans l'estime de soi pour adolescents/jeunes adultes.
      - Crée des programmes personnalisés basés sur les réponses au questionnaire
      - Propose des "quêtes" concrètes et réalisables
      - Reste motivant sans être condescendant
      - Focus sur les forces et le potentiel`,
      
      oracle: `Tu es un conteur de sagesse. Ton rôle est de trouver et adapter des contes, mythes ou fables existants (Ésope, contes Zen, La Fontaine, etc.) qui résonnent avec la situation de l'utilisateur.
      - Raconte l'histoire en moins de 90 mots
      - Ajoute une morale adaptée aux adolescents/jeunes adultes
      - Reste mystique mais accessible`,
      
      identite: `Tu es un narrateur empathique qui crée des portraits personnels profonds et positifs.
      - Synthétise les réponses en un portrait cohérent
      - Commence toujours par "Tu es une personne..."
      - Max 100 mots
      - Mets en valeur les forces et la singularité
      - Ton bienveillant et encourageant`
    };

    const systemMessage = systemPrompts[module] || systemPrompts.psy;

    // Call Mistral AI API
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemMessage },
          ...(context ? [{ role: 'system', content: `Contexte additionnel: ${JSON.stringify(context)}` }] : []),
          ...messages
        ],
        temperature: 0.7,
        max_tokens: module === 'oracle' ? 300 : 500
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Mistral API error:', errorData);
      return res.status(response.status).json({ 
        error: 'AI service error',
        details: errorData 
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected Mistral response format:', data);
      return res.status(500).json({ error: 'Unexpected AI response format' });
    }

    return res.status(200).json({
      message: data.choices[0].message.content,
      usage: data.usage
    });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
