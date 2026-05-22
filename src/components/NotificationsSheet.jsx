import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationsContext.jsx';
import { Sheet } from './ui/Sheet.jsx';
import { useState } from 'react';
import { formatDistanceToNow } from '../lib/utils.js';

export function NotificationsButton() {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-lg text-muted hover:text-on-bg hover:bg-elevated transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        )}
      </button>
      <NotificationsSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function NotificationsSheet({ open, onClose }) {
  const { notifications, markAllRead, unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <Sheet open={open} onClose={onClose} title="Notifications">
      {unreadCount > 0 && (
        <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs text-primary mb-4 hover:underline">
          <CheckCheck size={14} /> Mark all read
        </button>
      )}
      {notifications.length === 0 ? (
        <p className="text-muted text-sm text-center py-8">No notifications yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <motion.button
              key={n.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => {
                if (n.bookingData?.id) {
                  navigate(`/app/bookings/${n.bookingData.id}`);
                  onClose?.();
                }
              }}
              className="text-left flex gap-3 p-3 rounded-xl hover:bg-elevated transition-colors"
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.isRead ? 'bg-muted' : 'bg-primary'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${n.isRead ? 'text-muted' : 'text-on-bg'}`}>{n.title}</p>
                <p className="text-xs text-muted mt-0.5 truncate">{n.body}</p>
                <p className="text-xs text-muted/60 mt-1">{formatDistanceToNow(n.timestamp)}</p>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </Sheet>
  );
}
