import { useState, useEffect, useRef } from 'react';
import { CHAT_URL, SUPABASE_ANON_KEY } from '../../config.js';
import { getToken } from '../../lib/auth.js';
import { BOOL_HABITS } from '../../config/habits.js';
import { daysActive, exerciseDoneToday, windowOpenToday } from '../../lib/state.js';

/* ── Chat (real Claude via edge function) ─────────── */
export function ChatModal({ S }) {
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState('');
  const [typing,setTyping]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'});},[messages,typing]);
  function buildSystem(S) {
    const gs=S.goodStuff.values;
    const done=BOOL_HABITS.filter(h=>gs[h.key]===true).map(h=>h.label);
    return `You are a calm, direct support voice for someone struggling with compulsive porn use right now.\n\nDashboard: Sessions avoided: ${S.sessionsAvoided}, Days active: ${daysActive(S.startDate)}, Exercise today: ${exerciseDoneToday(S.exerciseDate)?'yes':'no'}, Window open: ${windowOpenToday()?'yes':'no'}, Mood: ${gs.mood??'not logged'}/5, Sleep: ${gs.sleep_hours??'not logged'}h, Water: ${gs.water??'not logged'}L, Habits done: ${done.length?done.join(', '):'none'}.\n\nSystem: DNS blocking, scheduled windows, exercise as prerequisite. They've quit 40-a-day smoking and alcohol.\n\nJob: get them through the next 20 minutes. Be direct, no cotton wool, short responses. Ask what's happening if they don't say.`;
  }
  const send=async()=>{
    const text=input.trim(); if(!text||typing)return;
    setInput('');
    const msgs=[...messages,{role:'user',content:text}];
    setMessages(msgs); setTyping(true);
    try {
      const res=await fetch(CHAT_URL,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${SUPABASE_ANON_KEY}`,'apikey':SUPABASE_ANON_KEY,'x-app-token':getToken()},body:JSON.stringify({system:buildSystem(S),messages:msgs})});
      if(!res.ok)throw new Error(res.status);
      const data=await res.json();
      setMessages(m=>[...m,{role:'assistant',content:(data.reply||'').trim()||'No response.'}]);
    }catch{setMessages(m=>[...m,{role:'assistant',content:'Something went wrong. Check your connection and try again.'}]);}
    finally{setTyping(false);}
  };
  return (
    <div style={{display:'flex',flexDirection:'column',height:'54vh',minHeight:320}}>
      <div className="modal-eyebrow">Crisis support</div>
      <div className="modal-title" style={{marginBottom:0}}>Need Help Right Now</div>
      <div className="chat-messages" style={{flex:1}}>
        {messages.map((m,i)=><div key={i} className={`chat-msg ${m.role}`}>{m.content}</div>)}
        {typing&&<div className="chat-typing"><span/><span/><span/></div>}
        <div ref={endRef}/>
      </div>
      <div className="chat-input-area">
        <textarea className="chat-input" rows={1} value={input} placeholder="What's going on?"
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
          onInput={e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,120)+'px';}} />
        <button className="chat-send" disabled={typing} onClick={send}>↑</button>
      </div>
    </div>
  );
}
