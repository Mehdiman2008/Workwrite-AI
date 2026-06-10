'use client';

import { useEffect, useState } from 'react';
import { getHistory, deleteHistory, clearHistory } from '@/lib/storage';

export default function HistoryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  function remove(id) {
    setItems(deleteHistory(id));
  }

  function clearAll() {
    if (confirm('Delete all saved history? This cannot be undone.')) {
      clearHistory();
      setItems([]);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">History</h1>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
          >
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 && (
        <p className="text-sm text-slate-500">No saved items yet. Save a result from the Write page.</p>
      )}

      <ul className="space-y-3">
        {items.map((h) => (
          <li key={h.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>
                {new Date(h.date).toLocaleString()} · {h.mode}
              </span>
              <button onClick={() => remove(h.id)} className="text-slate-400 hover:text-red-500">
                Delete
              </button>
            </div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Original</p>
            <p className="mb-3 whitespace-pre-wrap text-sm text-slate-600">{h.original}</p>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Improved</p>
            <p className="whitespace-pre-wrap text-sm text-slate-800">{h.improved}</p>
            {h.notes && (
              <p className="mt-2 text-xs text-slate-500">Note: {h.notes}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
