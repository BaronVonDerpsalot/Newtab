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
