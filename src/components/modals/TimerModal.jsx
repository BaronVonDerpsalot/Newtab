import { useState, useEffect, useRef } from 'react';

export function TimerModal() {
  const PRESETS=[25,10,5];
  const [preset,setPreset]=useState(25);
  const [secs,setSecs]=useState(25*60);
  const [running,setRunning]=useState(false);
  const [done,setDone]=useState(false);
  const intRef=useRef(null);
  useEffect(()=>{
    if(running&&secs>0){intRef.current=setInterval(()=>setSecs(s=>s-1),1000);}
    else if(secs===0&&running){setRunning(false);setDone(true);}
    return()=>clearInterval(intRef.current);
  },[running,secs]);
  const reset=(p)=>{const mins=p||preset;setRunning(false);setDone(false);setSecs(mins*60);};
  const total=preset*60,pct=((total-secs)/total)*100,R=70,C=2*Math.PI*R;
  const m=String(Math.floor(secs/60)).padStart(2,'0'),s=String(secs%60).padStart(2,'0');
  return (
    <div>
      <div className="modal-eyebrow">Pomodoro</div>
      <div className="modal-title">Focus Timer</div>
      <div style={{display:'flex',gap:8,marginBottom:24}}>
        {PRESETS.map(p=>(
          <button key={p} onClick={()=>{setPreset(p);reset(p);}}
            style={{padding:'5px 12px',borderRadius:'var(--radius-md)',border:`1px solid ${preset===p?'var(--accent)':'var(--border)'}`,background:preset===p?'var(--accent-soft)':'transparent',color:preset===p?'var(--accent)':'var(--text-2)',fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.1em',cursor:'pointer'}}>
            {p} min
          </button>
        ))}
      </div>
      <div style={{textAlign:'center'}}>
        <svg width="170" height="170" viewBox="0 0 170 170" style={{display:'block',margin:'0 auto 20px'}}>
          <circle cx="85" cy="85" r={R} fill="none" stroke="var(--border)" strokeWidth="6"/>
          <circle cx="85" cy="85" r={R} fill="none" stroke="var(--accent)" strokeWidth="6"
            strokeDasharray={C} strokeDashoffset={C*(1-pct/100)} strokeLinecap="round"
            transform="rotate(-90 85 85)" style={{transition:running?'stroke-dashoffset 0.9s linear':'none'}}/>
          <text x="85" y="93" textAnchor="middle" fill="var(--text-1)"
            style={{fontFamily:'var(--font-sans)',fontSize:34,fontWeight:300,letterSpacing:'-0.03em'}}>{m}:{s}</text>
        </svg>
        {done&&<div style={{color:'var(--accent)',fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'.16em',marginBottom:16}}>SESSION COMPLETE</div>}
        <div style={{display:'flex',gap:10,justifyContent:'center'}}>
          <button className="action-btn" style={{width:'auto',padding:'10px 32px'}} onClick={()=>setRunning(r=>!r)}>{running?'Pause':done?'Again':'Start'}</button>
          <button className="action-btn" style={{width:'auto',padding:'10px 22px'}} onClick={()=>reset()}>Reset</button>
        </div>
      </div>
    </div>
  );
}
