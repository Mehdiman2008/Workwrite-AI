// ---------------------------------------------------------------------------
// LOCAL BROWSER STORAGE
// History and settings live only in the browser (localStorage). Nothing is
// stored on a server or database. All functions are SSR-safe (they no-op when
// there is no window).
// ---------------------------------------------------------------------------

const HISTORY_KEY = 'workwrite_history';
const SETTINGS_KEY = 'workwrite_settings';

function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
}

// ---- History --------------------------------------------------------------

export function getHistory() {
  if (typeof window === 'undefined') return [];
  return safeParse(localStorage.getItem(HISTORY_KEY), []);
}

export function addHistory(entry) {
  if (typeof window === 'undefined') return [];
  const list = getHistory();
  list.unshift({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    ...entry,
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  return list;
}

export function deleteHistory(id) {
  if (typeof window === 'undefined') return [];
  const list = getHistory().filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  return list;
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

// ---- Settings -------------------------------------------------------------

export const DEFAULT_SETTINGS = {
  defaultTone: 'Professional and natural',
  defaultMode: 'grammar',
  defaultModelKey: 'balanced',
};

export function getSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...safeParse(localStorage.getItem(SETTINGS_KEY), {}) };
}

export function saveSettings(settings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
