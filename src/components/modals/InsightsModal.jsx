import { useState, useEffect } from 'react';
import { buildStats } from '../../lib/state.js';
import { ChatThread } from './ChatThread.jsx';

/* ── Insights: conversational stats coach (real Claude) ──
 * Loads the full 30-day stats summary, embeds it in the system prompt, and
 * opens with a read on how things are going. The user can then ask anything
 * about their own data — trends, what to focus on, how sleep is tracking, etc. */
const COACH_PROMPT = `You are a warm, perceptive, evidence-based habit coach embedded in someone's personal recovery dashboard. The person is recovering from a compulsive habit and rebuilding healthy daily routines. You are given their tracked stats — short-term (last 7 days) and longer-term (last 30 days) — as JSON, and you can have a back-and-forth conversation about them.

Grounding facts you may draw on (already part of this app's philosophy):
- Sleep is load-bearing. A single night under ~6 hours measurably impairs the prefrontal cortex — the exact region responsible for impulse control — and increases dopamine sensitivity in the reward pathway, so cravings hit harder while the brake is weaker. Poor sleep makes a relapse meaningfully more likely the next day.
- Exercise directly rebuilds the hardware: ~6 weeks of regular exercise increases D2 receptor density (the receptors downregulated by compulsive use), BDNF spikes aid neuroplasticity, and prefrontal-cortex volume grows over months.
- Recovery is non-linear — an early "flatline" (grey, low-motivation) period is recalibration, not damage. Things register again over months.
- Tracking here is about cumulative wins, not streaks. A slip is a lower number, not a catastrophe or a restart.

How to respond:
- Always be concrete and specific to their actual numbers — cite the real figures from the data, never generic.
- Connect deficits to consequences using the facts above where relevant. Acknowledge what's going well; don't only flag problems.
- Be kind and direct, never preachy, clinical, or alarmist. No emoji. No markdown headers.
- This is a conversation: keep replies short and natural (a few sentences) unless they explicitly ask for depth.
- If data is sparse, say so gently rather than over-interpreting.`;

export function InsightsModal({ S }) {
  const [system, setSystem] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    buildStats(S)
      .then(stats => {
        if (!alive) return;
        setSystem(`${COACH_PROMPT}\n\nHere is their tracked stats data as JSON:\n${JSON.stringify(stats, null, 2)}`);
      })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="modal-eyebrow">Claude</div>
      <div className="modal-title" style={{ marginBottom: 0 }}>Insights</div>
      {system ? (
        <ChatThread
          system={system}
          seed="Give me your honest, specific read on how I'm doing — the short-term picture and the longer trend. Open with the single most important thing, tied to a real number."
          placeholder="Ask about your stats…"
          thinkingLabel="Reading your stats…"
        />
      ) : (
        <div className="insight-body muted" style={{ marginTop: 18 }}>
          {failed ? "Couldn't load your stats. Close and try again." : 'Loading your stats…'}
        </div>
      )}
    </div>
  );
}
