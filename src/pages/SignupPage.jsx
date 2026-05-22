import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { Button, TextField, Divider } from '../components/ui/index.jsx';
import { LanguageSwitcherButton } from '../components/LanguageSwitcherButton.jsx';
import { renderGoogleButton } from '../lib/googleAuth.js';
import { ApiError } from '../lib/apiClient.js';
import { storage, KEYS } from '../lib/storage.js';

export default function SignupPage() {
  const { signup, loginWithGoogle, isLoggedIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) navigate('/app/dashboard', { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const loadGoogle = () => {
      renderGoogleButton('google-btn-signup', {
        text: 'signup_with',
        callback: async ({ credential }) => {
          try {
            await loginWithGoogle({ idToken: credential });
            storage.set(KEYS.HAS_SEEN_ONBOARDING, 'true');
            navigate('/app/dashboard', { replace: true });
          } catch (e) {
            toast.error(e instanceof ApiError ? e.message : t('signup_failed'));
          }
        },
        width: googleBtnRef.current?.offsetWidth ?? 320,
      });
    };
    if (window.google?.accounts?.id) loadGoogle();
    else window.addEventListener('google-loaded', loadGoogle);
    return () => window.removeEventListener('google-loaded', loadGoogle);
  }, [loginWithGoogle, navigate, t]);

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Required';
    if (!form.email) e.email = 'Required';
    if (!form.phone) e.phone = 'Required';
    if (!form.password) e.password = 'Required';
    else if (form.password.length < 6) e.password = t('password_length');
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup({ email: form.email, password: form.password, full_name: form.name, phone: form.phone });
      const hasSeen = storage.get(KEYS.HAS_SEEN_ONBOARDING) === 'true';
      navigate(hasSeen ? '/app/dashboard' : '/onboarding', { replace: true });
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : t('signup_failed'));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: 'name',     label: t('full_name'),    icon: User,  type: 'text',     placeholder: 'Ali Hassan',       autoComplete: 'name' },
    { id: 'email',    label: t('email'),         icon: Mail,  type: 'email',    placeholder: 'you@example.com',  autoComplete: 'email' },
    { id: 'phone',    label: t('phone_number'),  icon: Phone, type: 'tel',      placeholder: '+92 300 0000000',  autoComplete: 'tel' },
  ];

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-end mb-4"><LanguageSwitcherButton /></div>
        <div className="bg-surface border-subtle rounded-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="mb-4 block">
              <img src="/logo.png" alt="Kaam Karao" className="w-16 h-16 object-contain" />
            </Link>
            <h1 className="text-2xl font-bold text-on-bg">{t('sign_up')}</h1>
            <p className="text-muted text-sm mt-1">{t('signup_subtitle')}</p>
          </div>

          <div ref={googleBtnRef} id="google-btn-signup" className="flex justify-center mb-5" />
          <Divider label={t('or_signup_email')} className="mb-5" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ id, label, icon, type, placeholder, autoComplete }) => (
              <TextField key={id} label={label} icon={icon} type={type}
                placeholder={placeholder} autoComplete={autoComplete}
                value={form[id]} error={errors[id]}
                onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
              />
            ))}
            <div className="relative">
              <TextField
                label={t('password')} icon={Lock}
                type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                placeholder="Min. 6 characters" value={form.password} error={errors.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                containerClass="w-full"
              />
              <button type="button" onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-[34px] text-muted hover:text-on-bg transition-colors"
                aria-label="Toggle password">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Button type="submit" className="w-full mt-1" loading={loading}>{t('sign_up')}</Button>
          </form>

          <p className="text-center text-xs text-muted mt-4">
            By signing up you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms</a> and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
          <p className="text-center text-sm text-muted mt-5">
            {t('have_account')}{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">{t('log_in')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
