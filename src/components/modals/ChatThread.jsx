import { useState, useEffect, useRef } from 'react';
import { CHAT_URL, SUPABASE_ANON_KEY } from '../../config.js';
import { getToken } from '../../lib/auth.js';

/* ── Reusable chat thread ─────────────────────────────
 * Multi-turn conversation backed by the `chat` edge function
 * ({ system, messages } → { reply }). Used by the crisis chat, the stats
 * coach (Insights) and the daily debrief (Today's Read) — each just passes a
 * different `system` prompt.
 *
 * Props:
 *   system   — the system prompt (string). Render only once this is ready.
 *   seed     — optional first user turn, sent automatically on mount to make
 *              the assistant open the conversation. Not shown in the transcript.
 *   placeholder, thinkingLabel — input/typing copy.
 */
export function ChatThread({ system, seed, placeholder = 'Type a message…', thinkingLabel }) {
  const [messages, setMessages] = useState([]); // { role, content }
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const seededRef = useRef(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  async function exchange(apiMessages) {
    setTyping(true);
    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'x-app-token': getToken(),
        },
        body: JSON.stringify({ system, messages: apiMessages }),
      });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: (data.reply || '').trim() || 'No response.' }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Something went wrong. Check your connection and try again.' }]);
    } finally {
      setTyping(false);
    }
  }

  /* Auto-open with the seed turn (hidden from the transcript). */
  useEffect(() => {
    if (!seed || seededRef.current) return;
    seededRef.current = true;
    exchange([{ role: 'user', content: seed }]);
  }, [seed]);

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput('');
    const visible = [...messages, { role: 'user', content: text }];
    setMessages(visible);
    // The seed turn primes the assistant but isn't kept in `messages`; replay it
    // at the head so the API still sees a valid user-first thread.
    const apiMessages = seed
      ? [{ role: 'user', content: seed }, ...visible]
      : visible;
    await exchange(apiMessages);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '54vh', minHeight: 320 }}>
      <div className="chat-messages" style={{ flex: 1 }}>
        {messages.map((m, i) => <div key={i} className={`chat-msg ${m.role}`}>{m.content}</div>)}
        {typing && (
          thinkingLabel
            ? <div className="chat-msg assistant" style={{ opacity: 0.6 }}>{thinkingLabel}</div>
            : <div className="chat-typing"><span /><span /><span /></div>
        )}
        <div ref={endRef} />
      </div>
      <div className="chat-input-area">
        <textarea className="chat-input" rows={1} value={input} placeholder={placeholder}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }} />
        <button className="chat-send" disabled={typing} onClick={send}>↑</button>
      </div>
    </div>
  );
}
