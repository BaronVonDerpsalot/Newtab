import { BOOL_HABITS } from '../../config/habits.js';

/* ── Habits card (bool only) ──────────────────────── */
export function HabitsCard({ values, onToggle }) {
  return (
    <div className="card cell-habits">
      <div className="mono-label" style={{marginBottom:18}}>Good Stuff</div>
      {BOOL_HABITS.map(h => {
        const on = values[h.key] === true;
        return (
          <div key={h.key} className={`habit-row ${on?'on':''}`} onClick={()=>onToggle(h.key)} role="checkbox" aria-checked={on}>
            <div className={`habit-dot ${on?'on':''}`}></div>
            <span className="habit-text">{h.label}</span>
          </div>
        );
      })}
    </div>
  );
}
