import { useState, useEffect } from 'react';
import { HABITS } from '../../config/habits.js';
import { fetchHistory } from '../../lib/state.js';

/* ── History modal (real Supabase data) ───────────── */
export function HistoryModal() {
  const [rows,setRows]=useState(null);
  useEffect(()=>{fetchHistory(30).then(setRows);},[]);
  if(!rows) return <div><div className="modal-title">History</div><div className="hist-empty">Loading…</div></div>;
  if(!rows.length) return <div><div className="modal-title">History</div><div className="hist-empty">No history yet.<br/>Track a few days and trends will show up here.</div></div>;
  const asc=[...rows].reverse(),last14=asc.slice(-14);
  const avg=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;
  function NumericBlock({label,vals,maxV,unit,stat}){
    const bars=vals.map((v,i)=>{
      if(v==null)return<div key={i} className="hist-bar empty" style={{height:'6%'}}></div>;
      const pct=maxV>0?Math.max(6,(v/maxV)*100):6;
      return<div key={i} className="hist-bar" style={{height:pct+'%'}}></div>;
    });
    return(
      <div className="hist-row">
        <div className="hist-head"><span className="hist-label">{label}</span><span className="hist-stat">{stat||''}</span></div>
        <div className="hist-strip">{bars}</div>
      </div>
    );
  }
  const maxSessions=Math.max(1,...asc.map(r=>r.sessions_today||0));
  return (
    <div>
      <div className="modal-eyebrow">Last 30 days</div>
      <div className="modal-title">History</div>
      <div className="mc">
        <NumericBlock label="Sessions avoided" vals={asc.map(r=>r.sessions_today||0)} maxV={maxSessions} stat={`${asc.reduce((a,r)=>a+(r.sessions_today||0),0)} total`}/>
        {HABITS.map(h=>{
          if(h.type==='bool'){
            const pct=Math.round((rows.filter(r=>r.values&&r.values[h.key]===true).length/rows.length)*100);
            const strip=last14.map((r,i)=><div key={i} className={`hist-cell ${r.values&&r.values[h.key]===true?'on':''}`} style={{height:'100%'}}></div>);
            return(<div key={h.key} className="hist-row">
              <div className="hist-head"><span className="hist-label">{h.label}</span><span className="hist-stat">{pct}% · {rows.filter(r=>r.values&&r.values[h.key]===true).length}/{rows.length} days</span></div>
              <div className="hist-strip">{strip}</div>
            </div>);
          } else {
            const vals=rows.map(r=>r.values&&r.values[h.key]!=null?Number(r.values[h.key]):null);
            const present=vals.filter(v=>v!=null);if(!present.length)return null;
            const a7=avg(rows.slice(0,7).map(r=>r.values&&r.values[h.key]!=null?Number(r.values[h.key]):null).filter(v=>v!=null));
            const a30=avg(present);
            return<NumericBlock key={h.key} label={h.label} vals={asc.map(r=>r.values&&r.values[h.key]!=null?Number(r.values[h.key]):null)} maxV={Math.max(...present)} stat={`7d ${Math.round(a7*10)/10}${h.unit||''} · 30d ${Math.round(a30*10)/10}${h.unit||''}`}/>;
          }
        })}
      </div>
    </div>
  );
}
