import { useState, useEffect, useMemo } from 'react';
import { HABITS, BOOL_HABITS, NUMERIC_HABITS } from '../../config/habits.js';
import { fetchHistory, saveHistoryRow } from '../../lib/state.js';

function fmtDateLabel(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function EditDaySection({ rows, onSaved }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dates = useMemo(() => {
    const result = [];
    for (let i = 1; i <= 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push(d.toISOString().slice(0, 10));
    }
    return result;
  }, []);

  function handleDateChange(date) {
    setSelectedDate(date);
    setSaved(false);
    const row = rows.find(r => r.log_date === date);
    const vals = {};
    for (const h of HABITS) {
      vals[h.key] = row?.values?.[h.key] ?? (h.type === 'bool' ? false : (h.default ?? 0));
    }
    setValues(vals);
  }

  async function handleSave() {
    if (!selectedDate) return;
    setSaving(true);
    const ok = await saveHistoryRow(selectedDate, values);
    setSaving(false);
    if (ok) { setSaved(true); onSaved(); }
  }

  return (
    <div className="hist-edit-section">
      <button className="hist-edit-toggle" onClick={() => setOpen(o => !o)}>
        Edit a past day <span className="hist-edit-caret">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="hist-edit-form">
          <select
            className="hist-edit-select"
            value={selectedDate}
            onChange={e => handleDateChange(e.target.value)}
          >
            <option value="">— select date —</option>
            {dates.map(d => {
              const hasData = rows.some(r => r.log_date === d);
              return <option key={d} value={d}>{fmtDateLabel(d)}{!hasData ? ' (no entry)' : ''}</option>;
            })}
          </select>

          {selectedDate && (<>
            <div className="hist-edit-fields">
              {BOOL_HABITS.map(h => (
                <div key={h.key} className="hist-edit-row">
                  <span className="hist-edit-lbl">{h.label}</span>
                  <button
                    className={`hist-edit-bool${values[h.key] ? ' on' : ''}`}
                    onClick={() => { setSaved(false); setValues(v => ({ ...v, [h.key]: !v[h.key] })); }}
                  >
                    {values[h.key] ? 'Yes' : 'No'}
                  </button>
                </div>
              ))}
              {NUMERIC_HABITS.map(h => (
                <div key={h.key} className="hist-edit-row">
                  <span className="hist-edit-lbl">{h.label}</span>
                  <div className="hist-edit-num-wrap">
                    <input
                      type="number"
                      className="hist-edit-num"
                      min={h.min} max={h.max} step={h.step}
                      value={values[h.key] ?? h.default ?? 0}
                      onChange={e => { setSaved(false); setValues(v => ({ ...v, [h.key]: Number(e.target.value) })); }}
                    />
                    <span className="hist-edit-unit">{h.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="hist-edit-actions">
              <button className="hist-edit-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
              </button>
            </div>
          </>)}
        </div>
      )}
    </div>
  );
}

/* ── History modal (real Supabase data) ───────────── */
export function HistoryModal() {
  const [rows, setRows] = useState(null);
  const reload = () => fetchHistory(30).then(setRows);
  useEffect(() => { reload(); }, []);

  if (!rows) return <div><div className="modal-title">History</div><div className="hist-empty">Loading…</div></div>;
  if (!rows.length) return (
    <div>
      <div className="modal-title">History</div>
      <div className="hist-empty">No history yet.<br />Track a few days and trends will show up here.</div>
      <EditDaySection rows={[]} onSaved={reload} />
    </div>
  );

  const asc = [...rows].reverse(), last14 = asc.slice(-14);
  const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  function NumericBlock({ label, vals, maxV, unit, stat }) {
    const bars = vals.map((v, i) => {
      if (v == null) return <div key={i} className="hist-bar empty" style={{ height: '6%' }}></div>;
      const pct = maxV > 0 ? Math.max(6, (v / maxV) * 100) : 6;
      return <div key={i} className="hist-bar" style={{ height: pct + '%' }}></div>;
    });
    return (
      <div className="hist-row">
        <div className="hist-head"><span className="hist-label">{label}</span><span className="hist-stat">{stat || ''}</span></div>
        <div className="hist-strip">{bars}</div>
      </div>
    );
  }

  const maxSessions = Math.max(1, ...asc.map(r => r.sessions_today || 0));
  return (
    <div>
      <div className="modal-eyebrow">Last 30 days</div>
      <div className="modal-title">History</div>
      <div className="mc">
        <NumericBlock label="Sessions avoided" vals={asc.map(r => r.sessions_today || 0)} maxV={maxSessions} stat={`${asc.reduce((a, r) => a + (r.sessions_today || 0), 0)} total`} />
        {HABITS.map(h => {
          if (h.type === 'bool') {
            const pct = Math.round((rows.filter(r => r.values && r.values[h.key] === true).length / rows.length) * 100);
            const strip = last14.map((r, i) => <div key={i} className={`hist-cell ${r.values && r.values[h.key] === true ? 'on' : ''}`} style={{ height: '100%' }}></div>);
            return (
              <div key={h.key} className="hist-row">
                <div className="hist-head"><span className="hist-label">{h.label}</span><span className="hist-stat">{pct}% · {rows.filter(r => r.values && r.values[h.key] === true).length}/{rows.length} days</span></div>
                <div className="hist-strip">{strip}</div>
              </div>
            );
          } else {
            const vals = rows.map(r => r.values && r.values[h.key] != null ? Number(r.values[h.key]) : null);
            const present = vals.filter(v => v != null); if (!present.length) return null;
            const a7 = avg(rows.slice(0, 7).map(r => r.values && r.values[h.key] != null ? Number(r.values[h.key]) : null).filter(v => v != null));
            const a30 = avg(present);
            return <NumericBlock key={h.key} label={h.label} vals={asc.map(r => r.values && r.values[h.key] != null ? Number(r.values[h.key]) : null)} maxV={Math.max(...present)} stat={`7d ${Math.round(a7 * 10) / 10}${h.unit || ''} · 30d ${Math.round(a30 * 10) / 10}${h.unit || ''}`} />;
          }
        })}
      </div>
      <EditDaySection rows={rows} onSaved={reload} />
    </div>
  );
}
