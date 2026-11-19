# Yusuf Abubakar Portfolio

## Development

Install dependencies and start the site with Netlify Functions:

```sh
npm install
npm install --save-dev netlify-cli
npm run dev:netlify
```

## Last.fm Listening section

Copy `.env.example` to `.env.local` and set:

```text
LASTFM_API_KEY=your Last.fm API key
LASTFM_USER=yusuvamir
```

Do not prefix these values with `VITE_`, and never commit `.env.local`.
Restart `netlify dev` after changing environment variables. Open
`http://localhost:8888/api/listening` to check the JSON response.

For Netlify deployment, add `LASTFM_API_KEY` and `LASTFM_USER` under
**Site configuration -> Environment variables**. Make both variables available
to Functions, then redeploy the site.

## Build

```sh
npm run build
```
