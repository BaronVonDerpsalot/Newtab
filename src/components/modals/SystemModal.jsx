/* ── System modal ─────────────────────────────────── */
export function SystemModal() {
  return (
    <div>
      <div className="modal-eyebrow">Protocol</div>
      <div className="modal-title">The System</div>
      <div className="mc">
        <div className="callout"><strong>Core principle:</strong> In-session you cannot be trusted. All controls are pre-set. Nothing relies on in-session willpower. No concept that can break — slipping is inside the rules.</div>
        <h2>Infrastructure (Set and Forget)</h2>
        <ul>
          <li><strong>NextDNS — router level.</strong> Specific domains blocked on schedule. Lifts at 9pm on window days automatically. Back up in the morning automatically. AI generative content: permanently blocked regardless.</li>
          <li><strong>uBlock Origin — aggressive settings.</strong> Every browser, every device. Kills accidental trigger vectors.</li>
          <li><strong>Grayscale — scheduled.</strong> On during blocked hours, lifts with the window.</li>
        </ul>
        <h2>The Window</h2>
        <ul>
          <li>Designated days only — decided in advance, not in the moment</li>
          <li>Opens automatically at 9pm via NextDNS schedule</li>
          <li>Closes automatically in the morning</li>
          <li><strong>Requires 20 minutes real exercise that day</strong></li>
        </ul>
        <h2>The Exercise Rule</h2>
        <ul>
          <li>20 minutes, elevated heart rate — 120bpm+ target</li>
          <li>Mi Band data as validator. Objective. Non-negotiable.</li>
          <li>No exercise = no window. Full stop.</li>
        </ul>
        <h2>The Session Goal</h2>
        <p><strong>Quick finish is the explicit goal</strong> — not a consolation prize, an actual win. Gooning is addiction to the trance state, not climax. The blocked AI content removes the conditions the trance needs.</p>
        <h2>Tracking</h2>
        <p>No streak counter. Track <strong>cumulative wins</strong> only — sessions avoided, exercise done. A slip is a lower number. Not a catastrophe. Not a restart.</p>
        <h2>Sleep</h2>
        <p>Load-bearing, not optional. One bad night measurably tanks impulse control. Treat it like infrastructure.</p>
        <hr className="mhr"/>
        <p style={{fontSize:'.75rem',color:'var(--text-2)'}}>One problem at a time. The system runs itself. Don't add anything else to it.</p>
      </div>
    </div>
  );
}
