'use client';

import { MODELS } from '@/lib/models';

export default function ModelSelector({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <span>Model</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 focus:border-brand focus:outline-none"
      >
        {Object.entries(MODELS).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
