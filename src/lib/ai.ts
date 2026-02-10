type AiProvider = 'openai' | 'grok';

type GenerateRequest = {
  provider?: AiProvider;
  prompt: string;
};

type GenerateResponse = {
  markdown: string;
};

export const generateDraft = async ({
  provider = 'openai',
  prompt,
}: GenerateRequest): Promise<GenerateResponse> => {
  if (!prompt.trim()) {
    return { markdown: '# Draft\n\nAdd your prompt to generate a draft.' };
  }

  if (provider === 'openai') {
    const apiKey = import.meta.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { markdown: `# Draft\n\n${prompt}` };
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'You are a resume drafting assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!res.ok) {
      throw new Error('OpenAI request failed');
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || prompt;
    return { markdown: content };
  }

  const grokKey = import.meta.env.GROK_API_KEY;
  if (!grokKey) {
    return { markdown: `# Draft\n\n${prompt}` };
  }

  const grokRes = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${grokKey}`,
    },
    body: JSON.stringify({
      model: 'grok-2',
      messages: [
        { role: 'system', content: 'You are a resume drafting assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!grokRes.ok) {
    throw new Error('Grok request failed');
  }

  const grokData = await grokRes.json();
  const grokContent = grokData?.choices?.[0]?.message?.content || prompt;
  return { markdown: grokContent };
};
