# Yusuf Abubakar Portfolio

## Development

Install dependencies and run the Vite site:

```sh
npm install
npm run dev
```

To run the Vercel API function locally as well, use the Vercel CLI:

```sh
npx vercel dev
```

The local API endpoint is `http://localhost:3000/api/listening`.

## Last.fm Listening section

The API function reads `LASTFM_API_KEY` and `LASTFM_USER` from the server
environment. For local Vercel development, put these in `.env.local`:

```text
LASTFM_API_KEY=your Last.fm API key
LASTFM_USER=yusuvamir
```

Never add a `VITE_` prefix to these variables or commit `.env.local`.

## Deploy to Vercel

Import this GitHub repository into Vercel. Vercel detects Vite automatically;
the build command should be `npm run build` and the output directory `dist`.

In the Vercel project, open **Settings → Environment Variables** and add
`LASTFM_API_KEY` and `LASTFM_USER` for the **Production** environment. Add them
to Preview or Development too if you want the function to work in those
environments. Redeploy after saving the variables.

The deployed endpoint is `/api/listening` on your Vercel site.

## Build

```sh
npm run build
```
