/* ── Time helpers ─────────────────────────────────── */
export const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const MONS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function fmtTime(d, sec) {
  const h = String(d.getHours()).padStart(2,'0'), m = String(d.getMinutes()).padStart(2,'0');
  return sec ? `${h}:${m}:${String(d.getSeconds()).padStart(2,'0')}` : `${h}:${m}`;
}
export function fmtDate(d, fmt) {
  const day = DAYS[d.getDay()], date = d.getDate(), mon = MONTHS[d.getMonth()];
  if (fmt === 'short') return `${day.slice(0,3).toUpperCase()} ${date} ${mon.slice(0,3).toUpperCase()}`;
  if (fmt === 'iso')   return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
  return `${day.toUpperCase()} ${date} ${mon.toUpperCase()}`;
}
export function todayStr() { return new Date().toISOString().split('T')[0]; }

/* ── Effective date (UK 3am cutoff + manual day-end) ── */
// Before 3am UK = still the previous calendar day for tracking purposes
function ukNaturalDate() {
  const ukDateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/London' });
  const ukTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  if (ukTime.getHours() < 3) {
    const d = new Date(ukDateStr + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }
  return ukDateStr;
}

export function effectiveDateStr() {
  const natural = ukNaturalDate();
  const stored = localStorage.getItem('nt_day_end');
  if (stored && stored > natural) return stored;
  if (stored) localStorage.removeItem('nt_day_end');
  return natural;
}

export function isDayManuallyEnded() {
  const stored = localStorage.getItem('nt_day_end');
  return !!(stored && stored > ukNaturalDate());
}

export function endDay() {
  const cur = effectiveDateStr();
  const d = new Date(cur + 'T12:00:00');
  d.setDate(d.getDate() + 1);
  localStorage.setItem('nt_day_end', d.toISOString().split('T')[0]);
}
