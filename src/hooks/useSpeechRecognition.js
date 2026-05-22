import { useCallback, useEffect, useRef, useState } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export const isVoiceSupported = !!SpeechRecognition;

export function useSpeechRecognition({ onResult, onEnd } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [level, setLevel] = useState(0); // 0-1 amplitude for waveform
  const recognitionRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  const stopAmplitude = () => {
    cancelAnimationFrame(animFrameRef.current);
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    setLevel(0);
  };

  const startAmplitude = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      const tick = () => {
        analyserRef.current?.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setLevel(Math.min(avg / 128, 1));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {}
  };

  const start = useCallback(() => {
    if (!isVoiceSupported || isListening) return;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (e) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
      if (final) { onResult?.(final); }
    };
    rec.onend = () => {
      setIsListening(false);
      stopAmplitude();
      onEnd?.();
    };
    rec.onerror = () => { setIsListening(false); stopAmplitude(); };

    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
    setTranscript('');
    startAmplitude();
  }, [isListening, onResult, onEnd]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => () => { recognitionRef.current?.abort(); stopAmplitude(); }, []);

  return { isListening, transcript, level, start, stop };
}
