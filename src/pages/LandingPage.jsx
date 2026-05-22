import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle, Zap, Star, MessageCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ── data ────────────────────────────────────────────────── */
const SERVICES = [
  { label: 'AC Technician', emoji: '❄️', color: 'from-cyan-500/20 to-teal-500/10' },
  { label: 'Electrician',   emoji: '⚡', color: 'from-yellow-500/20 to-amber-500/10' },
  { label: 'Plumber',       emoji: '🔧', color: 'from-blue-500/20 to-indigo-500/10' },
  { label: 'Home Cleaner',  emoji: '🏠', color: 'from-green-500/20 to-emerald-500/10' },
  { label: 'Tutor',         emoji: '📚', color: 'from-purple-500/20 to-violet-500/10' },
  { label: 'Beautician',    emoji: '✨', color: 'from-pink-500/20 to-rose-500/10' },
];

const CHAT_MESSAGES = [
  { user: true,  text: 'Mujhe kal subah 10 baje plumber chahiye, leakage hai' },
  { user: false, text: 'Got it! Finding verified plumbers near you…' },
  { user: false, text: '✅ Found 3 providers. Best match: **Tariq Plumbing** — ⭐ 4.8 · 1.2 km · Rs. 500–800' },
  { user: false, text: '📅 Booking confirmed for tomorrow 10:00 AM. Reminder scheduled.' },
];

const STATS = [
  { value: '< 60s',   label: 'Avg. booking time' },
  { value: '4.8★',    label: 'Provider rating' },
  { value: '3 langs', label: 'Urdu · Roman · English' },
  { value: '100%',    label: 'Free to use' },
];

