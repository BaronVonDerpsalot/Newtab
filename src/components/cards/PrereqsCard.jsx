import { Ico } from '../Ico.jsx';

/* ── Prereqs card ─────────────────────────────────── */
export function PrereqsCard({ exerciseDone, windowOpen, onToggleExercise }) {
  return (
    <div className="card cell-prereqs">
      <div className="mono-label" style={{marginBottom:14}}>Prerequisites</div>
      <div className={`prereq-row ${exerciseDone?'done':''}`} onClick={onToggleExercise}>
        <span>{exerciseDone ? 'Exercise Done' : 'Exercise'}</span>
        <Ico size={14}>{exerciseDone ? <polyline points="20 6 9 17 4 12"/> : <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>}</Ico>
      </div>
      <div className={`prereq-row readonly ${windowOpen?'done':''}`}>
        <span>{windowOpen ? 'Window Open' : 'Window Closed'}</span>
        <Ico size={14}>{windowOpen ? <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></> : <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>}</Ico>
      </div>
    </div>
  );
}
