import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { Button, TextField, Divider } from '../components/ui/index.jsx';
import { LanguageSwitcherButton } from '../components/LanguageSwitcherButton.jsx';
import { renderGoogleButton } from '../lib/googleAuth.js';
import { ApiError } from '../lib/apiClient.js';

export default function LoginPage() {
  const { login, loginWithGoogle, isLoggedIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) navigate(params.get('next') ?? '/app/dashboard', { replace: true });
  }, [isLoggedIn, navigate, params]);

  useEffect(() => {
    const loadGoogle = () => {
      renderGoogleButton('google-btn-login', {
        callback: async ({ credential }) => {
          try {
            await loginWithGoogle({ idToken: credential });
            navigate(params.get('next') ?? '/app/dashboard', { replace: true });
          } catch (e) {
            toast.error(e instanceof ApiError ? e.message : t('login_failed'));
          }
        },
        width: googleBtnRef.current?.offsetWidth ?? 320,
      });
    };
    if (window.google?.accounts?.id) loadGoogle();
    else window.addEventListener('google-loaded', loadGoogle);
    return () => window.removeEventListener('google-loaded', loadGoogle);
  }, [loginWithGoogle, navigate, params, t]);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Required';
    if (!form.password) e.password = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate(params.get('next') ?? '/app/dashboard', { replace: true });
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : t('login_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-end mb-4"><LanguageSwitcherButton /></div>

        <div className="bg-surface border-subtle rounded-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="mb-4 block">
              <img src="/logo.png" alt="Kaam Karao" className="w-16 h-16 object-contain" />
            </Link>
            <h1 className="text-2xl font-bold text-on-bg">{t('welcome_back')}</h1>
            <p className="text-muted text-sm mt-1">{t('login_subtitle')}</p>
          </div>

          {/* Google button */}
          <div ref={googleBtnRef} id="google-btn-login" className="flex justify-center mb-5" />

          <Divider label={t('or_email')} className="mb-5" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label={t('email')} icon={Mail} type="email" autoComplete="email"
              placeholder="you@example.com" value={form.email} error={errors.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <div className="relative">
              <TextField
                label={t('password')} icon={Lock}
                type={showPwd ? 'text' : 'password'} autoComplete="current-password"
                placeholder="••••••••" value={form.password} error={errors.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                containerClass="w-full"
              />
              <button type="button" onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-[34px] text-muted hover:text-on-bg transition-colors"
                aria-label="Toggle password">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex justify-end">
              <a href="#" className="text-xs text-primary hover:underline">{t('forgot_password')}</a>
            </div>
            <Button type="submit" className="w-full mt-1" loading={loading}>{t('log_in')}</Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            {t('no_account')}{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">{t('sign_up')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
