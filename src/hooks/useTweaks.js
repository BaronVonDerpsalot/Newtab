import { useState, useCallback } from 'react';

export function useTweaks(defaults) {
  const [values, setValues] = useState(() => {
    try {
      const s = localStorage.getItem('nt_tweaks_v2');
      return s ? { ...defaults, ...JSON.parse(s) } : defaults;
    } catch { return defaults; }
  });
  const setTweak = useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues(prev => {
      const next = { ...prev, ...edits };
      try { localStorage.setItem('nt_tweaks_v2', JSON.stringify(next)); } catch {}
      return next;
    });
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}
