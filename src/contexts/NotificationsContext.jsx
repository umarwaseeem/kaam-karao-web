import { createContext, useCallback, useContext, useState } from 'react';
import { storage, KEYS } from '../lib/storage.js';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [enabled, setEnabledState] = useState(
    () => storage.get(KEYS.NOTIFICATIONS_ENABLED) !== 'false',
  );

  const setEnabled = useCallback((val) => {
    storage.set(KEYS.NOTIFICATIONS_ENABLED, String(val));
    setEnabledState(val);
  }, []);

  const add = useCallback((notification) => {
    setNotifications((prev) => [{ ...notification, isRead: false, id: notification.id ?? Date.now().toString() }, ...prev]);
  }, []);

  /** Build a notification from a booking object (mirrors NotificationModel.fromBooking) */
  const addFromBooking = useCallback((booking) => {
    if (!enabled) return;
    add({
      id: `booking-${booking.id}`,
      title: `Booking ${booking.status === 'confirmed' ? 'Confirmed' : booking.status}`,
      body: `${booking.provider_name ?? 'Provider'} — ${booking.service ?? booking.service_type ?? ''}`,
      timestamp: new Date().toISOString(),
      bookingData: booking,
    });
  }, [enabled, add]);

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const clear = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, enabled, setEnabled, add, addFromBooking, markRead, markAllRead, clear }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);
