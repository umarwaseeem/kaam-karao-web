import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Users, Zap, ShieldCheck, MapPin, Bell, Mic, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useLocation } from '../contexts/LocationContext.jsx';
import { storage, KEYS } from '../lib/storage.js';
import { Button } from '../components/ui/index.jsx';

const PAGES = [
  {
    icon: Bot,
    color: 'from-teal-500 to-cyan-600',
    titleKey: 'onboarding_title_1',
    descKey: 'onboarding_desc_1',
  },
  {
    icon: Users,
    color: 'from-violet-500 to-purple-600',
    titleKey: 'onboarding_title_2',
    descKey: 'onboarding_desc_2',
  },
  {
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    titleKey: 'onboarding_title_3',
    descKey: 'onboarding_desc_3',
  },
  {
    icon: ShieldCheck,
    color: 'from-green-500 to-emerald-600',
    titleKey: 'allow_access',
    descKey: 'allow_access_desc',
    isPermissions: true,
  },
];

function PermissionRow({ icon: Icon, label, onGrant, granted }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon size={18} className="text-primary" />
        </div>
        <span className="text-sm font-medium text-on-bg">{label}</span>
      </div>
      {granted ? (
        <span className="text-xs text-green-400 font-medium">Granted</span>
      ) : (
        <button onClick={onGrant} className="text-xs text-primary font-medium hover:underline">Grant</button>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  const { t } = useLanguage();
  const { refresh: refreshLocation } = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [locGranted, setLocGranted] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const [notifGranted, setNotifGranted] = useState(false);
  const isLast = page === PAGES.length - 1;

  const complete = () => {
    storage.set(KEYS.HAS_SEEN_ONBOARDING, 'true');
    navigate('/login');
  };

  const handleGrant = async (type) => {
    if (type === 'location') {
      try { await refreshLocation(); setLocGranted(true); } catch {}
    } else if (type === 'mic') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicGranted(true);
      } catch {}
    } else if (type === 'notifications') {
      if ('Notification' in window) {
        const result = await Notification.requestPermission();
        if (result === 'granted') setNotifGranted(true);
      }
    }
  };

  const { icon: PageIcon, color, titleKey, descKey, isPermissions } = PAGES[page];

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-between px-6 py-12">
      {/* Skip */}
      <div className="w-full flex justify-end max-w-md">
        <button onClick={complete} className="text-sm text-muted hover:text-on-bg transition-colors">
          {t('skip')}
        </button>
      </div>

      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center text-center gap-6 w-full max-w-md flex-1 justify-center"
        >
          {/* Icon circle */}
          <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center shadow-2xl`}>
            <PageIcon size={52} className="text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-on-bg mb-3">{t(titleKey)}</h2>
            <p className="text-muted leading-relaxed max-w-sm">{t(descKey)}</p>
          </div>

          {isPermissions && (
            <div className="w-full bg-surface border-subtle rounded-2xl p-4 text-left">
              <PermissionRow icon={MapPin} label="Location" granted={locGranted} onGrant={() => handleGrant('location')} />
              <PermissionRow icon={Mic} label="Microphone" granted={micGranted} onGrant={() => handleGrant('mic')} />
              <PermissionRow icon={Bell} label="Notifications" granted={notifGranted} onGrant={() => handleGrant('notifications')} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom controls */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {PAGES.map((_, i) => (
            <div key={i} className={`rounded-full transition-all ${i === page ? 'w-5 h-2 bg-primary' : 'w-2 h-2 bg-elevated'}`} />
          ))}
        </div>
        {isLast ? (
          <Button className="w-full" onClick={complete}>{t('get_started')}</Button>
        ) : (
          <Button className="w-full" onClick={() => setPage((p) => p + 1)}>
            {t('next')} <ChevronRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
