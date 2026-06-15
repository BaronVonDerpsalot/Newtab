import { useState, useRef } from 'react';
import { slpColor, moodColor, waterColor, exColor, sliderBg } from '../../lib/colors.js';

const DRINK_PRESETS = [
  { emoji: '☕', label: 'Coffee', l: 0.24 },
  { emoji: '🥤', label: 'Can',    l: 0.33 },
  { emoji: '🍺', label: 'Pint',   l: 0.57 },
];

const LONG_PRESS_MS = 600;

function fmtDrinks(l) {
  if (!l) return '—';
  return l < 1 ? `${Math.round(l * 1000)}ml` : `${l.toFixed(1)}L`;
}

/* ── Sliders card (numeric habits) ───────────────── */
export function SlidersCard({ values, onUpdate, onCommit }) {
  const [showCustom, setShowCustom]   = useState(false);
  const [pressingL, setPressingL]     = useState(null);
  const timerRef   = useRef(null);
  const didLongRef = useRef(false);

  const slp   = values.sleep_hours ?? 8;
  const mood  = values.mood ?? 3;
  const water = values.water ?? 0;
  const ex    = values.exercise_min ?? 0;

  function round2(v) { return Math.round(v * 100) / 100; }

  function startPress(p) {
    didLongRef.current = false;
    setPressingL(p.l);
    timerRef.current = setTimeout(() => {
      didLongRef.current = true;
      setPressingL(null);
      onCommit('water', Math.max(0, round2(water - p.l)));
    }, LONG_PRESS_MS);
  }

  function endPress(p) {
    clearTimeout(timerRef.current);
    setPressingL(null);
    if (!didLongRef.current) {
      onCommit('water', round2(water + p.l));
    }
    didLongRef.current = false;
  }

  function cancelPress() {
    clearTimeout(timerRef.current);
    setPressingL(null);
    didLongRef.current = false;
  }

  return (
    <div className="card cell-sliders">
      <div className="slider-row">
        <div className="slider-meta">
          <span className="slider-lbl">Hours slept&thinsp;</span>
          <span className="slider-val" style={{color:slpColor(slp)}}>{slp}</span>
          <span className="slider-unit">H</span>
        </div>
        <input type="range" min={0} max={14} step={.5} value={slp}
          style={{background:sliderBg(slp,0,14,slpColor(slp)),'--thumb-c':slpColor(slp)}}
          onChange={e=>onUpdate('sleep_hours',parseFloat(e.target.value))}
          onMouseUp={e=>onCommit('sleep_hours',parseFloat(e.target.value))}
          onTouchEnd={e=>onCommit('sleep_hours',parseFloat(e.target.value))} />
      </div>
      <div className="slider-row">
        <div className="slider-meta" style={{minWidth:72}}>
          <span className="slider-lbl">Mood&thinsp;</span>
          <span className="slider-val" style={{color:moodColor(mood)}}>{mood}</span>
          <span className="slider-unit">/ 5</span>
        </div>
        <div style={{display:'flex',gap:7,alignItems:'center',marginLeft:'auto'}}>
          {[1,2,3,4,5].map(n=>(
            <button key={n} className={`mood-dot ${n<=mood?'lit':''}`}
              style={n<=mood?{'--dot-c':moodColor(mood)}:{}}
              onClick={()=>onCommit('mood',n)} aria-label={`Mood ${n}`} />
          ))}
        </div>
      </div>
      <div className="slider-row">
        <div className="slider-meta">
          <span className="slider-lbl">Exercise&thinsp;</span>
          <span className="slider-val" style={{color:exColor(ex)}}>{ex>=60?'60+':ex}</span>
          <span className="slider-unit">MIN</span>
        </div>
        <input type="range" min={0} max={60} step={5} value={Math.min(ex,60)}
          style={{background:sliderBg(Math.min(ex,60),0,60,exColor(ex)),'--thumb-c':exColor(ex)}}
          onChange={e=>onUpdate('exercise_min',parseFloat(e.target.value))}
          onMouseUp={e=>onCommit('exercise_min',parseFloat(e.target.value))}
          onTouchEnd={e=>onCommit('exercise_min',parseFloat(e.target.value))} />
      </div>
      <div className="slider-row drinks-row">
        <div className="slider-meta">
          <span className="slider-lbl">Drinks&thinsp;</span>
          <span className="slider-val" style={{color:waterColor(water)}}>{fmtDrinks(water)}</span>
        </div>
        <div className="drink-btns">
          {DRINK_PRESETS.map(p => (
            <button key={p.l}
              className={`drink-btn${pressingL === p.l ? ' pressing' : ''}`}
              title={`Tap to add ${p.label} · Hold to remove`}
              style={{touchAction:'none'}}
              onPointerDown={() => startPress(p)}
              onPointerUp={() => endPress(p)}
              onPointerLeave={cancelPress}
              onPointerCancel={cancelPress}
              onContextMenu={e => e.preventDefault()}>
              {p.emoji} {p.label}
            </button>
          ))}
          <button className={`drink-btn drink-btn-custom${showCustom ? ' active' : ''}`}
            onClick={() => setShowCustom(s => !s)}>
            Custom
          </button>
        </div>
        {showCustom && (
          <input type="range" min={0} max={4} step={.1} value={water}
            className="drinks-custom-slider"
            style={{background:sliderBg(water,0,4,waterColor(water)),'--thumb-c':waterColor(water)}}
            onChange={e => onUpdate('water', parseFloat(e.target.value))}
            onMouseUp={e => onCommit('water', parseFloat(e.target.value))}
            onTouchEnd={e => onCommit('water', parseFloat(e.target.value))} />
        )}
      </div>
    </div>
  );
}
