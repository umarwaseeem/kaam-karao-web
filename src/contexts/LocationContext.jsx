import { createContext, useCallback, useContext, useState } from 'react';
import { loadCachedLocation, getCurrentLocation, clearCachedLocation } from '../lib/location.js';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => loadCachedLocation());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
    } catch (e) {
      setError(e.message ?? 'Location unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    clearCachedLocation();
    setLocation(null);
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading, error, refresh, clear }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
