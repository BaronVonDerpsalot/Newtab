import { useState, useEffect } from 'react';

export function JournalModal() {
  const [text,setText]=useState(()=>{try{return localStorage.getItem('nt_journal')||'';}catch{return '';}});
  useEffect(()=>{try{localStorage.setItem('nt_journal',text);}catch{};},[text]);
  return (
    <div>
      <div className="modal-eyebrow">Today</div>
      <div className="modal-title">Journal</div>
      <div className="modal-sub">Write anything. Stays on this device.</div>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="What's on your mind?"
        style={{width:'100%',minHeight:210,background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:16,color:'var(--text-1)',fontFamily:'var(--font-sans)',fontSize:14,lineHeight:1.65,resize:'vertical',outline:'none'}} />
      <div style={{textAlign:'right',marginTop:8,fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text-2)',letterSpacing:'.1em',textTransform:'uppercase'}}>{text.length} chars — auto-saved</div>
    </div>
  );
}
