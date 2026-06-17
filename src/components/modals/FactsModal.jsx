import { useState } from 'react';
import { DEBRIEF_URL, SUPABASE_ANON_KEY, WINDOW_OPEN_HOUR, WINDOW_CLOSE_HOUR } from '../../config.js';
import { getToken } from '../../lib/auth.js';
import { BOOL_HABITS } from '../../config/habits.js';
import { daysActive, exerciseDoneToday, windowOpenToday } from '../../lib/state.js';

function fmtHour(h) {
  if (h === 0 || h === 24) return 'midnight';
  if (h === 12) return '12pm';
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

function buildPrompt(S) {
  const now = new Date();
  const hh = now.getHours(), mm = now.getMinutes();
  const h12 = hh % 12 || 12;
  const timeStr = `${h12}:${mm.toString().padStart(2, '0')}${hh >= 12 ? 'pm' : 'am'}`;

  const days = daysActive(S.startDate);
  const vals = S.goodStuff?.values || {};
  const ticked = BOOL_HABITS.filter(h => vals[h.key] === true).map(h => h.label);
  const notTicked = BOOL_HABITS.filter(h => vals[h.key] !== true).map(h => h.label);

  return `You are a brief, honest daily debrief for someone working to overcome compulsive porn use. You have their current dashboard data and the time of day. Your job is to give them a short, specific snapshot of where they're at right now — not a lecture, not a checklist readout.

Current data:
- Time: ${timeStr}
- Sessions avoided (cumulative): ${S.sessionsAvoided}
- Days active: ${days}
- Current streak: ${days}
- Exercise done today: ${exerciseDoneToday(S.exerciseDate) ? 'yes' : 'no'}
- Window status: ${windowOpenToday() ? 'open' : 'closed'}
- Window opens at: ${fmtHour(WINDOW_OPEN_HOUR)}. Closes at: ${fmtHour(WINDOW_CLOSE_HOUR)}.
- Mood: ${vals.mood != null ? vals.mood : 'not logged'}/5
- Hours slept: ${vals.sleep_hours != null ? vals.sleep_hours : 'not logged'}
- Water: ${vals.water != null ? vals.water : 'not logged'}L
- Good stuff ticked today: ${ticked.length ? ticked.join(', ') : 'none'}
- Good stuff not ticked: ${notTicked.length ? notTicked.join(', ') : 'none'}

Rules:
- Acknowledge wins genuinely — not as a preamble to criticism, as actual good news
- Flag gaps honestly but without dwelling or moralising
- Be time-aware — calibrate expectations to the current time of day. 0.7L at 9am is fine. At 10pm it's a problem. No exercise at 8am is fine. At 3pm it's getting tight.
- If the window is approaching, mention it and whether prerequisites are met
- If it's a high-risk time of day (late evening, low mood, low sleep), name it plainly
- Tone: like a straight-talking friend who's been watching your day. Warm where it's earned. Direct where it matters.
- Length: 3-5 sentences maximum. No headers, no bullet points. Just a paragraph.
- Never generic. Every word should be specific to their actual data right now.`;
}

/* ── Facts modal ──────────────────────────────────── */
export function FactsModal({ S }) {
  const [view, setView] = useState('facts');
  const [loading, setLoading] = useState(false);
  const [debrief, setDebrief] = useState('');
  const [error, setError] = useState('');

  const runDebrief = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    setDebrief('');
    setView('debrief');
    try {
      const res = await fetch(DEBRIEF_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'x-app-token': getToken(),
        },
        body: JSON.stringify({ system: buildPrompt(S) }),
      });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      setDebrief((data.debrief || '').trim() || 'No response.');
    } catch {
      setError("Couldn't reach Claude right now. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="modal-eyebrow">Evidence</div>
      <div className="modal-title">The Cold Hard Facts</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        {view === 'debrief' && (
          <button
            className="action-btn"
            style={{ width: 'auto', padding: '7px 14px' }}
            onClick={() => setView('facts')}
          >
            ← Facts
          </button>
        )}
        <button
          className="action-btn strong"
          style={{ width: 'auto', padding: '7px 16px', marginLeft: 'auto' }}
          disabled={loading}
          onClick={runDebrief}
        >
          {loading ? 'Analysing…' : '↻ Today\'s Read'}
        </button>
      </div>

      {view === 'facts' ? (
        <div className="mc">
          <h2>The Time Maths</h2><p>5 hours a day. Every day.</p>
          <span className="big">76</span>
          <p>Full days per year. Not hours. <strong>Days.</strong> Two and a half months, annually, in a trance. Over five years: roughly a year of your life gone while conscious.</p>
          <hr className="mhr"/>
          <h2>What's Actually Happening in Your Brain</h2>
          <p><strong>Dopamine system is broken — measurably.</strong> Same mesolimbic pathway as substance addiction. Brain downregulates receptors in response to supernormal stimulation. Lower sensitivity. Higher threshold required for the same response. Ordinary pleasures register flat.</p>
          <p>The wanting/liking dissociation: you want it without liking it. That's not a personality flaw. That's a broken reward circuit operating exactly as expected.</p>
          <p><strong>Grey matter is reduced — measurably.</strong> Kühn &amp; Gallinat (2014) neuroimaging found significant negative correlation between grey matter volume in the reward centre and hours consumed. Heavy use also reduces connectivity between the reward system and the prefrontal cortex — the region responsible for impulse control.</p>
          <p><strong>Attention and working memory are impaired.</strong> The task avoidance isn't purely psychological. The hardware is compromised.</p>
          <hr className="mhr"/>
          <h2>Escalation Is Physics, Not Character</h2>
          <p>Tolerance is automatic. The brain habituates to repeated stimulus and requires increasing intensity. Content progression is a predictable consequence of frequency — not a reflection of who you are. <strong>Reduce frequency, tolerance resets. Content appetite de-escalates on its own. Weeks, not months.</strong></p>
          <hr className="mhr"/>
          <h2>Recovery Timeline</h2>
          <ul>
            <li><strong>Weeks 1–2:</strong> Withdrawal. Mood changes, cravings. Normal.</li>
            <li><strong>Weeks 2–6:</strong> Flatline. Grey, motivationless. This is recalibration, not damage revealing itself.</li>
            <li><strong>Months 2–3:</strong> Gradual improvement. Things register again. Food, music, ordinary life.</li>
            <li><strong>~14 months:</strong> Dopamine transporter levels return to near-normal.</li>
          </ul>
          <hr className="mhr"/>
          <h2>Sleep Is Not a Separate Problem</h2>
          <p>The prefrontal cortex — directly impaired by compulsive use, and the one exercise is rebuilding — is also the first thing to degrade with sleep deprivation. <strong>A single night under six hours produces measurable impulse control impairment.</strong> One night.</p>
          <p>Sleep deprivation also increases dopamine sensitivity in the reward pathway specifically. The craving hits harder and the brake fails simultaneously.</p>
          <hr className="mhr"/>
          <h2>Why Exercise Is in the System</h2>
          <p><strong>Six weeks of exercise measurably increases D2 receptor density</strong> — the exact receptors downregulated by compulsive use. Not a mood booster. Direct hardware repair.</p>
          <p><strong>BDNF spikes with vigorous exercise.</strong> Neuroplasticity fertiliser. Accelerates the rewiring required.</p>
          <p><strong>Prefrontal cortex volume increases</strong> with regular exercise over months. You are physically rebuilding the impulse control hardware that compulsive use eroded.</p>
          <div className="callout">You quit 40-a-day. You quit drinking. The capacity is demonstrably intact. The strategy just needed fixing.</div>
        </div>
      ) : (
        <div className={`insight-body${loading || error ? ' muted' : ''}`}>
          {loading
            ? 'Analysing your day…'
            : error
              ? error
              : debrief}
        </div>
      )}
    </div>
  );
}
