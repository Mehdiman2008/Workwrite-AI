'use client';

import { useState } from 'react';
import { getHistory, getSettings } from '@/lib/storage';

export default function ProgressPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [count, setCount] = useState(null);

  async function analyse() {
    setError('');
    setResult('');
    const history = getHistory();
    setCount(history.length);
    if (history.length === 0) {
      setError('No saved history yet. Save a few results on the Write page first.');
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append('mode', 'analyze');
    form.append('modelKey', getSettings().defaultModelKey);
    form.append('history', JSON.stringify(history));

    try {
      const res = await fetch('/api/generate', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed.');
      setResult(data.result || '');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Progress</h1>
      <p className="text-sm text-slate-500">
        Analyses your saved writing history to spot recurring grammar mistakes, overused words, tone
        issues and better phrasing.
      </p>

      <button
        onClick={analyse}
        disabled={loading}
        className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {loading ? 'Analysing…' : 'Analyse my writing'}
      </button>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          {count != null && (
            <p className="mb-2 text-xs text-slate-400">Based on {count} saved item(s).</p>
          )}
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{result}</div>
        </div>
      )}
    </div>
  );
}
