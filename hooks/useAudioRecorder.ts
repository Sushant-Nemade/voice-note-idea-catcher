'use client';
import { useRef, useState } from 'react';
export function useAudioRecorder() {
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  async function start() {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = media;
      const chunks: BlobPart[] = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
      const next = new MediaRecorder(media, mimeType ? { mimeType } : undefined);
      next.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      next.onstop = () => { setBlob(new Blob(chunks, { type: next.mimeType })); media.getTracks().forEach(track => track.stop()); stream.current = null; setRecording(false); };
      next.start(500); recorder.current = next; setBlob(null); setRecording(true); setError('');
    } catch { setError('Microphone permission or recording is unavailable.'); }
  }
  function stop() { recorder.current?.stop(); }
  return { recording, blob, error, start, stop };
}
