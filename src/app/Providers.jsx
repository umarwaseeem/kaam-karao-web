import { ThemeProvider } from '../contexts/ThemeContext.jsx';
import { LanguageProvider } from '../contexts/LanguageContext.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import { LocationProvider } from '../contexts/LocationContext.jsx';
import { NotificationsProvider } from '../contexts/NotificationsContext.jsx';

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <LocationProvider>
            <NotificationsProvider>
              {children}
            </NotificationsProvider>
          </LocationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
