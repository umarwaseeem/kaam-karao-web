import { apiFetch } from './apiClient.js';

export async function apiGetThreads(userId) {
  return apiFetch(`/api/dispatch/threads/${userId}`);
}

export async function apiGetBookings(userId) {
  return apiFetch(`/api/dispatch/bookings/${userId}`);
}

export async function apiGetReminders(userId) {
  return apiFetch(`/api/dispatch/reminders/${userId}`);
}

export async function apiGetThreadHistory(threadId) {
  return apiFetch(`/api/dispatch/history/${threadId}`);
}

/** Synchronous (non-streaming) chat */
export async function apiChat(payload) {
  return apiFetch('/api/dispatch/chat', { method: 'POST', body: payload });
}

/** Returns a raw Response for SSE streaming. Caller must read the body. */
export async function apiChatStream(payload) {
  return apiFetch('/api/dispatch/chat/stream', { method: 'POST', body: payload, stream: true });
}
