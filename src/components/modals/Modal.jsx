import { useEffect } from 'react';
import { TimerModal } from './TimerModal.jsx';
import { JournalModal } from './JournalModal.jsx';
import { BreatheModal } from './BreatheModal.jsx';
import { ResourcesModal } from './ResourcesModal.jsx';
import { ChatModal } from './ChatModal.jsx';
import { FactsModal } from './FactsModal.jsx';
import { SystemModal } from './SystemModal.jsx';
import { InsightsModal } from './InsightsModal.jsx';
import { HistoryModal } from './HistoryModal.jsx';

/* ── Modal shell ──────────────────────────────────── */
export function Modal({ id, onClose, S }) {
  useEffect(()=>{
    const fn=e=>{if(e.key==='Escape')onClose();};
    window.addEventListener('keydown',fn); return()=>window.removeEventListener('keydown',fn);
  },[onClose]);
  const isChatLike = id==='help';
  const contents = {
    timer:    <TimerModal/>,
    journal:  <JournalModal/>,
    breathe:  <BreatheModal/>,
    resources:<ResourcesModal/>,
    help:     <ChatModal S={S}/>,
    facts:    <FactsModal/>,
    system:   <SystemModal/>,
    insights: <InsightsModal S={S}/>,
    history:  <HistoryModal/>,
  };
  if(!contents[id])return null;
  return(
    <div className="modal-bg" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className={`modal-box ${isChatLike?'chat':''}`}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        {contents[id]}
      </div>
    </div>
  );
}
