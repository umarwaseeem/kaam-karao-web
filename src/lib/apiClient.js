const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://kaam-karao-backend.vercel.app';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Token getter injected at startup by AuthContext to avoid circular imports
let _getToken = () => null;
let _onUnauthorized = () => {};

export function configureApiClient({ getToken, onUnauthorized }) {
  _getToken = getToken;
  _onUnauthorized = onUnauthorized;
}

/**
 * @param {string} path  e.g. '/api/auth/login'
 * @param {{ method?: string, body?: object, auth?: boolean, stream?: boolean }} opts
 */
export async function apiFetch(path, { method = 'GET', body, auth = true, stream = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = _getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    _onUnauthorized();
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  if (stream) return res; // caller reads the stream

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { detail: text }; }

  if (!res.ok) {
    const msg = data?.detail || data?.message || `Request failed (${res.status})`;
    throw new ApiError(res.status, msg);
  }

  return data;
}
