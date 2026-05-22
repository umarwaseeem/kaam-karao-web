import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ChevronUp, Star, Phone, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../components/ui/index.jsx';
import { AgentTraceDropdown } from './AgentTraceDropdown.jsx';

export function MessageBubble({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div className={`max-w-[85%] ${msg.isUser ? '' : 'flex flex-col gap-3 w-full max-w-2xl'}`}>
        {msg.isUser ? (
          <div className="gradient-primary text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed">
            {msg.text}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* AI text */}
            <div className="bg-surface border-subtle px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed text-on-bg prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
            </div>

            {/* Live steps / trace */}
            {msg.agentSteps?.length > 0 && <AgentTraceDropdown steps={msg.agentSteps} />}

            {/* Ranked providers */}
            {msg.rankedProviders?.length > 0 && (
              <div className="flex flex-col gap-2">
                {msg.rankedProviders.slice(0, 3).map((rp, i) => (
                  <ProviderCard key={i} ranked={rp} isTop={i === 0} />
                ))}
              </div>
            )}

            {/* Booking result */}
            {msg.bookingResult?.booking && <BookingResultCard booking={msg.bookingResult.booking} priceMin={msg.bookingResult.price_min} priceMax={msg.bookingResult.price_max} />}

            {/* Plan */}
            {msg.plan?.steps?.length > 0 && <PlanList plan={msg.plan} />}

            {/* Reminder */}
            {msg.reminder && <ReminderChip reminder={msg.reminder} />}

            {/* Clarification */}
            {msg.requiresClarification && msg.clarificationQuestion && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-300">
                {msg.clarificationQuestion}
              </div>
            )}
          </div>
        )}
        <p className={`text-[10px] text-muted mt-1 ${msg.isUser ? 'text-right' : 'text-left'}`}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}

export function StreamingBubble({ text, steps }) {
  return (
    <div className="flex justify-start mb-3">
      <div className="flex flex-col gap-3 w-full max-w-2xl">
        {steps?.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {steps.map((s, i) => <LiveStepRowInline key={i} step={s} />)}
          </div>
        )}
        {text && (
          <div className="bg-surface border-subtle px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed text-on-bg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
            <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 align-middle rounded-sm" />
          </div>
        )}
        {!text && steps?.length === 0 && (
          <div className="flex items-center gap-2 px-4 py-3 bg-surface border-subtle rounded-2xl">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{ y: [0, -5, 0] }} transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }} />
              ))}
            </div>
            <span className="text-muted text-sm">Working on it...</span>
          </div>
        )}
      </div>
    </div>
  );
}

function LiveStepRowInline({ step }) {
  const statusIcon = step.inProgress ? '⏳' : step.success === false ? '❌' : step.success ? '✅' : '🔄';
  return (
    <div className="flex items-start gap-2 text-xs text-muted px-1">
      <span>{statusIcon}</span>
      <span className="font-medium text-on-bg/70">{step.agentLabel}</span>
      {step.inputSummary && <span className="text-muted">— {step.inputSummary}</span>}
      {step.outputSummary && !step.inProgress && <span className="text-green-400">→ {step.outputSummary}</span>}
    </div>
  );
}

function ProviderCard({ ranked, isTop }) {
  const p = ranked?.provider ?? ranked;
  if (!p) return null;
  return (
    <div className={`border rounded-2xl p-4 ${isTop ? 'border-primary/40 bg-primary/5' : 'border-[var(--color-border)] bg-surface'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-on-bg text-sm truncate">{p.name}</p>
            {isTop && <Badge variant="primary" className="text-[10px]">Best match</Badge>}
          </div>
          <p className="text-xs text-muted mt-0.5">{p.service_category ?? p.area}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {p.rating && (
              <span className="flex items-center gap-1 text-xs text-amber-400">
                <Star size={11} fill="currentColor" /> {p.rating}
              </span>
            )}
            {p.distance_km && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <MapPin size={11} /> {p.distance_km}km
              </span>
            )}
            {(p.price_estimate_min || p.price_estimate_max) && (
              <span className="text-xs text-muted">
                Rs. {p.price_estimate_min}–{p.price_estimate_max}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          {p.phone && (
            <a href={`tel:${p.phone}`} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Phone size={14} />
            </a>
          )}
          {p.google_maps_uri && (
            <a href={p.google_maps_uri} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-elevated text-muted hover:text-on-bg transition-colors">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
      {ranked?.reasons?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {ranked.reasons.map((r, i) => <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{r}</span>)}
        </div>
      )}
    </div>
  );
}

function BookingResultCard({ booking, priceMin, priceMax }) {
  const navigate = useNavigate();
  return (
    <div className="border border-green-500/30 bg-green-500/5 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-green-400 text-lg">✅</span>
        <p className="font-semibold text-green-400 text-sm">Booking Confirmed</p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-muted">Provider</span><span className="text-on-bg font-medium">{booking.provider_name}</span>
        <span className="text-muted">Service</span><span className="text-on-bg">{booking.service}</span>
        <span className="text-muted">Slot</span><span className="text-on-bg">{booking.slot_label ?? booking.time}</span>
        <span className="text-muted">Location</span><span className="text-on-bg">{booking.area}</span>
        {(priceMin || priceMax) && <><span className="text-muted">Price</span><span className="text-on-bg">Rs. {priceMin}–{priceMax}</span></>}
      </div>
      <button
        onClick={() => navigate(`/app/bookings/${booking.id}`)}
        className="mt-3 text-xs text-primary hover:underline font-medium"
      >
        View booking →
      </button>
    </div>
  );
}

function PlanList({ plan }) {
  const [open, setOpen] = useState(false);
  if (!plan?.steps?.length) return null;
  return (
    <div className="bg-surface border-subtle rounded-xl px-4 py-3">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center justify-between w-full text-sm font-medium text-on-bg">
        <span>📋 Plan</span>
        {open ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
      </button>
      {open && (
        <ol className="mt-2 flex flex-col gap-1 list-decimal list-inside">
          {plan.steps.map((s, i) => <li key={i} className="text-xs text-muted">{s}</li>)}
        </ol>
      )}
    </div>
  );
}

function ReminderChip({ reminder }) {
  return (
    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
      <span className="text-sm">⏰</span>
      <p className="text-xs text-amber-300">{reminder.message}</p>
    </div>
  );
}
