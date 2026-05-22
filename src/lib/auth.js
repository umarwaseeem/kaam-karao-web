import { apiFetch } from './apiClient.js';

export async function apiLogin({ email, password }) {
  return apiFetch('/api/auth/login', { method: 'POST', body: { email, password }, auth: false });
}

export async function apiSignup({ email, password, full_name, phone }) {
  return apiFetch('/api/auth/signup', { method: 'POST', body: { email, password, full_name, phone }, auth: false });
}

export async function apiGoogleAuth({ id_token, access_token }) {
  return apiFetch('/api/auth/google', { method: 'POST', body: { id_token, access_token }, auth: false });
}

export async function apiGetMe() {
  return apiFetch('/api/auth/me');
}

export async function apiUpdateMe(updates) {
  return apiFetch('/api/auth/me', { method: 'PATCH', body: updates });
}
