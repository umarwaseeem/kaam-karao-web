import { Link } from 'react-router-dom';
import {
  Bot, Users, Zap, ShieldCheck,
  MapPin, Star, Clock, MessageCircle,
  Wrench, Zap as ZapIcon, Book, Scissors, Home,
  ArrowRight, CheckCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Booking',
    desc: 'Tell us what you need in plain language — Urdu, Roman Urdu, or English. Our AI understands your request instantly.',
  },
  {
    icon: Users,
    title: 'Trusted Providers',
    desc: 'Verified local service providers with real ratings, reviews, and availability shown in real time.',
  },
  {
    icon: Zap,
    title: 'Instant Matching',
    desc: 'Get matched with the best nearby provider within seconds. No phone calls, no waiting.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Reliable',
    desc: 'Every booking is confirmed, tracked, and followed up automatically so nothing falls through the cracks.',
  },
];

const services = [
  { icon: Wrench, label: 'Plumbers' },
  { icon: ZapIcon, label: 'Electricians' },
  { icon: Home, label: 'Home Cleaners' },
  { icon: Book, label: 'Tutors' },
  { icon: Scissors, label: 'Beauticians' },
  { icon: Wrench, label: 'AC Technicians' },
];

const steps = [
  {
    step: '01',
    title: 'Describe your need',
    desc: 'Type or speak your request in any language. "Mujhe kal subah plumber chahiye" — we get it.',
  },
  {
    step: '02',
    title: 'Review top providers',
    desc: 'See ranked results with distance, ratings, and availability. Clear reasoning for every suggestion.',
  },
  {
    step: '03',
    title: 'Confirm your booking',
    desc: 'One tap to confirm. The provider is notified instantly and a reminder is scheduled automatically.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen font-rubik">
      <Navbar />

      {/* ── Hero ── */}
      <section className="gradient-hero pt-32 pb-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-surface border-subtle rounded-full px-4 py-1.5 mb-6 text-xs text-muted">
            <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse" />
            AI-powered service booking
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Book any service
            <br />
            <span className="text-gradient">in seconds, not hours</span>
          </h1>

          <p className="text-muted text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Kaam Karao connects you with trusted local professionals instantly using AI — plumbers, electricians, tutors, and more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 gradient-primary glow-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              Get started free <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-elevated border-subtle text-white font-medium px-8 py-3.5 rounded-xl hover:bg-elevated/80 transition-colors text-sm"
            >
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-primary" />
              <span>No setup required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-primary" />
              <span>Urdu &amp; English support</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-primary" />
              <span>Real-time availability</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Built for Pakistan&apos;s informal economy — where most services still run on WhatsApp and phone calls.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-surface border-subtle rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon size={22} className="text-primary" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted max-w-md mx-auto">
              From intent to booked appointment in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-2xl gradient-primary mx-auto mb-5 flex items-center justify-center text-white font-bold text-lg">
                  {step}
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Services we cover</h2>
          <p className="text-muted max-w-md mx-auto">
            From AC repairs to tutoring — if it&apos;s a local service, Kaam Karao has you covered.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {services.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="bg-surface border-subtle rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-primary/40 hover:bg-elevated transition-all cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
              </div>
              <span className="text-sm text-white font-medium text-center">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center bg-surface border-subtle rounded-3xl p-12 glow-primary">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get things done?
          </h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Join thousands of users already booking services the smart way.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 gradient-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            Create a free account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
