'use client';
import { useMemo, useState } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { structureTranscript } from '../lib/ideas.mjs';
const sample = 'Need to send the partnership proposal tomorrow. The idea is a weekly series on practical AI tools for small teams. Create three pilot videos and ask for feedback.';
export default function Page() {
  const recorder = useAudioRecorder();
  const [transcript, setTranscript] = useState(sample);
  const [message, setMessage] = useState('Showing a sample transcript. Microphone transcription requires an OpenAI API key.');
  const [search, setSearch] = useState('');
  const result = useMemo(() => structureTranscript(transcript), [transcript]);
  async function transcribe() { if (!recorder.blob) return; const form = new FormData(); form.set('audio', recorder.blob, 'note.webm'); setMessage('Transcribing…'); const response = await fetch('/api/transcribe', { method: 'POST', body: form }); const data = await response.json(); if (response.ok) { setTranscript(data.text); setMessage('Transcript ready.'); } else setMessage(data.error); }
  return <main><div className="eyebrow">VOICE NOTES · IDEA CAPTURE</div><header><h1>Voice Note Idea Catcher</h1><p>Record a thought, transcribe it, and turn it into a summary, action list, and tags.</p></header><section><h2>Record</h2><div className="row"><button onClick={recorder.recording ? recorder.stop : recorder.start}>{recorder.recording ? 'Stop recording' : 'Start recording'}</button><button className="secondary" disabled={!recorder.blob} onClick={transcribe}>Transcribe recording</button><button className="secondary" onClick={() => { setTranscript(sample); setMessage('Showing sample transcript.'); }}>Load example</button></div><p role="status">{recorder.error || message}</p></section><section><label htmlFor="transcript">Transcript</label><textarea id="transcript" value={transcript} onChange={e => setTranscript(e.target.value)} /></section><div className="grid"><article><h2>Summary</h2><p>{result.summary}</p></article><article><h2>Action items</h2><ul>{result.actions.map(action => <li key={action}>{action}</li>)}</ul></article><article><h2>Tags</h2><div className="row">{result.tags.map(tag => <span className="pill" key={tag}>{tag}</span>)}</div></article></div><section><h2>Search this note</h2><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Find words" />{search && <p>{transcript.toLowerCase().includes(search.toLowerCase()) ? 'Match found in transcript' : 'No match'}</p>}</section><footer>Notes are in this browser session only. Audio is sent to OpenAI only when you choose Transcribe and an API key is configured.</footer></main>;
}
