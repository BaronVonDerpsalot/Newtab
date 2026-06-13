import { fmtTime, fmtDate } from '../../lib/time.js';

/* ── Clock card ───────────────────────────────────── */
export function ClockCard({ time, showSec, dateFormat }) {
  return (
    <div className="card cell-clock" style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',paddingBottom:28}}>
      <div className="clock-time">{fmtTime(time, showSec)}</div>
      <div className="clock-date">{fmtDate(time, dateFormat)}</div>
    </div>
  );
}
