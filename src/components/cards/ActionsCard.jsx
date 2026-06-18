/* ── Actions card ─────────────────────────────────── */
export function ActionsCard({ onMarkAvoided, onLogSlip, onOpenModal, windowOpen, dayEnded, onEndDay, slipsToday }) {
  return (
    <div className="card cell-actions" style={{display:'flex',flexDirection:'column'}}>
      {!windowOpen && <button className="action-btn" onClick={()=>onOpenModal('help')}>Need help right now?</button>}
      <button className="action-btn strong" onClick={onMarkAvoided}>+ Mark Session Avoided</button>
      <button className="action-btn subtle" onClick={onLogSlip}>Log a slip{slipsToday ? ` · ${slipsToday} today` : ''}</button>
      <div className="m-divider"></div>
      <div className="action-row-2">
        <button className="action-btn" onClick={()=>onOpenModal('facts')}>The Facts ↗</button>
        <button className="action-btn" onClick={()=>onOpenModal('system')}>The System ↗</button>
      </div>
      <div className="m-divider"></div>
      <button className="action-btn" onClick={()=>onOpenModal('insights')}>✦ Insights from Claude</button>
      <button className="action-btn" onClick={()=>onOpenModal('history')}>History ↗</button>
      <div className="m-divider"></div>
      <div className="action-row-3">
        <button className="action-btn" onClick={()=>onOpenModal('timer')}>Timer</button>
        <button className="action-btn" onClick={()=>onOpenModal('breathe')}>Breathe</button>
        <button className="action-btn" onClick={()=>onOpenModal('resources')}>Resources</button>
      </div>
      <div className="m-divider"></div>
      <button
        className="action-btn end-day-btn"
        onClick={!dayEnded ? onEndDay : undefined}
        disabled={dayEnded}
      >
        {dayEnded ? 'Day ended ✓' : 'End day →'}
      </button>
    </div>
  );
}
