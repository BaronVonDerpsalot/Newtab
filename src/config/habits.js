/* ── Habits config ────────────────────────────────── */
export const HABITS = [
  { key:'sunlight',     label:'Sunlight / time outside',              type:'bool' },
  { key:'hydration',    label:'Hydration',                            type:'bool' },
  { key:'ate',          label:'Ate something decent',                 type:'bool' },
  { key:'social',       label:'Spoke to someone',                     type:'bool' },
  { key:'creative',     label:'Did something creative or productive',  type:'bool' },
  { key:'no_doom',      label:'No doom scrolling before bed',         type:'bool' },
  { key:'sleep_hours',  label:'Hours slept', type:'slider', unit:'H',   min:0, max:14, step:.5, default:8,  ideal:8,  goodDir:'target' },
  { key:'mood',         label:'Mood',        type:'scale',  unit:'/ 5', min:1, max:5,  step:1,  default:3,  ideal:5,  goodDir:'high' },
  { key:'water',        label:'Water',       type:'slider', unit:'L',   min:0, max:4,  step:.1, default:0,  ideal:3,  goodDir:'target' },
  { key:'exercise_min', label:'Exercise',    type:'slider', unit:'MIN', min:0, max:60, step:5,  default:0,  ideal:60, goodDir:'high', maxLabel:'60+' },
];
export const BOOL_HABITS    = HABITS.filter(h => h.type === 'bool');
export const NUMERIC_HABITS = HABITS.filter(h => h.type !== 'bool');
export const HABIT_MAP      = Object.fromEntries(HABITS.map(h => [h.key, h]));
