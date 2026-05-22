import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export function useLanguage() { /* re-exported for convenience */ }

/**
 * @param {{ value: string, onChange: (v:string)=>void, options: {value:string,label:string}[], className?: string }} props
 */
export function Dropdown({ value, onChange, options, className }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className={clsx('relative', className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-elevated border-subtle rounded-xl px-3 py-2 text-sm text-on-bg hover:bg-elevated/70 transition-colors min-w-[110px]"
      >
        <span className="flex-1 text-left">{selected?.label ?? value}</span>
        <ChevronDown size={14} className={clsx('text-muted transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-1 min-w-[140px] bg-elevated border-subtle rounded-xl shadow-xl z-30 overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={clsx(
                  'w-full text-left px-4 py-2.5 text-sm hover:bg-surface transition-colors',
                  opt.value === value ? 'text-primary font-medium' : 'text-on-bg'
                )}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
