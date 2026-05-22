import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext.jsx';

export function AgentTraceDropdown({ steps }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  if (!steps?.length) return null;

  return (
    <div className="bg-surface border-subtle rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-xs font-medium text-muted hover:text-on-bg transition-colors"
      >
        <span>🔍 {open ? t('hide_trace') : t('show_trace')} ({steps.length} steps)</span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]">
              {steps.map((step, i) => (
                <StepRow key={i} step={step} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepRow({ step }) {
  const [expanded, setExpanded] = useState(false);
  const icon = step.success === false ? '❌' : step.success ? '✅' : step.inProgress ? '⏳' : '🔄';
  const hasDetails = step.inputSummary || step.outputSummary;

  return (
    <div className="px-4 py-2.5">
      <button
        onClick={() => hasDetails && setExpanded((e) => !e)}
        className={`flex items-start gap-2.5 w-full text-left ${hasDetails ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <span className="text-sm mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-on-bg/80">{step.agentLabel ?? step.tool}</p>
          {step.inputSummary && !expanded && (
            <p className="text-[11px] text-muted truncate mt-0.5">{step.inputSummary}</p>
          )}
        </div>
        {hasDetails && (expanded ? <ChevronUp size={12} className="text-muted mt-1 flex-shrink-0" /> : <ChevronDown size={12} className="text-muted mt-1 flex-shrink-0" />)}
      </button>
      {expanded && (
        <div className="ml-7 mt-1.5 flex flex-col gap-1">
          {step.inputSummary && <p className="text-[11px] text-muted"><span className="text-on-bg/60">Input: </span>{step.inputSummary}</p>}
          {step.outputSummary && <p className="text-[11px] text-muted"><span className="text-on-bg/60">Output: </span>{step.outputSummary}</p>}
        </div>
      )}
    </div>
  );
}
