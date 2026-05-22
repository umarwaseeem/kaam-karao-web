import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { apiGetBookings } from '../../lib/dispatch.js';
import { Card, Skeleton, Badge } from '../../components/ui/index.jsx';
import { formatDateTime } from '../../lib/utils.js';

const STATUS_VARIANT = {
  confirmed: 'success', completed: 'primary', cancelled: 'error', pending: 'warning',
};

const STATUS_BANNER_COLOR = {
  confirmed: 'bg-green-500/10 border-green-500/30 text-green-400',
  completed: 'bg-primary/10 border-primary/30 text-primary',
  cancelled: 'bg-red-500/10 border-red-500/30 text-red-400',
  pending: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
};

export default function BookingDetailPage() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    apiGetBookings(user.id)
      .then((d) => {
        const found = (d?.bookings ?? []).find((b) => String(b.id) === String(bookingId));
        if (found) setBooking(found);
        else setError(true);
      })
      .catch(() => setError(true));
  }, [user?.id, bookingId]);

  if (error) {
    return (
      <div className="px-5 py-10 flex flex-col items-center gap-4">
        <p className="text-muted text-sm">Booking not found.</p>
        <button onClick={() => navigate('/app/bookings')} className="text-primary text-sm hover:underline">← Back to bookings</button>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 max-w-xl mx-auto w-full">
      {/* Back nav */}
      <button onClick={() => navigate('/app/bookings')} className="flex items-center gap-1 text-sm text-muted hover:text-on-bg mb-5 transition-colors">
        <ArrowLeft size={16} /> {t('back')}
      </button>

      {booking === null ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-40" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
          {/* Status banner */}
          <div className={`border rounded-2xl px-5 py-4 flex items-center justify-between ${STATUS_BANNER_COLOR[booking.status] ?? 'bg-surface border-[var(--color-border)] text-on-bg'}`}>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide opacity-70">Booking Status</p>
              <p className="font-bold text-lg mt-0.5 capitalize">{booking.status}</p>
            </div>
            <Badge variant={STATUS_VARIANT[booking.status] ?? 'default'} className="text-sm">{booking.status}</Badge>
          </div>

          {/* Provider info */}
          <Card className="p-5">
            <p className="text-xs text-muted mb-3 font-medium uppercase tracking-wide">Provider</p>
            <p className="font-bold text-on-bg text-base">{booking.provider_name}</p>
            <p className="text-sm text-muted mt-0.5">{booking.service ?? booking.service_type}</p>
            {booking.provider_phone && (
              <a href={`tel:${booking.provider_phone}`} className="mt-3 flex items-center gap-2 text-primary text-sm font-medium hover:underline">
                <Phone size={15} /> {booking.provider_phone}
              </a>
            )}
          </Card>

          {/* Details grid */}
          <Card className="p-5">
            <p className="text-xs text-muted mb-3 font-medium uppercase tracking-wide">Booking Details</p>
            <div className="flex flex-col gap-3">
              <DetailRow icon={Calendar} label="Time" value={booking.slot_label ?? formatDateTime(booking.time)} />
              <DetailRow icon={MapPin} label="Location" value={booking.area ?? booking.user_area} />
              {(booking.price_min || booking.price_max) && (
                <DetailRow icon={DollarSign} label="Price Estimate" value={`Rs. ${booking.price_min}–${booking.price_max}`} />
              )}
              {booking.notes && <DetailRow label="Notes" value={booking.notes} />}
            </div>
          </Card>

          {/* Booking ID */}
          <p className="text-[11px] text-muted text-center">Booking ID: {booking.id}</p>
        </motion.div>
      )}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon size={15} className="text-muted flex-shrink-0 mt-0.5" />}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted">{label}</p>
        <p className="text-sm text-on-bg">{value}</p>
      </div>
    </div>
  );
}
