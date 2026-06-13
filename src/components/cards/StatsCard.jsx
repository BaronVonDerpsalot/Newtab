/* ── Stats card ───────────────────────────────────── */
export function StatsCard({ sessions, days }) {
  return (
    <div className="card cell-stats" style={{padding:0}}>
      <div className="stats-grid">
        <div className="stat-block"><div className="stat-number">{sessions}</div><div className="stat-lbl">Sessions Avoided</div></div>
        <div className="stat-divider"></div>
        <div className="stat-block"><div className="stat-number">{days}</div><div className="stat-lbl">Days Active</div></div>
      </div>
    </div>
  );
}
