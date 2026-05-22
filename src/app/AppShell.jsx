import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, CalendarCheck2, Settings, MessageCircle,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { Avatar } from '../components/ui/index.jsx';
import { NotificationsButton } from '../components/NotificationsSheet.jsx';
import { LanguageSwitcherButton } from '../components/LanguageSwitcherButton.jsx';
import { PageTransition } from './PageTransition.jsx';
import { useLocation } from '../contexts/LocationContext.jsx';

const NAV = [
  { to: '/app/dashboard', icon: LayoutDashboard, key: 'tab_dashboard' },
  { to: '/app/chat',      icon: MessageSquare,   key: 'tab_chat' },
  { to: '/app/bookings',  icon: CalendarCheck2,  key: 'tab_bookings' },
  { to: '/app/settings',  icon: Settings,        key: 'tab_settings' },
];

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/app/dashboard'}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted hover:text-on-bg hover:bg-elevated',
        )
      }
    >
      <Icon size={18} />
      <span className="hidden lg:block">{label}</span>
    </NavLink>
  );
}

function BottomNavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/app/dashboard'}
      className={({ isActive }) =>
        clsx(
          'flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl text-xs font-medium transition-all flex-1',
          isActive ? 'text-primary' : 'text-muted',
        )
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function AppShell() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { location } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-16 lg:w-56 bg-surface border-r border-[var(--color-border)] py-4 flex-shrink-0">
        {/* Logo */}
        <div
          className="flex items-center gap-2 px-3 mb-6 cursor-pointer"
          onClick={() => navigate('/app/dashboard')}
        >
          <img src="/logo.png" alt="Kaam Karao" className="w-9 h-9 object-contain flex-shrink-0" />
          <span className="hidden lg:block font-bold text-on-bg text-lg">Kaam Karao</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-2 flex-1">
          {NAV.map(({ to, icon, key }) => (
            <NavItem key={to} to={to} icon={icon} label={t(key)} />
          ))}
          <NavItem to="/app/threads" icon={MessageCircle} label={t('tab_threads')} />
        </nav>

        {/* User pill */}
        <div
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-elevated transition-colors cursor-pointer mx-2"
          onClick={() => navigate('/app/profile')}
        >
          <Avatar name={user?.full_name} size={32} />
          <div className="hidden lg:block min-w-0">
            <p className="text-sm font-medium text-on-bg truncate">{user?.full_name ?? 'User'}</p>
            <p className="text-xs text-muted truncate">{location?.areaLabel ?? user?.email ?? ''}</p>
          </div>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 bg-surface border-b border-[var(--color-border)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Kaam Karao" className="w-7 h-7 object-contain" />
            <span className="font-bold text-on-bg">Kaam Karao</span>
          </div>
          <div className="flex items-center gap-1">
            <LanguageSwitcherButton />
            <NotificationsButton />
            <button onClick={() => navigate('/app/profile')}>
              <Avatar name={user?.full_name} size={28} />
            </button>
          </div>
        </header>

        {/* Desktop top strip */}
        <div className="hidden md:flex items-center justify-end gap-2 px-6 py-2 border-b border-[var(--color-border)] bg-surface flex-shrink-0">
          <LanguageSwitcherButton />
          <NotificationsButton />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex items-center bg-surface border-t border-[var(--color-border)] px-2 safe-bottom flex-shrink-0">
          {NAV.map(({ to, icon, key }) => (
            <BottomNavItem key={to} to={to} icon={icon} label={t(key)} />
          ))}
        </nav>
      </div>
    </div>
  );
}
