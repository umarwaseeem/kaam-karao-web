import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { storage, KEYS } from '../lib/storage.js';
import { configureApiClient } from '../lib/apiClient.js';
import { apiLogin, apiSignup, apiGoogleAuth, apiGetMe, apiUpdateMe } from '../lib/auth.js';
import { apiGoogleAuth as _ignored } from '../lib/auth.js'; // named import alias not needed

const AuthContext = createContext(null);

function loadUserFromStorage() {
  const isLoggedIn = storage.get(KEYS.IS_LOGGED_IN) === 'true';
  if (!isLoggedIn) return { user: null, token: null };
  return {
    token: storage.get(KEYS.ACCESS_TOKEN),
    user: {
      id: storage.get(KEYS.USER_ID),
      email: storage.get(KEYS.USER_EMAIL),
      full_name: storage.get(KEYS.USER_NAME),
      phone: storage.get(KEYS.USER_PHONE),
      address: storage.get(KEYS.USER_ADDRESS),
    },
  };
}

function persistSession({ user, session }) {
  storage.set(KEYS.IS_LOGGED_IN, 'true');
  storage.set(KEYS.ACCESS_TOKEN, session.access_token);
  storage.set(KEYS.REFRESH_TOKEN, session.refresh_token ?? '');
  storage.set(KEYS.USER_ID, user.id);
  storage.set(KEYS.USER_EMAIL, user.email);
  storage.set(KEYS.USER_NAME, user.full_name ?? '');
  storage.set(KEYS.USER_PHONE, user.phone ?? '');
  storage.set(KEYS.USER_ADDRESS, user.address ?? '');
}

function clearSession() {
  Object.values(KEYS).forEach((k) => storage.remove(k));
}

export function AuthProvider({ children }) {
  const initial = loadUserFromStorage();
  const [user, setUser] = useState(initial.user);
  const [token, setToken] = useState(initial.token);
  const tokenRef = useRef(initial.token);

  // Keep ref in sync so apiClient always has current token
  useEffect(() => { tokenRef.current = token; }, [token]);

  // Configure API client once
  useEffect(() => {
    configureApiClient({
      getToken: () => tokenRef.current,
      onUnauthorized: logout,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Background profile sync on mount
  useEffect(() => {
    if (token) {
      apiGetMe().then((data) => {
        if (data?.user) setUser(data.user);
      }).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _applySession = (data) => {
    persistSession(data);
    setUser(data.user);
    setToken(data.session.access_token);
    tokenRef.current = data.session.access_token;
  };

  const login = useCallback(async ({ email, password }) => {
    const data = await apiLogin({ email, password });
    _applySession(data);
    return data;
  }, []);

  const signup = useCallback(async ({ email, password, full_name, phone }) => {
    const data = await apiSignup({ email, password, full_name, phone });
    _applySession(data);
    return data;
  }, []);

  const loginWithGoogle = useCallback(async ({ idToken, accessToken }) => {
    const data = await apiGoogleAuth({ id_token: idToken, access_token: accessToken });
    _applySession(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
    tokenRef.current = null;
  }, []);

  const refreshProfile = useCallback(async () => {
    const data = await apiGetMe();
    if (data?.user) {
      setUser(data.user);
      storage.set(KEYS.USER_NAME, data.user.full_name ?? '');
      storage.set(KEYS.USER_PHONE, data.user.phone ?? '');
      storage.set(KEYS.USER_ADDRESS, data.user.address ?? '');
    }
    return data?.user;
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const data = await apiUpdateMe(updates);
    if (data?.user) {
      setUser(data.user);
      storage.set(KEYS.USER_NAME, data.user.full_name ?? '');
      storage.set(KEYS.USER_PHONE, data.user.phone ?? '');
      storage.set(KEYS.USER_ADDRESS, data.user.address ?? '');
    }
    return data?.user;
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token,
      isLoggedIn: !!token,
      login, signup, loginWithGoogle, logout, refreshProfile, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
