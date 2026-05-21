import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    // Placeholder — integrate with your backend
    alert('Login submitted (backend not wired yet)');
  };

  return (
    <div className="min-h-screen font-rubik">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen px-6 pt-20 pb-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-surface border-subtle rounded-2xl p-8">
            {/* Logo mark */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl gradient-primary glow-primary flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">K</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Welcome back</h1>
              <p className="text-muted text-sm mt-1">Sign in to your Kaam Karao account</p>
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-elevated border-subtle rounded-xl py-3 text-sm text-white font-medium hover:bg-elevated/70 transition-colors mb-6"
            >
              <Globe size={18} className="text-primary" />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-muted text-xs">or continue with email</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-elevated border border-white/[0.08] focus:border-primary rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-muted outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-white" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-elevated border border-white/[0.08] focus:border-primary rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-muted outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-error text-xs">{error}</p>
              )}

              <button
                type="submit"
                className="w-full gradient-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm mt-2"
              >
                Log in
              </button>
            </form>

            <p className="text-center text-sm text-muted mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
