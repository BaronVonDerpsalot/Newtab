import { createRoot } from 'react-dom/client';
import { PASSWORD, COOKIE_NAME } from './config.js';
import { getCookie, setAuthCookie } from './lib/auth.js';
import { App } from './App.jsx';
import './index.css';

/* ── Boot ─────────────────────────────────────────── */
function boot() {
  createRoot(document.getElementById('root')).render(<App/>);
}

function submitPassword() {
  if(document.getElementById('pwInput').value===PASSWORD){
    setAuthCookie();
    document.getElementById('authOverlay').style.display='none';
    boot();
  } else {
    const err=document.getElementById('pwError');
    err.classList.add('visible');
    document.getElementById('pwInput').value='';
    document.getElementById('pwInput').focus();
    setTimeout(()=>err.classList.remove('visible'),2000);
  }
}

if(getCookie(COOKIE_NAME)==='1'){
  document.getElementById('authOverlay').style.display='none';
  boot();
} else {
  document.getElementById('pwSubmit').addEventListener('click',submitPassword);
  document.getElementById('pwInput').addEventListener('keydown',e=>{if(e.key==='Enter')submitPassword();});
  document.getElementById('pwInput').focus();
}
