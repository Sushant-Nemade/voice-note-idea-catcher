export function structureTranscript(text) {
  const sentences = String(text).split(/[.!?]\s+/).map(x => x.trim()).filter(Boolean);
  const actions = sentences.filter(x => /\b(need to|should|must|todo|follow up|send|make|build|create)\b/i.test(x));
  const words = (String(text).toLowerCase().match(/[a-z]{5,}/g) ?? []).filter(x => !['about','there','their','would','could','should'].includes(x));
  const tags = [...new Set(words)].slice(0, 5);
  return { summary: sentences[0] ?? '', actions, tags };
}
