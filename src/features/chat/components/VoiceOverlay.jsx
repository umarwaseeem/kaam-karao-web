import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X } from 'lucide-react';

const BARS = 12;

export function VoiceOverlay({ isListening, transcript, level, onStop }) {
  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-8 px-8"
        >
          {/* Waveform */}
          <div className="flex items-end justify-center gap-1 h-16">
            {Array.from({ length: BARS }).map((_, i) => {
              const phase = i / BARS;
              const amplitude = Math.max(0.1, level * (0.5 + 0.5 * Math.sin(phase * Math.PI)));
              return (
                <motion.div
                  key={i}
                  className="w-2 bg-primary rounded-full"
                  animate={{ height: `${Math.max(8, amplitude * 60)}px` }}
                  transition={{ duration: 0.1 }}
                />
              );
            })}
          </div>

          {/* Pulse ring */}
          <div className="relative flex items-center justify-center">
            <motion.div
              className="absolute w-24 h-24 rounded-full bg-primary/20"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <Mic size={28} className="text-white" />
            </div>
          </div>

          <p className="text-white font-medium text-lg">Listening...</p>
          {transcript && (
            <p className="text-muted text-sm text-center max-w-sm">{transcript}</p>
          )}

          {/* Stop */}
          <button
            onClick={onStop}
            className="mt-2 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <X size={16} /> Stop
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
