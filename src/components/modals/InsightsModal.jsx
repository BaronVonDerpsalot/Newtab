import { useState, useEffect } from 'react';
import { FEEDBACK_URL, SUPABASE_ANON_KEY } from '../../config.js';
import { getToken } from '../../lib/auth.js';
import { buildStats, saveState } from '../../lib/state.js';

/* ── Insights (real Claude API) ───────────────────── */
export function InsightsModal({ S }) {
  const [body,setBody]=useState(S.lastInsight||'');
  const [meta,setMeta]=useState('');
  const [loading,setLoading]=useState(false);
  useEffect(()=>{
    if(S.lastInsight){setBody(S.lastInsight);setMeta(S.lastInsightAt?`Last updated ${fmtAgo(S.lastInsightAt)}`:'');}
    else{setBody('');setMeta('');}
  },[]);
  function fmtAgo(iso){const diff=Date.now()-new Date(iso).getTime();const mins=Math.floor(diff/60000);if(mins<1)return'just now';if(mins<60)return`${mins}m ago`;const hrs=Math.floor(mins/60);if(hrs<24)return`${hrs}h ago`;return`${Math.floor(hrs/24)}d ago`;}
  const refresh=async()=>{
    if(loading)return; setLoading(true); setBody('Reading your stats…'); setMeta('');
    try{
      const stats=await buildStats(S);
      const res=await fetch(FEEDBACK_URL,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${SUPABASE_ANON_KEY}`,'apikey':SUPABASE_ANON_KEY,'x-app-token':getToken()},body:JSON.stringify({stats})});
      if(!res.ok)throw new Error(res.status);
      const data=await res.json();
      const text=(data.feedback||'').trim()||'No response.';
      setBody(text); setMeta('Just now');
      S.lastInsight=text; S.lastInsightAt=new Date().toISOString();
      await saveState(S);
    }catch{setBody('Could not reach Claude right now. Check that the feedback function is deployed, then try again.');}
    finally{setLoading(false);}
  };
  useEffect(()=>{if(!S.lastInsight&&!loading)refresh();},[]);
  return (
    <div>
      <div className="modal-eyebrow">Claude</div>
      <div className="modal-title">Insights</div>
      {meta&&<div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-2)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:14}}>{meta}</div>}
      <div className={`insight-body ${body&&body!=='Reading your stats…'?'':'muted'}`}>{body||'No insights yet — tap Refresh.'}</div>
      <div style={{marginTop:18,display:'flex',justifyContent:'flex-end'}}>
        <button className="action-btn" style={{width:'auto',padding:'8px 20px'}} disabled={loading} onClick={refresh}>{loading?'Loading…':'Refresh'}</button>
      </div>
    </div>
  );
}
