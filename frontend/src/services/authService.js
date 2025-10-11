import { apiFetch } from './api.js';

export function register(payload) {
  return apiFetch('/api/auth/register', { method: 'POST', data: payload });
}

export function login(payload) {
  return apiFetch('/api/auth/login', { method: 'POST', data: payload });
}

export function me(token) {
  return apiFetch('/api/auth/me', { method: 'GET' });
}


