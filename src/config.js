/* ── App constants ────────────────────────────────── */
// Values can be overridden at build time via Vite env vars (VITE_*), with the
// original defaults kept as fallbacks so the app runs without extra setup.
//
// NOTE: no secrets live here. The dashboard password and the function app-token
// are validated/issued server-side by the `auth` edge function (see
// src/lib/auth.js) and never ship in the client bundle.
const env = import.meta.env;

export const SUPABASE_URL      = env.VITE_SUPABASE_URL || 'https://fybgariixiwgsjhjapwr.supabase.co';
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5YmdhcmlpeGl3Z3NqaGphcHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzM4NzIsImV4cCI6MjA5NjY0OTg3Mn0.0mpI5iZIrSL1-wlSS6VFDsVxJhrJ4CzOkOOW2wz7vhM';
export const USER_ID           = env.VITE_USER_ID || 'mike';
export const AUTH_URL           = `${SUPABASE_URL}/functions/v1/auth`;
export const FEEDBACK_URL      = `${SUPABASE_URL}/functions/v1/feedback`;
export const CHAT_URL          = `${SUPABASE_URL}/functions/v1/chat`;
export const DEBRIEF_URL       = `${SUPABASE_URL}/functions/v1/debrief`;
export const LOCATION          = { lat: 51.5074, lng: -0.1278 };
export const WINDOW_OPEN_HOUR  = 21;
export const WINDOW_CLOSE_HOUR = 24;
export const VERSION           = 'v2.3.0';
