export const runtime = 'nodejs';
export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return Response.json({ error: 'OpenAI API key is not configured' }, { status: 503 });
  const form = await request.formData();
  const audio = form.get('audio');
  if (!(audio instanceof File) || audio.size === 0 || audio.size > 10 * 1024 * 1024 || !audio.type.startsWith('audio/')) return Response.json({ error: 'Audio must be under 10 MiB' }, { status: 400 });
  const upload = new FormData();
  upload.set('file', audio, audio.name || 'recording.webm'); upload.set('model', 'whisper-1');
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: upload, signal: AbortSignal.timeout(30000) });
  if (!response.ok) return Response.json({ error: 'Transcription provider error' }, { status: 502 });
  const data = await response.json();
  return Response.json({ text: String(data.text ?? '').slice(0, 20000) });
}