const STEPS = [
  {
    title: 'Just say what you need',
    desc: '"Mujhe kal subah plumber chahiye" — our AI understands Urdu, Roman Urdu, and English naturally.',
    icon: MessageCircle,
  },
  {
    title: 'AI finds the best match',
    desc: 'We rank nearby verified providers by rating, distance, and availability — with clear reasoning.',
    icon: Zap,
  },
  {
    title: 'Confirmed in one tap',
    desc: 'The provider is notified, a reminder is scheduled, and you get full booking details instantly.',
    icon: CheckCircle,
  },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

/* ── component ───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen font-rubik bg-bg text-on-bg overflow-x-hidden">
      <Navbar />

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* radial glow bg */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-[#00b4a6]/8 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6">
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-medium px-3.5 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  AI-powered service booking for Pakistan
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                Book any
                <br />
                <span className="text-gradient">home service</span>
                <br />
                in seconds.
              </motion.h1>

              <motion.p variants={fadeUp} className="text-muted text-lg md:text-xl leading-relaxed max-w-lg">
                Just tell Kaam Karao what you need — in Urdu, Roman Urdu, or English. Our AI finds, ranks, and books a trusted local provider for you instantly.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 gradient-primary glow-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                  Get started — it&apos;s free <ArrowRight size={15} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-elevated border border-[var(--color-border)] text-on-bg font-medium px-7 py-3.5 rounded-xl hover:bg-surface transition-colors text-sm"
                >
                  Sign in
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-2">
                {['No setup needed', 'Urdu & English', 'Instant confirmation'].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 text-xs text-muted">
                    <CheckCircle size={13} className="text-primary" /> {tag}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: logo + floating pills */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative flex justify-center items-center min-h-[340px]"
            >
              <div className="absolute w-72 h-72 rounded-full bg-primary/20 blur-[80px]" />
              <motion.img
                src="/logo.png"
                alt="Kaam Karao"
                className="relative z-10 w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {[
                { label: '⚡ Electrician booked!', delay: 0.7, className: 'left-0 top-8' },
                { label: '🔧 Plumber on the way',  delay: 0.9, className: 'right-0 top-4' },
                { label: '4.9★ Rated service',     delay: 1.1, className: 'left-2 bottom-12' },
                { label: '< 60s booking',          delay: 1.3, className: 'right-2 bottom-8' },
              ].map(({ label, delay, className }) => (
                <motion.div
                  key={label}
                  className={`absolute z-20 bg-surface/90 backdrop-blur-sm border border-[var(--color-border)] text-on-bg text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap ${className}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay, duration: 0.35 }}
                >
                  {label}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════ STATS BAR ════════ */}
      <section className="py-10 border-y border-[var(--color-border)] bg-surface">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {STATS.map(({ value, label }) => (
            <motion.div key={label} variants={fadeUp} className="text-center">
              <p className="text-2xl font-bold text-gradient">{value}</p>
              <p className="text-xs text-muted mt-1">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ════════ CHAT DEMO ════════ */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="order-2 lg:order-1 flex flex-col gap-5"
          >
            <motion.span variants={fadeUp} className="text-primary text-xs font-semibold uppercase tracking-widest">Conversational AI</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold leading-tight">
              Just talk to it.<br />Like a real person.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted text-base leading-relaxed max-w-md">
              No forms, no dropdowns. Type or speak in plain Urdu, Roman Urdu, or English — Kaam Karao handles the rest. It even understands slang.
            </motion.p>
            <motion.ul variants={stagger} className="flex flex-col gap-3">
              {[
                'Understands Urdu, Roman Urdu & English',
                'Voice input — speak your request',
                'Smart ranking by distance, rating & price',
                'Auto-scheduled reminders',
              ].map((item) => (
                <motion.li key={item} variants={fadeUp} className="flex items-center gap-2.5 text-sm text-on-bg/80">
                  <CheckCircle size={15} className="text-primary flex-shrink-0" /> {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="order-1 lg:order-2"
          >
            <ChatMockup />
          </motion.div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section id="how-it-works" className="py-28 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} className="text-primary text-xs font-semibold uppercase tracking-widest">How it works</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mt-3">
              From request to booked<br />in under a minute.
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            <div className="hidden md:block absolute top-8 left-[calc(16.7%)] right-[calc(16.7%)] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            {STEPS.map(({ title, desc, icon: Icon }, i) => (
              <motion.div key={title} variants={fadeUp} className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Icon size={26} className="text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-bg border border-[var(--color-border)] text-[10px] font-bold text-primary flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-on-bg text-lg">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════ SERVICES ════════ */}
      <section id="services" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.span variants={fadeUp} className="text-primary text-xs font-semibold uppercase tracking-widest">What we cover</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mt-3 mb-4">
              Every service you need,<br />right at your door.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted max-w-md mx-auto text-base">
              From emergency repairs to regular maintenance — Kaam Karao connects you to verified local providers.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {SERVICES.map(({ label, emoji, color }) => (
              <motion.div
                key={label} variants={fadeUp}
                className={`bg-gradient-to-br ${color} border border-white/[0.06] rounded-2xl p-6 flex flex-col items-start gap-3 hover:scale-[1.02] transition-transform cursor-default`}
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-sm font-semibold text-on-bg">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════ SOCIAL PROOF ════════ */}
      <section className="py-20 px-6 bg-surface">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={stagger} className="flex flex-col md:flex-row gap-6">
            {[
              { quote: '"Pehli baar itni asaani se plumber mila. 5 minute mein booking ho gayi!"', name: 'Ahmed K.', location: 'G-11, Islamabad', stars: 5 },
              { quote: '"The AI understood my Urdu request perfectly. Electrician arrived on time — highly recommend."', name: 'Sara M.', location: 'DHA, Lahore', stars: 5 },
              { quote: '"Kaam Karao saved me hours of calling around. Just typed what I needed and done."', name: 'Bilal R.', location: 'Gulshan, Karachi', stars: 5 },
            ].map(({ quote, name, location, stars }) => (
              <motion.div key={name} variants={fadeUp} className="flex-1 bg-bg border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" className="text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-on-bg/80 leading-relaxed flex-1">{quote}</p>
                <div>
                  <p className="text-sm font-semibold text-on-bg">{name}</p>
                  <p className="text-xs text-muted">{location}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="py-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <img src="/logo.png" alt="Kaam Karao" className="w-24 h-24 object-contain mx-auto mb-8 drop-shadow-xl" />
          <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Ready to get things done?
          </h2>
          <p className="text-muted text-lg mb-10 max-w-md mx-auto">
            Join thousands of users across Pakistan booking home services the smart way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 gradient-primary glow-primary text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-base"
            >
              Create a free account <ArrowRight size={17} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-elevated border border-[var(--color-border)] text-on-bg font-medium px-8 py-4 rounded-xl hover:bg-surface transition-colors text-base"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Chat mockup ─────────────────────────────────────────── */
function ChatMockup() {
  return (
    <div className="relative">
      <div className="bg-bg border border-[var(--color-border)] rounded-3xl p-4 shadow-2xl shadow-black/40 max-w-sm mx-auto">
        {/* header */}
        <div className="flex items-center gap-2 mb-5 px-1">
          <img src="/logo.png" alt="" className="w-7 h-7 object-contain" />
          <div>
            <p className="text-xs font-semibold text-on-bg">Kaam Karao AI</p>
            <p className="text-[10px] text-primary">● Online</p>
          </div>
        </div>
        {/* messages */}
        <div className="flex flex-col gap-3 px-1">
          {CHAT_MESSAGES.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`flex ${msg.user ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  msg.user
                    ? 'gradient-primary text-white rounded-br-sm'
                    : 'bg-surface border border-[var(--color-border)] text-on-bg rounded-bl-sm'
                }`}
              >
                {msg.text.split('**').map((part, j) =>
                  j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {/* composer */}
        <div className="mt-4 flex items-center gap-2 bg-surface border border-[var(--color-border)] rounded-xl px-3 py-2">
          <span className="text-xs text-muted flex-1">Type in Urdu, Roman or English…</span>
          <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <ArrowRight size={11} className="text-white" />
          </div>
        </div>
      </div>
      <div className="absolute -inset-4 rounded-[2.5rem] border border-primary/10 pointer-events-none" />
    </div>
  );
}
