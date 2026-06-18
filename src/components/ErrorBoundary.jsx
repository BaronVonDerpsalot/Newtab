import { Component } from 'react';

/* ── Error boundary ───────────────────────────────────
 * Catches render errors so a crash shows a recovery screen instead of a blank
 * page. State lives in Supabase (+ local cache), so a reload recovers cleanly. */
export class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('Dashboard crashed:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="crash-screen">
          <div className="crash-box">
            <div className="crash-title">Something broke.</div>
            <p>The dashboard hit an error. Your data is safe — it lives in the cloud.</p>
            <button className="action-btn" onClick={() => location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
