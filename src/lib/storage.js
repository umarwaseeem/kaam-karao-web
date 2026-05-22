// Storage key constants mirroring Flutter SharedPreferences keys
export const KEYS = {
  // Auth
  USER_ID: 'auth_user_id',
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_EMAIL: 'user_email',
  USER_NAME: 'user_name',
  USER_PHONE: 'user_phone',
  USER_ADDRESS: 'user_address',
  IS_LOGGED_IN: 'is_logged_in',
  // Preferences
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'selected_language',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  HAS_SEEN_ONBOARDING: 'has_seen_onboarding',
  // Location
  USER_LAT: 'user_lat',
  USER_LNG: 'user_lng',
  USER_AREA_LABEL: 'user_area_label',
  USER_LOCATION_UPDATED_AT: 'user_location_updated_at',
};

export const storage = {
  get: (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, String(value)); } catch {}
  },
  remove: (key) => {
    try { localStorage.removeItem(key); } catch {}
  },
  getJSON: (key) => {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  setJSON: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  clearAll: () => {
    try { localStorage.clear(); } catch {}
  },
};
