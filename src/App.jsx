import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

import { Providers } from './app/Providers.jsx';
import { ProtectedRoute } from './app/ProtectedRoute.jsx';
import AppShell from './app/AppShell.jsx';

// Public pages
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// App pages
import DashboardPage from './features/dashboard/DashboardPage.jsx';
import ChatPage from './features/chat/ChatPage.jsx';
import ThreadsPage from './features/threads/ThreadsPage.jsx';
import BookingsPage from './features/bookings/BookingsPage.jsx';
import BookingDetailPage from './features/bookings/BookingDetailPage.jsx';
import SettingsPage from './features/settings/SettingsPage.jsx';
import ProfilePage from './features/profile/ProfilePage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: 'var(--color-elevated)', color: 'var(--color-on-bg)', border: '1px solid var(--color-border)', fontFamily: 'Rubik, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#00B4A6', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#F97583', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Protected app */}
          <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="chat/:threadId" element={<ChatPage />} />
            <Route path="threads" element={<ThreadsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="bookings/:bookingId" element={<BookingDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}
