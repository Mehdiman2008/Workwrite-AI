// ---------------------------------------------------------------------------
// MODEL MAPPING — change the `id` values here whenever OpenAI releases new
// models. The keys (fast/balanced/best) are what the UI dropdown uses, so the
// rest of the app never needs to change.
//
// All three defaults below support both text and image (vision) input.
// Check your OpenAI dashboard for the exact model names available to you.
// ---------------------------------------------------------------------------
export const MODELS = {
  fast: { id: 'gpt-4o-mini', label: 'Fast' },
  balanced: { id: 'gpt-4o', label: 'Balanced' },
  best: { id: 'gpt-4o', label: 'Best writing' }, // e.g. swap for 'gpt-4.1' if you have access
};

export const DEFAULT_MODEL_KEY = 'balanced';
