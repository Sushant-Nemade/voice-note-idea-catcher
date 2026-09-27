export const runtime = 'nodejs';
export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return Response.json({ error: 'OpenAI API key is not configured' }, { status: 503 });
  const body = await request.json(); const text = String(body.text ?? '').trim().slice(0, 20000);
  if (!text) return Response.json({ error: 'Text required' }, { status: 400 });
  const response = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-4o', instructions: 'Extract a brief summary, action items, and up to five short tags. Return only a JSON object with keys summary (string), actions (array of strings), tags (array of strings).', input: text, max_output_tokens: 500 }), signal: AbortSignal.timeout(30000) });
  if (!response.ok) return Response.json({ error: 'AI provider error' }, { status: 502 });
  const data = await response.json();
  const output = data.output?.flatMap((item: { content?: { type: string; text?: string }[] }) => item.content ?? []).find((item: { type: string }) => item.type === 'output_text')?.text ?? '';
  try { const parsed = JSON.parse(output); return Response.json({ summary: String(parsed.summary ?? ''), actions: Array.isArray(parsed.actions) ? parsed.actions.map(String).slice(0, 20) : [], tags: Array.isArray(parsed.tags) ? parsed.tags.map(String).slice(0, 5) : [] }); } catch { return Response.json({ error: 'Invalid AI response' }, { status: 502 }); }
}
