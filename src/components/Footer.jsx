import { Link } from 'react-router-dom';
import { Bot, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-white text-lg">Kaam Karao</span>
          </div>
          <p className="text-muted text-sm leading-relaxed">
            AI-powered service booking for the informal economy. Connect with trusted local providers instantly.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-white font-medium mb-4 text-sm">Product</p>
          <ul className="space-y-2">
            {['Features', 'How it works', 'Services'].map(t => (
              <li key={t}>
                <a href={`#${t.toLowerCase().replace(/ /g, '-')}`} className="text-muted hover:text-white text-sm transition-colors">
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <p className="text-white font-medium mb-4 text-sm">Account</p>
          <ul className="space-y-2">
            <li>
              <Link to="/login" className="text-muted hover:text-white text-sm transition-colors">Log in</Link>
            </li>
            <li>
              <Link to="/signup" className="text-muted hover:text-white text-sm transition-colors">Sign up</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-4 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-muted text-xs">&copy; {new Date().getFullYear()} Kaam Karao. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors">
            <Github size={16} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors">
            <Twitter size={16} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors">
            <Linkedin size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
