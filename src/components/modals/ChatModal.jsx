import { BOOL_HABITS } from '../../config/habits.js';
import { daysActive, exerciseDoneToday, windowOpenToday } from '../../lib/state.js';
import { ChatThread } from './ChatThread.jsx';

/* ── Crisis chat (real Claude via edge function) ──── */
function buildSystem(S) {
  const gs = S.goodStuff.values;
  const done = BOOL_HABITS.filter(h => gs[h.key] === true).map(h => h.label);
  return `You are a calm, direct support voice for someone struggling with compulsive porn use right now.\n\nDashboard: Sessions avoided: ${S.sessionsAvoided}, Days active: ${daysActive(S.startDate)}, Exercise today: ${exerciseDoneToday(S.exerciseDate) ? 'yes' : 'no'}, Window open: ${windowOpenToday() ? 'yes' : 'no'}, Mood: ${gs.mood ?? 'not logged'}/5, Sleep: ${gs.sleep_hours ?? 'not logged'}h, Water: ${gs.water ?? 'not logged'}L, Habits done: ${done.length ? done.join(', ') : 'none'}.\n\nSystem: DNS blocking, scheduled windows, exercise as prerequisite. They've quit 40-a-day smoking and alcohol.\n\nJob: get them through the next 20 minutes. Be direct, no cotton wool, short responses. Ask what's happening if they don't say.`;
}

export function ChatModal({ S }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="modal-eyebrow">Crisis support</div>
      <div className="modal-title" style={{ marginBottom: 0 }}>Need Help Right Now</div>
      <ChatThread system={buildSystem(S)} placeholder="What's going on?" />
    </div>
  );
}
