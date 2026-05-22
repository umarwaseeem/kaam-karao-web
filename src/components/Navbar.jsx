import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: '#features', label: 'Features' },
    { to: '#how-it-works', label: 'How it works' },
    { to: '#services', label: 'Services' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Kaam Karao" className="w-8 h-8 object-contain" />
          <span className="font-bold text-white text-lg">Kaam Karao</span>
        </Link>

        {/* Desktop links */}
        {pathname === '/' && (
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a
                key={l.to}
                href={l.to}
                className="text-muted hover:text-white text-sm transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-muted hover:text-white transition-colors px-4 py-2"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="text-sm bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Get started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-muted hover:text-white"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-surface border-t border-white/[0.06] px-6 py-4 flex flex-col gap-4">
          {pathname === '/' && links.map(l => (
            <a
              key={l.to}
              href={l.to}
              className="text-muted hover:text-white text-sm transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
            <Link to="/login" className="text-sm text-muted hover:text-white py-2" onClick={() => setOpen(false)}>
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-primary text-white font-medium px-4 py-2 rounded-lg text-center"
              onClick={() => setOpen(false)}
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
