'use client';

import { useRef } from 'react';

export default function FileAttach({ file, onFile, onClear }) {
  const inputRef = useRef(null);

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-slate-700 hover:border-brand hover:text-brand"
      >
        Attach file
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md,.csv,image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />
      {file && (
        <span className="flex items-center gap-2 text-slate-600">
          <span className="max-w-[160px] truncate">{file.name}</span>
          <button
            type="button"
            onClick={() => {
              if (inputRef.current) inputRef.current.value = '';
              onClear();
            }}
            className="text-slate-400 hover:text-red-500"
            aria-label="Remove file"
          >
            ✕
          </button>
        </span>
      )}
    </div>
  );
}
