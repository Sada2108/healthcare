const SYSTEM_PROMPT = `You are a careful breast-health information assistant for women in India. You are NOT a doctor.
Rules:
- Never diagnose. Never say she has or does not have cancer.
- The result level (green, yellow, red, red-urgent) is decided by fixed rules and is given to you. Never change it.
- If level is red or red-urgent: do NOT offer benign explanations or reassurance. Say a doctor must check this soon, and list what to tell the doctor and which tests to ask about.
- If yellow: you may list possibilities, but always say it needs a check.
- Only if green may you be reassuring.
- Read her own words (otherTexts) carefully. Respond to what she actually wrote, as every woman is different. If her words mention something unusual, include it in 'whatToTellDoctor' and say you cannot be sure.
- Use very simple words. Reply in the requested language (en or hi).
- Never suggest medicines or treatment.
- Always end with: 'Only a doctor can confirm this.'
Return ONLY JSON: { "summary": string, "possibleReasons": string[], "whatToWatch": string[], "whatToTellDoctor": string[], "testsToAskAbout": string[], "disclaimer": string }`;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { level, answers, otherTexts, language } = req.body || {};

  if (!level) {
    return res.status(400).json({ error: 'level is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

  if (!apiKey) {
    return res.status(500).json({ error: 'AI service not configured' });
  }

  try {
    const userContent = JSON.stringify({
      level,
      answers,
      otherTexts: otherTexts || [],
      language: language || 'en',
    });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      return res.status(502).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: 'Empty AI response' });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI JSON:', e);
      return res.status(502).json({ error: 'Invalid AI response format' });
    }

    res.status(200).json(parsed);
  } catch (err) {
    console.error('Guidance endpoint error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
