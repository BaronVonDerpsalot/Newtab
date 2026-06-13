/* ── Color helpers ────────────────────────────────── */
export const PALETTE = ['#99C64C','#B6B92E','#CCAB1E','#DD9D1E','#ED8C1D','#FC6E5D','#FC617D','#FF499E'];
export const clamp01 = x => Math.max(0, Math.min(1, x));

export function habitGoodness(h, v) {
  if (v == null || isNaN(v)) return null;
  if (h.goodDir === 'high') return clamp01((v - h.min) / ((h.max - h.min) || 1));
  if (v <= h.ideal) return clamp01((v - h.min) / ((h.ideal - h.min) || 1));
  return clamp01((h.max - v) / ((h.max - h.ideal) || 1));
}
export function goodnessColor(g) {
  if (g == null) return null;
  return PALETTE[Math.max(0, Math.min(PALETTE.length - 1, Math.round((1 - g) * (PALETTE.length - 1))))];
}
export function slpColor(v)   { return v < 5 ? '#d94040' : v < 7 ? '#c88800' : '#5a9e2f'; }
export function waterColor(v) { return v < .8 ? '#d94040' : v < 1.5 ? '#c88800' : '#5a9e2f'; }
export function exColor(v)    { return v < 15 ? '#d94040' : v < 30 ? '#c88800' : '#5a9e2f'; }
export function moodColor(v)  { return v <= 2 ? '#d94040' : v <= 3 ? '#c88800' : '#5a9e2f'; }
export function sliderBg(value, min, max, color) {
  const pct = ((value - min) / (max - min)) * 100;
  return `linear-gradient(to right, ${color} ${pct}%, rgba(128,120,112,.22) ${pct}%)`;
}
export function fmtHabitVal(h, v) {
  if (h.maxLabel && v >= h.max) return h.maxLabel;
  return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
}
