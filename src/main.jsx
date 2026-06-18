import { createRoot } from 'react-dom/client';
import { isAuthed, login } from './lib/auth.js';
import { App } from './App.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import './index.css';

/* ── Boot ─────────────────────────────────────────── */
function boot() {
  createRoot(document.getElementById('root')).render(
    <ErrorBoundary><App/></ErrorBoundary>
  );
}

async function submitPassword() {
  const input = document.getElementById('pwInput');
  const btn = document.getElementById('pwSubmit');
  const err = document.getElementById('pwError');
  const pw = input.value;
  if (!pw || input.disabled) return;

  btn.disabled = true; input.disabled = true;
  const ok = await login(pw);
  if (ok) {
    document.getElementById('authOverlay').style.display = 'none';
    boot();
    return;
  }
  btn.disabled = false; input.disabled = false;
  err.classList.add('visible');
  input.value = ''; input.focus();
  setTimeout(() => err.classList.remove('visible'), 2000);
}

if (isAuthed()) {
  document.getElementById('authOverlay').style.display = 'none';
  boot();
} else {
  document.getElementById('pwSubmit').addEventListener('click', submitPassword);
  document.getElementById('pwInput').addEventListener('keydown', e => { if (e.key === 'Enter') submitPassword(); });
  document.getElementById('pwInput').focus();
}
