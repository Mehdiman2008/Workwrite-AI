'use client';

import { useState } from 'react';

export default function OutputArea({ result, onSave, saved }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be blocked; ignore */
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Result</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:border-brand hover:text-brand"
          >
            {copied ? 'Copied' : 'Copy Result'}
          </button>
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={saved}
              className="rounded-md bg-brand px-3 py-1.5 text-sm text-white hover:bg-brand-dark disabled:opacity-50"
            >
              {saved ? 'Saved' : 'Save to History'}
            </button>
          )}
        </div>
      </div>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
        {result}
      </div>
    </div>
  );
}
