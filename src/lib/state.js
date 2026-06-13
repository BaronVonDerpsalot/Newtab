import { db } from './supabase.js';
import { USER_ID, WINDOW_OPEN_HOUR, WINDOW_CLOSE_HOUR } from '../config.js';
import { HABITS } from '../config/habits.js';
import { todayStr } from './time.js';

/* ── State helpers ────────────────────────────────── */
export function freshDefaults() {
  return { theme:'dark', sessionsAvoided:0, startDate:todayStr(), exerciseDate:null,
    windowDate:null, goodStuff:{date:todayStr(),values:{}}, sessionsToday:0,
    lastInsight:null, lastInsightAt:null };
}
export function normalizeGoodStuff(gs) {
  if (!gs || gs.date !== todayStr()) return { date:todayStr(), values:{} };
  if (gs.values && typeof gs.values === 'object') return { date:gs.date, values:gs.values };
  if (Array.isArray(gs.items)) { const values={}; for(const k of gs.items) values[k]=true; return{date:gs.date,values}; }
  return { date:todayStr(), values:{} };
}
export function daysActive(startDate) { return Math.max(0, Math.floor((new Date()-new Date(startDate))/86400000))+1; }
export function exerciseDoneToday(ed) { return ed === todayStr(); }
export function windowOpenToday() { const h=new Date().getHours(); return h>=WINDOW_OPEN_HOUR&&h<WINDOW_CLOSE_HOUR; }

/* ── Supabase ─────────────────────────────────────── */
export async function fetchState() {
  try {
    const{data,error}=await db.from('tab_state')
      .select('sessions_avoided,start_date,exercise_date,window_date,theme,good_stuff,last_insight,last_insight_at')
      .eq('user_id',USER_ID).maybeSingle();
    if(error||!data) return{state:freshDefaults(),ok:false};
    let goodStuff=normalizeGoodStuff(data.good_stuff),sessionsToday=0;
    try {
      const{data:row}=await db.from('daily_log')
        .select('values,sessions_today').eq('user_id',USER_ID).eq('log_date',todayStr()).maybeSingle();
      if(row){if(row.values&&typeof row.values==='object') goodStuff={date:todayStr(),values:row.values}; sessionsToday=row.sessions_today??0;}
    }catch{}
    return{state:{
      theme:data.theme||'dark',sessionsAvoided:data.sessions_avoided??0,
      startDate:data.start_date||todayStr(),exerciseDate:data.exercise_date||null,
      windowDate:data.window_date||null,goodStuff,sessionsToday,
      lastInsight:data.last_insight||null,lastInsightAt:data.last_insight_at||null,
    },ok:true};
  }catch{return{state:freshDefaults(),ok:false};}
}
export async function saveState(S) {
  const now=new Date().toISOString(),today=todayStr(); let ok=true;
  try{const{error}=await db.from('tab_state').upsert({user_id:USER_ID,sessions_avoided:S.sessionsAvoided,start_date:S.startDate,exercise_date:S.exerciseDate,window_date:S.windowDate,theme:S.theme,good_stuff:S.goodStuff,last_insight:S.lastInsight,last_insight_at:S.lastInsightAt,updated_at:now},{onConflict:'user_id'});if(error)ok=false;}catch{ok=false;}
  try{const{error}=await db.from('daily_log').upsert({user_id:USER_ID,log_date:today,values:S.goodStuff.values,exercise_done:S.exerciseDate===today,window_open:windowOpenToday(),sessions_today:S.sessionsToday||0,updated_at:now},{onConflict:'user_id,log_date'});if(error)ok=false;}catch{ok=false;}
  return ok;
}
export async function fetchHistory(days=30) {
  try{const{data}=await db.from('daily_log').select('log_date,values,exercise_done,window_open,sessions_today').eq('user_id',USER_ID).order('log_date',{ascending:false}).limit(days);return data||[];}catch{return[];}
}
export async function buildStats(S) {
  const rows=await fetchHistory(30),asc=[...rows].reverse();
  const avg=arr=>arr.length?Math.round((arr.reduce((a,b)=>a+b,0)/arr.length)*10)/10:null;
  const habitSummary={};
  for(const h of HABITS){
    if(h.type==='bool'){
      const d7=rows.slice(0,7),d30=rows;
      habitSummary[h.key]={label:h.label,type:'bool',last7_days_done:`${d7.filter(r=>r.values&&r.values[h.key]===true).length}/${d7.length}`,last30_days_done:`${d30.filter(r=>r.values&&r.values[h.key]===true).length}/${d30.length}`};
    } else {
      const v7=rows.slice(0,7).map(r=>r.values&&r.values[h.key]!=null?Number(r.values[h.key]):null).filter(v=>v!=null);
      const v30=rows.map(r=>r.values&&r.values[h.key]!=null?Number(r.values[h.key]):null).filter(v=>v!=null);
      habitSummary[h.key]={label:h.label,type:'numeric',unit:h.unit||'',avg_last7:avg(v7),avg_last30:avg(v30),days_tracked_30:v30.length};
    }
  }
  return{today:todayStr(),days_active:daysActive(S.startDate),sessions_avoided_total:S.sessionsAvoided,sessions_avoided_today:S.sessionsToday,sessions_avoided_last7:asc.slice(-7).reduce((a,r)=>a+(r.sessions_today||0),0),exercise_done_last7:rows.slice(0,7).filter(r=>r.exercise_done).length,habits:habitSummary};
}
