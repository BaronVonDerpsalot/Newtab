# CLAUDE.md

Personal new-tab dashboard. **Vite + React 18**, synced to **Supabase**, deployed
to **GitHub Pages**. Single user, password-gated (verified server-side by the
`auth` edge function — no secrets in the client bundle). Was a single `index.html`
(CDN React + in-browser Babel); now a modular Vite project.

## Commands

```bash
npm install      # install deps
npm run dev      # dev server (localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Deploy

Not auto-deployed from feature branches. To go live: merge into
`claude/github-pages-deploy-dkotmb` (the Pages/default branch). That triggers
`.github/workflows/deploy.yml` → `npm ci && npm run build` → publishes `dist/`
via GitHub Actions. Hard-refresh to bypass cache.

## Where things live

```
index.html                     Vite entry: fonts + auth-overlay markup only
src/
  main.jsx                     Auth gate (cookie/password) + React boot
  App.jsx                      Root: layout, state wiring, ACCENT_MAP, TWEAK_DEFAULTS,
                               and the tweak→CSS-variable effects
  index.css                    ALL styles + design tokens (CSS custom props)
  config.js                    App constants (URLs, USER_ID, PASSWORD, VERSION),
                               overridable via VITE_* env vars (see .env.example)
  config/habits.js             HABITS definitions (+ BOOL_/NUMERIC_ derived lists)
  hooks/useTweaks.js           Persisted settings (localStorage 'nt_tweaks_v2')
  lib/
    supabase.js                createClient → `db`
    state.js                   Supabase read/write: fetchState, saveState,
                               fetchHistory, buildStats; date/window helpers
    time.js                    fmtTime, fmtDate, todayStr
    colors.js                  habit/slider color helpers, PALETTE
    suncalc.js                 sunrise/sunset → autoIsDark (auto theme)
    auth.js                    login() → auth fn; token stored in localStorage
  components/
    Ico.jsx                    shared SVG icon wrapper
    cards/                     dashboard cards, one file each (Clock, Stats,
                               Habits, Sliders, Prereqs, Actions, Upcoming,
                               Shortcuts, Todo, Gallery)
    modals/                    one file per modal + Modal.jsx shell/router
                               (Timer, Journal, Breathe, Resources, Chat,
                               Insights, Facts, System, History)
    tweaks/TweaksPanel.jsx     floating settings panel + all Tweak* controls
supabase/functions/            edge functions: auth (password→token),
                               chat, feedback, debrief (Claude-backed)
```

## Common change → file

- A habit (add/edit/reorder) → `src/config/habits.js`
- Slider/value colors → `src/lib/colors.js`
- Layout, grid cells, any styling → `src/index.css`
- A specific card or modal → the matching file in `cards/` or `modals/`
- A new modal → add the component in `modals/`, then register it in `Modal.jsx`
- Supabase schema/queries → `src/lib/state.js`
- App constants / secrets / endpoints → `src/config.js`
- Theme/accent/font behavior → the effects in `App.jsx`

## Conventions

- App config goes through `src/config.js` with `VITE_*` overrides + fallbacks;
  don't scatter literals across modules.
- Tweaks flow: `useTweaks` holds values → `App.jsx` effects push them to CSS
  custom properties → `index.css` consumes the variables.
- Releases: bump the version in **three** places together — `VERSION` in
  `src/config.js`, `version` in `package.json`, and `package-lock.json`
  (run `npm install` to sync the lockfile). The version shows in the
  bottom-right live indicator.
- Cross-device state lives in Supabase (`tab_state`, `daily_log` for user
  `mike`); device-local bits (journal, todos, tweaks) live in `localStorage`.
