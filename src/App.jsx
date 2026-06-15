import { useState, useEffect, useRef, useCallback } from 'react';
import { VERSION } from './config.js';
import { useTweaks } from './hooks/useTweaks.js';
import { autoIsDark } from './lib/suncalc.js';
import { effectiveDateStr, isDayManuallyEnded, endDay } from './lib/time.js';
import {
  freshDefaults, daysActive, exerciseDoneToday, windowOpenToday,
  fetchState, saveState,
} from './lib/state.js';

import { ClockCard } from './components/cards/ClockCard.jsx';
import { StatsCard } from './components/cards/StatsCard.jsx';
import { HabitsCard } from './components/cards/HabitsCard.jsx';
import { SlidersCard } from './components/cards/SlidersCard.jsx';
import { PrereqsCard } from './components/cards/PrereqsCard.jsx';
import { ActionsCard } from './components/cards/ActionsCard.jsx';
import { UpcomingCard } from './components/cards/UpcomingCard.jsx';
import { ShortcutsCard } from './components/cards/ShortcutsCard.jsx';
import { TodoCard } from './components/cards/TodoCard.jsx';
import { GalleryCard } from './components/cards/GalleryCard.jsx';
import {
  TweaksPanel, TweakSection, TweakRadio, TweakSelect,
  TweakSlider, TweakToggle, TweakColor,
} from './components/tweaks/TweaksPanel.jsx';
import { Modal } from './components/modals/Modal.jsx';

/* ══ ACCENT MAP ═════════════════════════════════════ */
const ACCENT_MAP={
  amber:{light:'#b87800',dark:'#e8b84a',softL:'rgba(184,120,0,.10)',softD:'rgba(232,184,74,.14)'},
  sage: {light:'#4a7c59',dark:'#7dbf92',softL:'rgba(74,124,89,.10)',softD:'rgba(125,191,146,.14)'},
  rose: {light:'#a84455',dark:'#e87a8a',softL:'rgba(168,68,85,.10)',softD:'rgba(232,122,138,.14)'},
  slate:{light:'#4a5568',dark:'#90a0b4',softL:'rgba(74,85,104,.10)',softD:'rgba(144,160,180,.14)'},
  copper:{light:'#a0522d',dark:'#d4855a',softL:'rgba(160,82,45,.10)',softD:'rgba(212,133,90,.14)'},
};
const TWEAK_DEFAULTS={
  theme:'dark',font:'Space Grotesk',bodySize:14,clockWeight:300,
  accentScheme:'amber',density:'regular',showSeconds:false,
  dateFormat:'long',habitColor:'#5a9e2f',cardRadius:20,gridGap:12,
};

