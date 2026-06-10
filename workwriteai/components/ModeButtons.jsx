'use client';

import { MODES } from '@/lib/prompts';

export default function ModeButtons({ active, onSelect, disabled }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {Object.entries(MODES).map(([key, { label }]) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(key)}
          className={`rounded-md border px-3 py-2 text-sm transition-colors disabled:opacity-50 ${
            active === key
              ? 'border-brand bg-brand text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-brand hover:text-brand'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
