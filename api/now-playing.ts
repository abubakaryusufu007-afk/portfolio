import type { IncomingMessage, ServerResponse } from 'node:http'

interface SpotifyTrackResponse {
  is_playing?: boolean
  item?: {
    name: string
    type: string
    external_urls?: { spotify?: string }
    album?: { images: Array<{ url: string }> }
    artists?: Array<{ name: string }>
  } | null
}

let cachedAccessToken: string | undefined
let tokenExpiresAt = 0

function sendJson(
  response: ServerResponse,
  statusCode: number,
  body: Record<string, unknown>,
) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(body))
}

async function getAccessToken(clientId: string, refreshToken: string) {
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedAccessToken
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) throw new Error('Spotify token refresh failed')

  const data = (await response.json()) as {
    access_token?: string
    expires_in?: number
  }

  if (!data.access_token) throw new Error('Spotify returned no access token')

  cachedAccessToken = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000
  return cachedAccessToken
}

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  if (request.method !== 'GET') {
    sendJson(response, 405, { error: 'method_not_allowed' })
    return
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !refreshToken) {
    sendJson(response, 503, { error: 'not_configured' })
    return
  }

  try {
    const accessToken = await getAccessToken(clientId, refreshToken)
    const spotifyResponse = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing?additional_types=track',
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )

    if (spotifyResponse.status === 403) {
      sendJson(response, 503, { error: 'premium_required' })
      return
    }

    if (spotifyResponse.status === 204) {
      sendJson(response, 200, { isPlaying: false })
      return
    }

    if (!spotifyResponse.ok) throw new Error('Spotify playback request failed')

    const playback = (await spotifyResponse.json()) as SpotifyTrackResponse
    const track = playback.item

    if (!playback.is_playing || !track || track.type !== 'track') {
      sendJson(response, 200, { isPlaying: false })
      return
    }

    sendJson(response, 200, {
      isPlaying: true,
      track: {
        title: track.name,
        artists: track.artists?.map((artist) => artist.name).join(', ') ?? '',
        url: track.external_urls?.spotify ?? 'https://open.spotify.com/',
        imageUrl: track.album?.images[0]?.url,
      },
    })
  } catch {
    sendJson(response, 502, { error: 'spotify_unavailable' })
  }
}