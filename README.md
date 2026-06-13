# Newtab

A personal new-tab dashboard built with **React** and **Vite**. Previously a
single `index.html` using CDN React + in-browser Babel; now a proper Vite
project with ES modules and npm dependencies.

## Development

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## Configuration

App constants live in `src/config.js` and can be overridden at build time via
`VITE_*` environment variables — see `.env.example`. If unset, the original
defaults are used so the app runs without extra setup.

## Project structure

```
index.html                  Vite entry (fonts + auth overlay markup)
src/
  main.jsx                  Entry: auth gate + React boot
  App.jsx                   Root component, layout, tweak wiring
  index.css                 Global styles / design tokens
  config.js                 App constants (env-overridable)
  config/habits.js          Habit definitions
  hooks/useTweaks.js        Persisted settings hook
  lib/                      supabase client, state sync, time/color/sun/auth helpers
  components/
    Ico.jsx                 Shared SVG icon
    cards/                  Dashboard cards
    modals/                 Modal dialogs (timer, journal, chat, history, …)
    tweaks/                 Tweaks panel + controls
supabase/functions/         Edge functions (chat, feedback)
```

## Deployment

Pushing to the configured branch triggers `.github/workflows/deploy.yml`, which
runs `npm ci && npm run build` and publishes `dist/` to GitHub Pages.
