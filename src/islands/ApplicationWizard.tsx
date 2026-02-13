import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ApplicationWizard() {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);

    const { data: session } = await supabase.auth.getSession();

    const res = await fetch(
      'https://YOUR_PROJECT_REF.functions.supabase.co/generate-package',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session?.access_token}`,
        },
        body: JSON.stringify({
          job_title: 'Frontend Developer',
          company_name: 'Example Inc',
          job_description: 'We are looking for...',
          country_code: 'DE',
          language_code: 'en',
        }),
      },
    );

    const data = await res.json();

    if (data.application_id) {
      window.location.href = `/app/applications/${data.application_id}`;
    }

    setLoading(false);
  }

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Application'}
      </button>
    </div>
  );
}
