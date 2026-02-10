import React, { useEffect, useState } from 'react';

const DEFAULT_MARKDOWN = `# Resume Preview\n\nAdd a prompt and click **Generate draft** to populate this preview.`;

const ResumePreview: React.FC = () => {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);

  useEffect(() => {
    const handleGenerated = (event: Event) => {
      const detail = (event as CustomEvent<{ markdown?: string }>).detail;
      if (detail?.markdown) setMarkdown(detail.markdown);
    };

    window.addEventListener('resume:generated', handleGenerated);
    return () =>
      window.removeEventListener('resume:generated', handleGenerated);
  }, []);

  return (
    <section className="card stack">
      <div>
        <h2>Preview & edit</h2>
        <p className="muted">
          Edit the markdown before exporting. This is a plain-text preview for
          now.
        </p>
      </div>
      <textarea
        className="textarea"
        rows={12}
        value={markdown}
        onChange={(event) => setMarkdown(event.target.value)}
      />
    </section>
  );
};

export default ResumePreview;
