import { Ico } from '../Ico.jsx';

/* ── Shortcuts card ───────────────────────────────── */
const SHORTCUTS = [
  {id:'timer',label:'Focus Timer'},{id:'journal',label:'Journal'},
  {id:'breathe',label:'Breathe'},{id:'resources',label:'Resources'},
];
function ShortcutIcon({id}) {
  switch(id) {
    case 'timer':     return <Ico size={20}><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9.5 2.5h5M12 2.5v2"/></Ico>;
    case 'journal':   return <Ico size={20}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></Ico>;
    case 'breathe':   return <Ico size={20}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></Ico>;
    case 'resources': return <Ico size={20}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></Ico>;
    default:          return <Ico size={20}><circle cx="12" cy="12" r="10"/></Ico>;
  }
}
export function ShortcutsCard({ onOpen }) {
  return (
    <div className="card cell-shortcuts">
      <div className="mono-label">Shortcuts</div>
      <div className="shortcut-grid">
        {SHORTCUTS.map(s=>(
          <button key={s.id} className="shortcut-btn" onClick={()=>onOpen(s.id)}>
            <ShortcutIcon id={s.id}/><span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
