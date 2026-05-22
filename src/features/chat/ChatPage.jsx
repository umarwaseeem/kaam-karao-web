import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Send, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { useLocation } from '../../contexts/LocationContext.jsx';
import { useDispatchController } from './useDispatchController.js';
import { MessageBubble, StreamingBubble } from './components/MessageBubble.jsx';
import { VoiceOverlay } from './components/VoiceOverlay.jsx';
import { useSpeechRecognition, isVoiceSupported } from '../../hooks/useSpeechRecognition.js';
import { IconButton } from '../../components/ui/index.jsx';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { threadId: routeThreadId } = useParams();
  const [searchParams] = useSearchParams();
  const prefill = searchParams.get('prefill');
  const { user } = useAuth();
  const { t } = useLanguage();
  const { location } = useLocation();
  const { state, sendMessage, loadThread, newThread } = useDispatchController({ userId: user?.id, location });
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const prefillSent = useRef(false);

  // Load thread history if navigated with a threadId
  useEffect(() => {
    if (routeThreadId && routeThreadId !== state.threadId) {
      loadThread(routeThreadId);
    }
  }, [routeThreadId]); // eslint-disable-line

  // Auto-send prefill once
  useEffect(() => {
    if (prefill && !prefillSent.current && !routeThreadId) {
      prefillSent.current = true;
      setTimeout(() => sendMessage(prefill), 300);
    }
  }, [prefill]); // eslint-disable-line

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.streamingText, state.liveSteps]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendMessage(text);
  }, [input, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Voice
  const handleVoiceResult = useCallback((text) => {
    setInput(text);
    setTimeout(() => sendMessage(text), 200);
  }, [sendMessage]);

  const { isListening, transcript, level, start: startVoice, stop: stopVoice } = useSpeechRecognition({
    onResult: handleVoiceResult,
  });

  const handleMicClick = () => {
    if (!isVoiceSupported) { toast.error('Voice input is not supported in this browser.'); return; }
    if (isListening) stopVoice(); else startVoice();
  };

  const isEmpty = state.messages.length === 0 && !state.isStreaming && !prefill;

  return (
    <div className="flex flex-col h-full relative">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] bg-surface/80 backdrop-blur-sm">
        <div>
          <h2 className="font-semibold text-on-bg text-sm">
            {routeThreadId ? t('past_conversation') : t('ai_assistant')}
          </h2>
          {state.isStreaming && <p className="text-xs text-primary animate-pulse">{t('thinking')}</p>}
        </div>
        <IconButton icon={Plus} label={t('new_chat')} onClick={newThread} title={t('new_chat')} />
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-5 scroll-smooth">
        {isEmpty ? (
          <ChatEmptyState t={t} onSuggestionClick={(s) => sendMessage(s)} />
        ) : (
          <>
            {state.messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {state.isStreaming && (
              <StreamingBubble text={state.streamingText} steps={state.liveSteps} />
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="px-4 py-3 border-t border-[var(--color-border)] bg-surface/80 backdrop-blur-sm">
        <div className="flex items-end gap-2 bg-elevated rounded-2xl px-3 py-2.5 border border-[var(--color-border)]">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('type_message')}
            rows={1}
            disabled={state.isStreaming}
            className="flex-1 bg-transparent resize-none text-sm text-on-bg placeholder-muted focus:outline-none max-h-32 leading-relaxed"
            style={{ minHeight: '24px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
            }}
          />
          <div className="flex items-center gap-1 flex-shrink-0">
            {isVoiceSupported && (
              <motion.button
                onClick={handleMicClick}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white' : 'text-muted hover:text-on-bg hover:bg-bg'}`}
                title={t('voice_input')}
              >
                <Mic size={18} />
              </motion.button>
            )}
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || state.isStreaming}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl gradient-primary text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              title={t('send')}
            >
              <Send size={18} />
            </motion.button>
          </div>
        </div>
        <p className="text-[10px] text-muted text-center mt-2">{t('chat_disclaimer')}</p>
      </div>

      {/* Voice overlay */}
      <VoiceOverlay isListening={isListening} transcript={transcript} level={level} onStop={stopVoice} />
    </div>
  );
}

function ChatEmptyState({ t, onSuggestionClick }) {
  const suggestions = [
    'I need an AC technician urgently',
    'Find me a plumber near G-11',
    'Book a house cleaner for tomorrow',
    'I need an electrician for wiring',
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 py-10"
    >
      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-3xl">
        🤖
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-on-bg text-lg">{t('ai_assistant')}</h3>
        <p className="text-muted text-sm mt-1 max-w-xs">{t('chat_intro')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s)}
            className="text-left text-xs text-on-bg/80 bg-surface border-subtle rounded-xl px-3 py-2.5 hover:border-primary/40 hover:bg-elevated transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
