import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sun, Moon, Bell, BellOff, Globe, LogOut,
  MapPin, RefreshCw, Lock, Mic, Info,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { useLocation } from '../../contexts/LocationContext.jsx';
import { useNotifications } from '../../contexts/NotificationsContext.jsx';
import { Card, Button, Badge } from '../../components/ui/index.jsx';
import { LanguageSwitcherButton } from '../../components/LanguageSwitcherButton.jsx';
import toast from 'react-hot-toast';

const APP_VERSION = '1.0.0';

export default function SettingsPage() {
  const { logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { t } = useLanguage();
  const { location, loading: locLoading, refresh: refreshLocation } = useLocation();
  const { enabled: notifEnabled, setEnabled: setNotifEnabled } = useNotifications();
  const [micStatus, setMicStatus] = useState('unknown'); // 'unknown' | 'granted' | 'denied'

  const handleRequestMic = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus('granted');
      toast.success('Microphone access granted');
    } catch {
      setMicStatus('denied');
      toast.error('Microphone access denied');
    }
  };

  const handleRequestNotif = async () => {
    if (!('Notification' in window)) { toast.error('Notifications not supported'); return; }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotifEnabled(true);
      toast.success('Notifications enabled');
    } else {
      toast.error('Notification permission denied');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
  };

  return (
    <div className="px-5 py-6 max-w-xl mx-auto w-full">
      <h1 className="text-xl font-bold text-on-bg mb-6">{t('settings')}</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        {/* Location */}
        <SettingsSection title="Location">
          <SettingsRow icon={MapPin} label="Current Area" value={location?.areaLabel ?? 'Not set'}>
            <Button size="sm" variant="secondary" onClick={refreshLocation} disabled={locLoading}>
              <RefreshCw size={13} className={locLoading ? 'animate-spin' : ''} />
              {locLoading ? 'Updating...' : 'Refresh'}
            </Button>
          </SettingsRow>
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title="Appearance">
          <SettingsRow icon={theme === 'dark' ? Moon : Sun} label="Theme" value={theme === 'dark' ? 'Dark' : 'Light'}>
            <button
              onClick={toggle}
              className="w-12 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0"
              style={{ background: theme === 'dark' ? 'var(--color-primary)' : 'var(--color-border)' }}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`}
              />
            </button>
          </SettingsRow>
        </SettingsSection>

        {/* Language */}
        <SettingsSection title="Language">
          <SettingsRow icon={Globe} label="App Language" value="">
            <LanguageSwitcherButton />
          </SettingsRow>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          <SettingsRow icon={notifEnabled ? Bell : BellOff} label="Push Notifications" value={notifEnabled ? 'Enabled' : 'Disabled'}>
            <button
              onClick={() => {
                if (!notifEnabled) handleRequestNotif();
                else { setNotifEnabled(false); toast.success('Notifications disabled'); }
              }}
              className="w-12 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0"
              style={{ background: notifEnabled ? 'var(--color-primary)' : 'var(--color-border)' }}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </SettingsRow>
        </SettingsSection>

        {/* Permissions */}
        <SettingsSection title="Permissions">
          <SettingsRow icon={Mic} label="Microphone" value={micStatus === 'granted' ? 'Granted' : micStatus === 'denied' ? 'Denied' : 'Not requested'}>
            {micStatus !== 'granted' && (
              <Button size="sm" variant="secondary" onClick={handleRequestMic}>Allow</Button>
            )}
            {micStatus === 'granted' && <Badge variant="success">Granted</Badge>}
          </SettingsRow>
          <SettingsRow icon={Lock} label="Location Access" value={location ? 'Granted' : 'Not granted'}>
            {!location && <Button size="sm" variant="secondary" onClick={refreshLocation}>Allow</Button>}
            {location && <Badge variant="success">Granted</Badge>}
          </SettingsRow>
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About">
          <SettingsRow icon={Info} label="Version" value={`v${APP_VERSION}`} />
        </SettingsSection>

        {/* Logout */}
        <Button variant="danger" className="w-full mt-2" onClick={handleLogout}>
          <LogOut size={16} /> {t('logout')}
        </Button>
      </motion.div>
    </div>
  );
}

function SettingsSection({ title, children }) {
  return (
    <div>
      <p className="text-[11px] text-muted font-semibold uppercase tracking-wider mb-1.5 px-1">{title}</p>
      <Card className="divide-y divide-[var(--color-border)] overflow-hidden p-0">
        {children}
      </Card>
    </div>
  );
}

function SettingsRow({ icon: Icon, label, value, children }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && <Icon size={16} className="text-muted flex-shrink-0" />}
        <div className="min-w-0">
          <p className="text-sm text-on-bg font-medium">{label}</p>
          {value && <p className="text-xs text-muted mt-0.5">{value}</p>}
        </div>
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  );
}
