import { createHash, randomBytes } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'

const clientId = process.env.SPOTIFY_CLIENT_ID
const redirectUri = 'http://127.0.0.1:8888/callback'
const scopes = 'user-read-currently-playing user-read-playback-state'

if (!clientId) {
  console.error('Set SPOTIFY_CLIENT_ID in .env.local before running this command.')
  process.exitCode = 1
} else {
  const verifier = randomBytes(32).toString('base64url')
  const challenge = createHash('sha256').update(verifier).digest('base64url')
  const state = randomBytes(16).toString('hex')
  const authorizeUrl = new URL('https://accounts.spotify.com/authorize')

  authorizeUrl.search = new URLSearchParams({
    client_id: clientId,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    show_dialog: 'true',
    state,
  }).toString()

  const server = createServer(async (request, response) => {
    const callbackUrl = new URL(request.url ?? '/', redirectUri)

    if (callbackUrl.pathname !== '/callback') {
      response.writeHead(404).end('Not found')
      return
    }

    if (callbackUrl.searchParams.get('state') !== state) {
      response.writeHead(400).end('Authorization state did not match. You can close this tab.')
      server.close()
      return
    }

    const code = callbackUrl.searchParams.get('code')
    if (!code) {
      response.writeHead(400).end('Spotify authorization was not completed. You can close this tab.')
      server.close()
      return
    }

    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          code,
          code_verifier: verifier,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      })
      const tokenData = await tokenResponse.json()

      if (!tokenResponse.ok || typeof tokenData.refresh_token !== 'string') {
        throw new Error('Spotify did not return a refresh token.')
      }

      const envPath = '.env.local'
      const envContents = await readFile(envPath, 'utf8').catch((error) => {
        if (error.code === 'ENOENT') return ''
        throw error
      })
      const refreshTokenLine = `SPOTIFY_REFRESH_TOKEN=${tokenData.refresh_token}`
      const updatedEnvContents = /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(envContents)
        ? envContents.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, refreshTokenLine)
        : `${envContents.trimEnd()}\n${refreshTokenLine}\n`

      await writeFile(envPath, updatedEnvContents)

      response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Spotify connected. You can close this tab and return to the terminal.')
      console.log('\nSpotify connected. Refresh token saved in .env.local.\n')
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Could not complete Spotify authorization. Check the terminal output.')
      console.error(error instanceof Error ? error.message : 'Spotify authorization failed.')
      process.exitCode = 1
    } finally {
      server.close()
    }
  })

  server.listen(8888, '127.0.0.1', () => {
    console.log('Open this URL in your browser to authorize Spotify:\n')
    console.log(`${authorizeUrl}\n`)
    console.log('Waiting for Spotify authorization on http://127.0.0.1:8888/callback ...')
  })
}