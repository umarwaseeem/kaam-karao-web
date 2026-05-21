import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Chrome } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    const { name, email, phone, password } = form;
    if (!name || !email || !phone || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    // Placeholder — integrate with your backend
    alert('Signup submitted (backend not wired yet)');
  };

  const fields = [
    { id: 'name',     label: 'Full name',    icon: User,  type: 'text',     placeholder: 'Ali Hassan',         autoComplete: 'name' },
    { id: 'email',    label: 'Email',         icon: Mail,  type: 'email',    placeholder: 'you@example.com',    autoComplete: 'email' },
    { id: 'phone',    label: 'Phone number',  icon: Phone, type: 'tel',      placeholder: '+92 300 0000000',    autoComplete: 'tel' },
  ];

  return (
    <div className="min-h-screen font-rubik">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen px-6 pt-20 pb-10">
        <div className="w-full max-w-md">
          <div className="bg-surface border-subtle rounded-2xl p-8">
            {/* Logo mark */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl gradient-primary glow-primary flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">K</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Create your account</h1>
              <p className="text-muted text-sm mt-1">Start booking services in seconds</p>
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-elevated border-subtle rounded-xl py-3 text-sm text-white font-medium hover:bg-elevated/70 transition-colors mb-6"
            >
              <Chrome size={18} className="text-primary" />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-muted text-xs">or sign up with email</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map(({ id, label, icon: Icon, type, placeholder, autoComplete }) => (
                <div key={id}>
                  <label className="block text-sm font-medium text-white mb-1.5" htmlFor={id}>
                    {label}
                  </label>
                  <div className="relative">
                    <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      id={id}
                      name={id}
                      type={type}
                      autoComplete={autoComplete}
                      value={form[id]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full bg-elevated border border-white/[0.08] focus:border-primary rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-muted outline-none transition-colors"
                    />
                  </div>
                </div>
              ))}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
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
                Create account
              </button>
            </form>

            <p className="text-center text-xs text-muted mt-4">
              By signing up you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms</a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>

            <p className="text-center text-sm text-muted mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
