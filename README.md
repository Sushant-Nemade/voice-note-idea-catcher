# Voice Note Idea Catcher

Next.js browser recorder with `useAudioRecorder.ts`, transcript editor, action extraction, tags, and search. A sample note works without credentials. Real transcription sends the recorded audio to OpenAI Whisper through `/api/transcribe` only when `OPENAI_API_KEY` is configured.

Run `pnpm install`, `pnpm --filter voice-note-idea-catcher dev`, then open `http://127.0.0.1:3004`. Copy `.env.example` to `.env` to enable real transcription. A microphone requires HTTPS or localhost and browser permission.

`POST /api/structure` is an optional GPT-4o extraction endpoint. The public demo uses a local rules-based extractor to avoid paid inference. Supabase or S3 persistence, user authentication, a permanent idea hub, and PWA offline installation are not configured; do not treat this preview as a production note archive. Recordings are not stored on the server.
