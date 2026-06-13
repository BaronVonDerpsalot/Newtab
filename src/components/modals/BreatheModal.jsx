import { useState, useEffect } from 'react';

export function BreatheModal() {
  const phases=['Breathe in','Hold','Breathe out','Hold'],durations=[4,2,6,2];
  const [phase,setPhase]=useState(0),[count,setCount]=useState(4),[active,setActive]=useState(false);
  useEffect(()=>{
    if(!active)return;
    if(count>0){const t=setTimeout(()=>setCount(c=>c-1),1000);return()=>clearTimeout(t);}
    else{const next=(phase+1)%4;setPhase(next);setCount(durations[next]);}
  },[active,count,phase]);
  const scl=active&&phase===0?1:active&&(phase===2||phase===3)?.58:.72;
  const dur=phase===0?'4s':phase===2?'6s':'0.3s';
  return (
    <div style={{textAlign:'center'}}>
      <div className="modal-eyebrow" style={{textAlign:'left'}}>4-2-6-2 pattern</div>
      <div className="modal-title" style={{textAlign:'left',marginBottom:36}}>Breathing</div>
      <div style={{position:'relative',width:170,height:170,margin:'0 auto 28px',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{position:'absolute',width:160,height:160,borderRadius:'50%',border:'1px solid var(--border)',opacity:.4}}></div>
        <div className="breathe-circle" style={{width:140,height:140,transform:`scale(${scl})`,transition:`transform ${dur} ease-in-out`}}>
          <span style={{fontFamily:'var(--font-mono)',fontSize:30,fontWeight:700,color:'var(--accent)'}}>{active?count:'–'}</span>
        </div>
      </div>
      <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--text-2)',marginBottom:28,height:20}}>
        {active?phases[phase]:'Ready when you are'}
      </div>
      <button className="action-btn" style={{width:'auto',padding:'10px 40px',margin:'0 auto'}}
        onClick={()=>{setActive(a=>!a);if(!active){setPhase(0);setCount(4);}}}>
        {active?'Pause':'Begin'}
      </button>
    </div>
  );
}
