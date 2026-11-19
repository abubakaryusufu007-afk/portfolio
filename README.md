# Yusuf Abubakar Portfolio

## Development

```sh
npm install
npm run dev
```

## Last.fm Listening section

The local API reads `LASTFM_API_KEY` and `LASTFM_USER` from the server
environment. Add both to your existing `.env.local` file (or copy
`.env.example` to `.env.local` if you do not have one). Do not use a `VITE_`
prefix for these values.

```text
LASTFM_API_KEY=your Last.fm API key
LASTFM_USER=yusuvamir
```

Restart the development server after changing environment variables. With
`npm run dev` running, open
`http://localhost:5173/api/listening` in your browser to check the JSON route.
The Listening section on the portfolio uses this same route.

Create a Spotify app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and add this exact Redirect URI to its settings:

```text
http://127.0.0.1:8888/callback
```

Copy `.env.example` to `.env.local` and set `SPOTIFY_CLIENT_ID`. Then run:

```sh
npm run spotify:auth
```

Open the authorization URL printed in the terminal. Copy the resulting `SPOTIFY_REFRESH_TOKEN` line into `.env.local`, then restart the dev server. The refresh token stays on the server and is never sent to the browser.

For Vercel, add `SPOTIFY_CLIENT_ID`, `SPOTIFY_REFRESH_TOKEN`, `LASTFM_API_KEY`,
and `LASTFM_USER` in **Project Settings → Environment Variables**, then
redeploy. Do not prefix secrets or usernames with `VITE_`.

## Build

```sh
npm run build
```
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
