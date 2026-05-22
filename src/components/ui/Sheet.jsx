import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Bottom sheet / modal — slides up from bottom on mobile, centered on desktop.
 */
export function Sheet({ open, onClose, title, children }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 300 } }}
            exit={{ y: '100%', opacity: 0, transition: { duration: 0.2 } }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-[var(--color-border)] rounded-t-2xl max-h-[80vh] overflow-y-auto md:max-w-lg md:mx-auto md:rounded-2xl md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:border"
          >
            {/* Handle */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="w-10 h-1 rounded-full bg-[var(--color-border)] mx-auto md:hidden" />
            </div>
            {title && (
              <div className="flex items-center justify-between px-5 pb-3 border-b border-[var(--color-border)]">
                <h3 className="font-semibold text-on-bg">{title}</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-on-bg hover:bg-elevated transition-colors">
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="px-5 py-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
