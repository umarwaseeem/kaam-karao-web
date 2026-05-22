import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench, Zap, Home, Book, Scissors, Wind,
  MessageSquare, CalendarCheck2, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { useLocation } from '../../contexts/LocationContext.jsx';
import { apiGetBookings, apiGetThreads } from '../../lib/dispatch.js';
import { Card, Skeleton, EmptyState, Badge, Button } from '../../components/ui/index.jsx';
import { formatDistanceToNow, formatDateTime } from '../../lib/utils.js';

const QUICK_SERVICES = [
  { key: 'ac_tech',     icon: Wind,    query: 'I need an AC technician' },
  { key: 'electrician', icon: Zap,     query: 'I need an electrician' },
  { key: 'plumber',     icon: Wrench,  query: 'I need a plumber' },
  { key: 'cleaner',     icon: Home,    query: 'I need a home cleaner' },
  { key: 'tutor',       icon: Book,    query: 'I need a tutor' },
  { key: 'beautician',  icon: Scissors,query: 'I need a beautician' },
];

const STATUS_VARIANT = {
  confirmed: 'success', active: 'success', completed: 'primary',
  cancelled: 'error', pending: 'warning',
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { location } = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(null);
  const [threads, setThreads] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    apiGetBookings(user.id).then((d) => setBookings(d?.bookings ?? [])).catch(() => setBookings([]));
    apiGetThreads(user.id).then((d) => setThreads(d?.threads ?? [])).catch(() => setThreads([]));
  }, [user?.id]);

  const upcomingBooking = bookings?.find((b) => b.status === 'confirmed' || b.status === 'pending') ?? null;
  const recentThreads = threads?.slice(0, 5) ?? [];

  const openChat = (prefill) => navigate(`/app/chat?prefill=${encodeURIComponent(prefill)}`);

  return (
    <div className="px-5 py-6 max-w-3xl mx-auto w-full">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="text-2xl font-bold text-on-bg">
          {t('greeting')}, {user?.full_name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        {location?.areaLabel && (
          <p className="text-sm text-muted mt-0.5 flex items-center gap-1">
            <span>📍</span> {location.areaLabel}
          </p>
        )}
        <p className="text-muted mt-2">{t('what_done')}</p>
      </motion.div>

      {/* Quick Services */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-3 gap-3 mb-7">
        {QUICK_SERVICES.map(({ key, icon: Icon, query }) => (
          <motion.button
            key={key} variants={item}
            onClick={() => openChat(query)}
            className="flex flex-col items-center gap-2 p-4 bg-surface border-subtle rounded-2xl hover:border-primary/40 hover:bg-elevated transition-all active:scale-[0.97]"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon size={20} className="text-primary" />
            </div>
            <span className="text-xs font-medium text-on-bg text-center leading-tight">{t(key)}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Upcoming Booking */}
      <section className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-on-bg">{t('upcoming_booking')}</h2>
          <button onClick={() => navigate('/app/bookings')} className="text-xs text-primary hover:underline flex items-center gap-0.5">
            View all <ChevronRight size={12} />
          </button>
        </div>

        {bookings === null ? (
          <Skeleton className="h-24 w-full" />
        ) : upcomingBooking ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card
              className="p-4 hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => navigate(`/app/bookings/${upcomingBooking.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-on-bg">{upcomingBooking.provider_name ?? upcomingBooking.service}</p>
                  <p className="text-sm text-muted mt-0.5">{upcomingBooking.service ?? upcomingBooking.service_type}</p>
                  <p className="text-xs text-muted mt-1">
                    {upcomingBooking.slot_label ?? formatDateTime(upcomingBooking.time)}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[upcomingBooking.status] ?? 'default'}>
                  {upcomingBooking.status}
                </Badge>
              </div>
            </Card>
          </motion.div>
        ) : (
          <Card className="p-5">
            <EmptyState
              icon={CalendarCheck2}
              title={t('no_upcoming_booking')}
              action={
                <Button size="sm" onClick={() => navigate('/app/chat')}>{t('book_service_cta')}</Button>
              }
            />
          </Card>
        )}
      </section>

      {/* Recent Chats */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-on-bg">{t('recent_chats')}</h2>
          <button onClick={() => navigate('/app/threads')} className="text-xs text-primary hover:underline flex items-center gap-0.5">
            View all <ChevronRight size={12} />
          </button>
        </div>

        {threads === null ? (
          <div className="flex flex-col gap-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : recentThreads.length === 0 ? (
          <Card className="p-5">
            <EmptyState
              icon={MessageSquare}
              title={t('no_recent_chats')}
              action={<Button size="sm" onClick={() => navigate('/app/chat')}>{t('start_chat_cta')}</Button>}
            />
          </Card>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-2">
            {recentThreads.map((thread) => (
              <motion.div key={thread.id} variants={item}>
                <Card
                  className="flex items-center gap-3 p-3.5 hover:border-primary/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/app/chat/${thread.id}`)}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-bg truncate">{thread.title}</p>
                    <p className="text-xs text-muted">{formatDistanceToNow(thread.created_at)}</p>
                  </div>
                  <ChevronRight size={14} className="text-muted flex-shrink-0" />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
