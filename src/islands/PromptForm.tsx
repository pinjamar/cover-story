import React, { useState } from 'react';

type PromptFormProps = {
  defaultTemplate?: string;
};

const PromptForm: React.FC<PromptFormProps> = ({ defaultTemplate = '' }) => {
  const [prompt, setPrompt] = useState(defaultTemplate);
  const [role, setRole] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const markdown = `# Resume Draft\n\n**Target Role:** ${role || 'N/A'}\n\n**Tone:** ${tone}\n\n---\n\n${prompt || 'Add your prompt details here.'}`;
      window.dispatchEvent(
        new CustomEvent('resume:generated', {
          detail: { markdown },
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <div>
        <h2>Generate your draft</h2>
        <p className="muted">
          Add role details, experience highlights, and tone to generate a
          starting draft.
        </p>
      </div>

      <label className="stack">
        <span>Target role</span>
        <input
          className="input"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          placeholder="Product Designer, Backend Engineer, Marketing Lead"
        />
      </label>

      <label className="stack">
        <span>Tone</span>
        <select
          className="select"
          value={tone}
          onChange={(event) => setTone(event.target.value)}
        >
          <option>Professional</option>
          <option>Friendly</option>
          <option>Bold</option>
          <option>Minimal</option>
        </select>
      </label>

      <label className="stack">
        <span>Prompt</span>
        <textarea
          className="textarea"
          rows={6}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Paste your experience, achievements, or a rough resume summary."
        />
      </label>

      {error && <p className="muted">{error}</p>}

      <button className="btn" type="submit" disabled={isLoading}>
        {isLoading ? 'Generating…' : 'Generate draft'}
      </button>
    </form>
  );
};

export default PromptForm;