/* ══ APP ════════════════════════════════════════════ */
export function App() {
  const [t,setTweak]=useTweaks(TWEAK_DEFAULTS);
  const [S,setS]=useState(null);
  const [syncState,setSyncState]=useState('syncing');
  const [modal,setModal]=useState(null);
  const [tweaksOpen,setTweaksOpen]=useState(false);
  const [todos,setTodos]=useState(()=>{
    try{return JSON.parse(localStorage.getItem('nt_todos')||'null')||[
      {id:1,text:'Read for 20 mins',done:false},{id:2,text:'Morning meditation',done:false},
      {id:3,text:'Take medication',done:false},{id:4,text:'Plan meals',done:false},
    ];}catch{return[];}
  });
  const [time,setTime]=useState(new Date());
  const [dayEnded,setDayEnded]=useState(isDayManuallyEnded);
  const SRef=useRef(null);
  const effectiveDateRef=useRef(effectiveDateStr());

  /* Initial load */
  useEffect(()=>{
    fetchState().then(({state,ok})=>{
      setS(state); SRef.current=state;
      setSyncState(ok?'idle':'error');
      /* Apply saved theme to tweaks */
      if(state.theme&&state.theme!==TWEAK_DEFAULTS.theme) setTweak('theme',state.theme);
    });
  },[]);

  /* Clock tick + effective-date rollover detection */
  useEffect(()=>{
    const id=setInterval(()=>{
      setTime(new Date());
      const cur=effectiveDateStr();
      if(cur!==effectiveDateRef.current){
        effectiveDateRef.current=cur;
        setDayEnded(isDayManuallyEnded());
        fetchState().then(({state,ok})=>{setS(state);SRef.current=state;setSyncState(ok?'idle':'error');});
      }
    },10000);
    return()=>clearInterval(id);
  },[]);

  /* Theme effect */
  useEffect(()=>{
    const eff=t.theme==='auto'?(autoIsDark()?'dark':'light'):t.theme;
    document.documentElement.setAttribute('data-theme',eff);
  },[t.theme,time]);

  /* Font */
  useEffect(()=>{ document.body.style.fontSize=t.bodySize+'px'; },[t.bodySize]);

  /* Accent */
  useEffect(()=>{
    const s=ACCENT_MAP[t.accentScheme]||ACCENT_MAP.amber,dark=t.theme==='dark'||(t.theme==='auto'&&autoIsDark());
    document.documentElement.style.setProperty('--accent',dark?s.dark:s.light);
    document.documentElement.style.setProperty('--accent-soft',dark?s.softD:s.softL);
  },[t.accentScheme,t.theme,time]);

  /* Habit color */
  useEffect(()=>{
    const c=t.habitColor;
    document.documentElement.style.setProperty('--habit-green',c);
    document.documentElement.style.setProperty('--habit-green-soft',c+'22');
    document.documentElement.style.setProperty('--habit-green-border',c+'55');
  },[t.habitColor]);

  /* Clock weight */
  useEffect(()=>{ document.documentElement.style.setProperty('--clock-weight',t.clockWeight); },[t.clockWeight]);

  /* Card radius */
  useEffect(()=>{ document.documentElement.style.setProperty('--card-r',t.cardRadius+'px'); },[t.cardRadius]);

  /* Grid gap */
  useEffect(()=>{ document.documentElement.style.setProperty('--grid-gap',t.gridGap+'px'); },[t.gridGap]);

  /* Todos persist */
  useEffect(()=>{ try{localStorage.setItem('nt_todos',JSON.stringify(todos));}catch{} },[todos]);

  /* Save helper */
  const save=useCallback(async(next)=>{
    setSyncState('syncing');
    const ok=await saveState(next);
    setSyncState(ok?'idle':'error');
  },[]);

  const handleEndDay=useCallback(()=>{
    endDay();
    const cur=effectiveDateStr();
    effectiveDateRef.current=cur;
    setDayEnded(true);
    setSyncState('syncing');
    fetchState().then(({state,ok})=>{setS(state);SRef.current=state;setSyncState(ok?'idle':'error');});
  },[]);

  const updateS=useCallback((updater)=>{
    setS(prev=>{
      const next=updater(prev||freshDefaults());
      SRef.current=next;
      save(next);
      return next;
    });
  },[save]);

  if(!S) return null;

  return (
    <>
      <div className="dashboard">
        <ClockCard time={time} showSec={t.showSeconds} dateFormat={t.dateFormat}/>

        <StatsCard sessions={S.sessionsAvoided} days={daysActive(S.startDate)}/>

        <HabitsCard values={S.goodStuff.values}
          onToggle={key=>updateS(s=>{
            const vs={...s.goodStuff.values};
            if(vs[key]===true) delete vs[key]; else vs[key]=true;
            return{...s,goodStuff:{date:effectiveDateStr(),values:vs}};
          })}/>

        <SlidersCard values={S.goodStuff.values}
          onUpdate={(key,val)=>setS(s=>({...s,goodStuff:{date:effectiveDateStr(),values:{...s.goodStuff.values,[key]:val}}}))}
          onCommit={(key,val)=>updateS(s=>({...s,goodStuff:{date:effectiveDateStr(),values:{...s.goodStuff.values,[key]:val}}}))}/>

        <PrereqsCard
          exerciseDone={exerciseDoneToday(S.exerciseDate)}
          windowOpen={windowOpenToday()}
          onToggleExercise={()=>updateS(s=>({...s,exerciseDate:exerciseDoneToday(s.exerciseDate)?null:effectiveDateStr()}))}/>

        <ActionsCard
          onMarkAvoided={()=>updateS(s=>({...s,sessionsAvoided:s.sessionsAvoided+1,sessionsToday:(s.sessionsToday||0)+1}))}
          onOpenModal={setModal}
          windowOpen={windowOpenToday()}
          dayEnded={dayEnded}
          onEndDay={handleEndDay}/>

        <UpcomingCard/>

        <ShortcutsCard onOpen={setModal}/>

        <TodoCard todos={todos} onToggle={id=>setTodos(ts=>ts.map(t=>t.id===id?{...t,done:!t.done}:t))}/>

        <GalleryCard/>

        <TweaksPanel title="Tweaks" open={tweaksOpen} onClose={()=>setTweaksOpen(false)}>
          <TweakSection label="Appearance"/>
          <TweakRadio label="Mode" value={t.theme} options={['dark','light','auto']} onChange={v=>setTweak('theme',v)}/>
          <TweakSelect label="Accent" value={t.accentScheme} options={['amber','sage','rose','slate','copper']} onChange={v=>setTweak('accentScheme',v)}/>
          <TweakSection label="Typography"/>
          <TweakSlider label="Body size" value={t.bodySize} min={11} max={18} step={1} unit="px" onChange={v=>setTweak('bodySize',v)}/>
          <TweakSlider label="Clock weight" value={t.clockWeight} min={200} max={600} step={100} onChange={v=>setTweak('clockWeight',v)}/>
          <TweakSelect label="Date format" value={t.dateFormat} options={['long','short','iso']} onChange={v=>setTweak('dateFormat',v)}/>
          <TweakToggle label="Show seconds" value={t.showSeconds} onChange={v=>setTweak('showSeconds',v)}/>
          <TweakSection label="Layout"/>
          <TweakRadio label="Density" value={t.density} options={['compact','regular','comfy']} onChange={v=>setTweak('density',v)}/>
          <TweakSlider label="Card radius" value={t.cardRadius} min={6} max={32} step={2} unit="px" onChange={v=>setTweak('cardRadius',v)}/>
          <TweakSlider label="Grid gap" value={t.gridGap} min={4} max={24} step={2} unit="px" onChange={v=>setTweak('gridGap',v)}/>
          <TweakSection label="Habits"/>
          <TweakColor label="Check colour" value={t.habitColor} options={['#5a9e2f','#e8b84a','#4a9e8f','#e87a8a','#7a6fbf']} onChange={v=>setTweak('habitColor',v)}/>
        </TweaksPanel>
      </div>

      {/* Fixed chrome */}
      <div className="live-dot" data-sync={syncState==='idle'?undefined:syncState} onClick={syncState==='error'?()=>save(S):undefined}>
        <span>{syncState==='syncing'?'Syncing':syncState==='error'?'Error — tap to retry':'Live'}</span>
        <span className="live-version">{VERSION}</span>
      </div>
      <button className="reset-btn" onClick={()=>{if(confirm('Reset all tracking data?')){const fresh=freshDefaults();setS(fresh);save(fresh);}}}>Reset</button>
      <button className="tweaks-trigger" onClick={()=>setTweaksOpen(true)} title="Tweaks">✦</button>

      {modal&&<Modal id={modal} onClose={()=>setModal(null)} S={S}/>}
    </>
  );
}
