'use client';

import { useEffect, useState } from 'react';
import { MODELS } from '@/lib/models';
import { MODES } from '@/lib/prompts';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '@/lib/storage';

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function update(key, value) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  function save() {
    saveSettings(settings);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* API key */}
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">API key</h2>
        <p className="text-sm text-slate-600">
          Your OpenAI key is set as a server environment variable named{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5">OPENAI_API_KEY</code>. It lives on the
          server (Vercel) and is never sent to the browser. Set it locally in{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5">.env.local</code>, and in production
          under Vercel → Project → Settings → Environment Variables.
        </p>
      </section>

      {/* Model mapping */}
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Model mapping</h2>
        <p className="mb-3 text-sm text-slate-600">
          Defined in <code className="rounded bg-slate-100 px-1 py-0.5">lib/models.js</code>. Edit
          that file to change which OpenAI model each option uses.
        </p>
        <ul className="space-y-1 text-sm">
          {Object.entries(MODELS).map(([key, m]) => (
            <li key={key} className="flex justify-between text-slate-600">
              <span>{m.label}</span>
              <code className="rounded bg-slate-100 px-1 py-0.5">{m.id}</code>
            </li>
          ))}
        </ul>
      </section>

      {/* Defaults */}
      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-700">Defaults</h2>

        <label className="block text-sm text-slate-600">
          Default output mode
          <select
            value={settings.defaultMode}
            onChange={(e) => update('defaultMode', e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          >
            {Object.entries(MODES).map(([key, m]) => (
              <option key={key} value={key}>{m.label}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-slate-600">
          Default model
          <select
            value={settings.defaultModelKey}
            onChange={(e) => update('defaultModelKey', e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          >
            {Object.entries(MODELS).map(([key, m]) => (
              <option key={key} value={key}>{m.label}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-slate-600">
          Default tone
          <input
            value={settings.defaultTone}
            onChange={(e) => update('defaultTone', e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <button
          onClick={save}
          className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark"
        >
          {savedMsg ? 'Saved' : 'Save settings'}
        </button>
      </section>
    </div>
  );
}
