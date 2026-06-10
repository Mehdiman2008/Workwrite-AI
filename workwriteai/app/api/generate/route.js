import OpenAI from 'openai';
import { MODELS, DEFAULT_MODEL_KEY } from '@/lib/models';
import {
  COACH_SYSTEM,
  MODES,
  ASK_SYSTEM,
  ANALYZE_SYSTEM,
  buildAnalyzeUser,
} from '@/lib/prompts';

// pdf-parse and mammoth need the Node runtime (Buffer + Node APIs).
export const runtime = 'nodejs';
export const maxDuration = 30;

function resolveModel(key) {
  return (MODELS[key] || MODELS[DEFAULT_MODEL_KEY]).id;
}

// Pull text (or an image data URL) out of an uploaded file.
async function extractFile(file) {
  const type = file.type || '';
  const name = (file.name || '').toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());

  if (type.startsWith('image/')) {
    return { kind: 'image', dataUrl: `data:${type};base64,${buf.toString('base64')}` };
  }

  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    // Import the inner module directly to avoid pdf-parse's debug file read.
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    const data = await pdfParse(buf);
    return { kind: 'text', text: data.text };
  }

  if (
    name.endsWith('.docx') ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const mammoth = await import('mammoth');
    const { value } = await mammoth.extractRawText({ buffer: buf });
    return { kind: 'text', text: value };
  }

  // Fallback: treat as plain text (.txt, .md, .csv, etc.)
  return { kind: 'text', text: buf.toString('utf-8') };
}

export async function POST(req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'OPENAI_API_KEY is not set on the server. Add it in your Vercel project settings.' },
        { status: 500 }
      );
    }
    const client = new OpenAI({ apiKey });

    const form = await req.formData();
    const mode = String(form.get('mode') || 'grammar');
    const modelKey = String(form.get('modelKey') || DEFAULT_MODEL_KEY);
    const text = String(form.get('text') || '');
    const question = String(form.get('question') || '');
    const tone = String(form.get('tone') || '');
    const historyRaw = String(form.get('history') || '');
    const file = form.get('file');

    const model = resolveModel(modelKey);

    // --- My Progress analysis ---------------------------------------------
    if (mode === 'analyze') {
      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: ANALYZE_SYSTEM },
          { role: 'user', content: buildAnalyzeUser(historyRaw) },
        ],
      });
      return Response.json({ result: completion.choices[0].message.content });
    }

    // --- File / image handling --------------------------------------------
    let extracted = null;
    if (file && typeof file.arrayBuffer === 'function') {
      extracted = await extractFile(file);
    }

    if (extracted) {
      const userText = question || text || 'Please review this content.';
      let userContent;

      if (extracted.kind === 'image') {
        userContent = [
          { type: 'text', text: userText },
          { type: 'image_url', image_url: { url: extracted.dataUrl } },
        ];
      } else {
        userContent = `${userText}\n\n---\nDocument content:\n${extracted.text}`;
      }

      // If a question was typed, behave like a general assistant; otherwise
      // apply the selected writing mode to the file's text.
      const useAsk = mode === 'ask' || question;
      const system = useAsk
        ? ASK_SYSTEM
        : `${COACH_SYSTEM}\n\nTask: ${(MODES[mode] || MODES.grammar).instruction}`;

      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userContent },
        ],
      });
      return Response.json({ result: completion.choices[0].message.content });
    }

    // --- Plain text mode ---------------------------------------------------
    if (!text.trim()) {
      return Response.json({ error: 'Please enter some text or attach a file.' }, { status: 400 });
    }

    const modeDef = MODES[mode] || MODES.grammar;
    const sys = `${COACH_SYSTEM}${tone ? `\nPreferred tone: ${tone}.` : ''}\n\nTask: ${modeDef.instruction}`;

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: text },
      ],
    });

    return Response.json({ result: completion.choices[0].message.content });
  } catch (err) {
    console.error('generate error:', err);
    return Response.json({ error: err?.message || 'Something went wrong.' }, { status: 500 });
  }
}
