import { COOKIE_NAME } from '../config.js';

/* ── Auth helpers ─────────────────────────────────── */
export function getCookie(name) {
  return document.cookie.split('; ').find(r => r.startsWith(name + '='))?.split('=')[1];
}
export function setAuthCookie() {
  const d = new Date(); d.setDate(d.getDate() + 30);
  document.cookie = `${COOKIE_NAME}=1; expires=${d.toUTCString()}; path=/; SameSite=Strict`;
}
