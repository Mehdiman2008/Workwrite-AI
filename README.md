# WorkWrite AI

A lightweight workplace writing assistant. Paste a Teams message, email or paragraph and
get it fixed, made professional/natural/shorter, turned into a Teams message or email, or
have your mistakes explained. You can also attach a PDF / Word / text file / image and ask
questions about it. History is saved **only in your browser**; your OpenAI key stays on the
server.

## Tech
- Next.js (App Router) + React
- Tailwind CSS
- OpenAI API (called from a server-side API route — key never reaches the browser)
- localStorage for history and settings (no database)
- Deploys to Vercel

## How the key stays private
The browser never sees your key. It POSTs your text/file to `/api/generate`, and that
server route reads `process.env.OPENAI_API_KEY` and calls OpenAI. Only the result comes back.

## Run locally
1. Install Node.js 18.18+ (or 20+).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your key:
   ```bash
   cp .env.local.example .env.local
   # then edit .env.local and paste your real OPENAI_API_KEY
   ```
4. Start:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. Go to vercel.com → **Add New → Project** → import the repo.
3. Framework preset: **Next.js** (auto-detected). No build settings to change.
4. Under **Environment Variables**, add:
   - Name: `OPENAI_API_KEY`
   - Value: your OpenAI key
   - Apply to Production (and Preview if you want).
5. Click **Deploy**. You get a public URL like `https://workwrite-ai.vercel.app`.
   It opens in one click, no install, no extension.

After deploying, any code change you push to GitHub redeploys automatically.

## Where to customise
- **Models:** `lib/models.js` — change the `id` for fast/balanced/best.
- **Prompts / behaviour:** `lib/prompts.js` — wording for each mode and the analysis.
- **Defaults (tone, mode, model):** the in-app **Settings** page (saved to your browser).

## Notes / limits
- Vercel serverless functions accept request bodies up to ~4.5 MB, so keep attachments
  reasonably small.
- PDF text extraction works on text-based PDFs (not scanned images of text).
- Make sure the model IDs in `lib/models.js` are ones your OpenAI account can access.
