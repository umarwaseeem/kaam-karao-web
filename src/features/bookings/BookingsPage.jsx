import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarCheck2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { apiGetBookings } from '../../lib/dispatch.js';
import { Card, Skeleton, EmptyState, Badge, Button } from '../../components/ui/index.jsx';
import { formatDateTime } from '../../lib/utils.js';

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const STATUS_VARIANT = {
  confirmed: 'success', completed: 'primary', cancelled: 'error', pending: 'warning',
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function BookingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user?.id) return;
    apiGetBookings(user.id)
      .then((d) => setBookings(d?.bookings ?? []))
      .catch(() => setBookings([]));
  }, [user?.id]);

  const filtered = bookings?.filter((b) => filter === 'all' || b.status === filter) ?? [];

  return (
    <div className="px-5 py-6 max-w-2xl mx-auto w-full">
      <h1 className="text-xl font-bold text-on-bg mb-5">{t('bookings')}</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors capitalize ${
              filter === f
                ? 'gradient-primary text-white'
                : 'bg-surface border-subtle text-muted hover:text-on-bg hover:border-primary/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {bookings === null ? (
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={CalendarCheck2}
            title={t('no_bookings')}
            action={<Button onClick={() => navigate('/app/chat')}>{t('book_service_cta')}</Button>}
          />
        </Card>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-2">
          {filtered.map((b) => (
            <motion.div key={b.id} variants={item}>
              <Card
                className="flex items-start gap-4 p-4 hover:border-primary/30 cursor-pointer transition-colors"
                onClick={() => navigate(`/app/bookings/${b.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-bg text-sm">{b.provider_name}</p>
                  <p className="text-xs text-muted mt-0.5">{b.service ?? b.service_type}</p>
                  <p className="text-xs text-muted mt-1">{b.slot_label ?? formatDateTime(b.time)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={STATUS_VARIANT[b.status] ?? 'default'}>{b.status}</Badge>
                  <ChevronRight size={14} className="text-muted" />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
