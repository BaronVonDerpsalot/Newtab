import { AUTH_URL, SUPABASE_ANON_KEY } from '../config.js';

/* ── Auth helpers ─────────────────────────────────────
 * The dashboard password is verified server-side by the `auth` edge function,
 * which returns an app token on success. We persist that token in localStorage
 * so each browser stays logged in (no expiry) and reuses it to authorize the
 * chat/feedback/debrief functions. No password or token ships in the bundle. */
const TOKEN_KEY = 'nt_token';

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}
export function isAuthed() { return !!getToken(); }
export function clearToken() { try { localStorage.removeItem(TOKEN_KEY); } catch {} }

// Verify `password` against the auth edge function. On success the issued token
// is stored locally and true is returned; otherwise false (wrong password or
// network/server error).
export async function login(password) {
  try {
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return false;
    const data = await res.json().catch(() => ({}));
    if (!data || !data.token) return false;
    try { localStorage.setItem(TOKEN_KEY, data.token); } catch {}
    return true;
  } catch {
    return false;
  }
}
