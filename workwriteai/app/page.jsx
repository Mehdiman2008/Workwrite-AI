'use client';

import { useEffect, useState } from 'react';
import ModeButtons from '@/components/ModeButtons';
import ModelSelector from '@/components/ModelSelector';
import FileAttach from '@/components/FileAttach';
import OutputArea from '@/components/OutputArea';
import { MODES } from '@/lib/prompts';
import { addHistory, getSettings } from '@/lib/storage';

export default function WritePage() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('grammar');
  const [modelKey, setModelKey] = useState('balanced');
  const [tone, setTone] = useState('');
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [notes, setNotes] = useState('');

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Load defaults from Settings (localStorage).
  useEffect(() => {
    const s = getSettings();
    setMode(s.defaultMode);
    setModelKey(s.defaultModelKey);
    setTone(s.defaultTone);
  }, []);

  async function run(selectedMode) {
    setError('');
    setSaved(false);
    setLoading(true);
    setResult('');

    const form = new FormData();
    form.append('mode', selectedMode);
    form.append('modelKey', modelKey);
    form.append('text', text);
    form.append('question', question);
    form.append('tone', tone);
    if (file) form.append('file', file);

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

  function handleMode(key) {
    setMode(key);
    run(key);
  }

  function handleAsk() {
    run('ask');
  }

  function save() {
    addHistory({
      original: question ? `${question}${file ? ` [file: ${file.name}]` : ''}` : text,
      improved: result,
      mode: question ? 'ask' : mode,
      notes,
    });
    setSaved(true);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">WorkWrite AI</h1>
        <p className="text-sm text-slate-500">
          Paste a Teams message, email or paragraph and pick what you need.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        rows={8}
        className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-brand focus:outline-none"
      />

      <ModeButtons active={mode} onSelect={handleMode} disabled={loading} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ModelSelector value={modelKey} onChange={setModelKey} />
        <FileAttach file={file} onFile={(f) => { setFile(f); }} onClear={() => setFile(null)} />
      </div>

      {file && (
        <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-sm font-medium text-slate-700">Ask about this file</p>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='e.g. "Summarise this", "What does this image show?", "Extract action items"'
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAsk}
            disabled={loading}
            className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark disabled:opacity-50"
          >
            Ask
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => run(mode)}
          disabled={loading}
          className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? 'Working…' : `Improve (${MODES[mode]?.label || mode})`}
        </button>
        {loading && <span className="text-sm text-slate-400">Calling the model…</span>}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <OutputArea result={result} onSave={save} saved={saved} />

      {result && (
        <div>
          <label className="text-sm text-slate-600">
            Optional note (saved with history)
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. reply to manager about deadline"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </label>
        </div>
      )}
    </div>
  );
}
