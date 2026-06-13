/* ── Actions card ─────────────────────────────────── */
export function ActionsCard({ onMarkAvoided, onOpenModal, windowOpen }) {
  return (
    <div className="card cell-actions" style={{display:'flex',flexDirection:'column'}}>
      {!windowOpen && <button className="action-btn" onClick={()=>onOpenModal('help')}>Need help right now?</button>}
      <button className="action-btn strong" onClick={onMarkAvoided}>+ Mark Session Avoided</button>
      <div className="m-divider"></div>
      <div className="action-row-2">
        <button className="action-btn" onClick={()=>onOpenModal('facts')}>The Facts ↗</button>
        <button className="action-btn" onClick={()=>onOpenModal('system')}>The System ↗</button>
      </div>
      <div className="m-divider"></div>
      <button className="action-btn" onClick={()=>onOpenModal('insights')}>✦ Insights from Claude</button>
      <button className="action-btn" onClick={()=>onOpenModal('history')}>History ↗</button>
    </div>
  );
}
