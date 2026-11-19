import type { IncomingMessage, ServerResponse } from 'node:http'

interface LastFmTrack {
  name?: string
  artist?: string | { name?: string; '#text'?: string }
  url?: string
  image?: Array<{ '#text'?: string; size?: string }>
  '@attr'?: { nowplaying?: string }
}

interface LastFmResponse {
  error?: number
  recenttracks?: { track?: LastFmTrack | LastFmTrack[] }
}

interface Track {
  title: string
  artist: string
  cover: string | null
  url: string
}

interface ListeningResponse {
  lastPlayed: Track
  nowPlaying: boolean
  recentlyPlayed: Track[]
}

const endpoint = 'https://ws.audioscrobbler.com/2.0/'
const cacheDuration = 60_000
const cacheHeader = 'public, s-maxage=60, stale-while-revalidate=30'
const placeholderCoverIds = [
  '2a96cbd8b46e442fc41c2b86b821562f',
  '4128a6eb29f94943c9d206c08e625904',
]

let cachedResult: { data: ListeningResponse; expiresAt: number } | undefined

function sendJson(
  response: ServerResponse,
  statusCode: number,
  body: object,
  cacheControl = 'no-store',
) {
  response.writeHead(statusCode, {
    'Cache-Control': cacheControl,
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(body))
}

async function fetchLastFm(
  apiKey: string,
  user: string,
) {
  const params = new URLSearchParams({
    method: 'user.getRecentTracks',
    user,
    api_key: apiKey,
    format: 'json',
    limit: '7',
  })
  const response = await fetch(`${endpoint}?${params}`, {
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    throw new Error('Last.fm request failed')
  }

  const data = (await response.json()) as LastFmResponse
  if (data.error) {
    throw new Error('Last.fm returned an API error')
  }

  return data
}

function toTrackList(value: LastFmTrack | LastFmTrack[] | undefined) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function getArtistName(artist: LastFmTrack['artist']) {
  if (typeof artist === 'string') return artist.trim()
  return artist?.name?.trim() || artist?.['#text']?.trim() || ''
}

function getCover(images: LastFmTrack['image']): string | null {
  for (const image of [...(images ?? [])].reverse()) {
    const url = image['#text']?.trim()
    if (
      url &&
      !placeholderCoverIds.some((placeholderId) => url.includes(placeholderId))
    ) {
      return url
    }
  }
  return null
}

function toTrack(track: LastFmTrack): Track | null {
  const title = track.name?.trim()
  const artist = getArtistName(track.artist)
  const url = track.url?.trim()

  if (!title || !artist || !url) return null

  return {
    title,
    artist,
    cover: getCover(track.image),
    url,
  }
}

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    sendJson(response, 405, { error: 'Only GET requests are supported.' })
    return
  }

  const apiKey = process.env.LASTFM_API_KEY
  const user = process.env.LASTFM_USER

  if (!apiKey || !user) {
    sendJson(response, 503, {
      error: 'Listening data is not configured yet.',
    })
    return
  }

  if (cachedResult && cachedResult.expiresAt > Date.now()) {
    sendJson(response, 200, cachedResult.data, cacheHeader)
    return
  }

  try {
    const recentTracks = toTrackList(
      (await fetchLastFm(apiKey, user)).recenttracks?.track,
    )
    const recentTrack = recentTracks[0]
    const lastPlayed = recentTrack ? toTrack(recentTrack) : null

    if (!recentTrack || !lastPlayed) {
      sendJson(response, 404, {
        error: 'No recent listening data was found for this Last.fm account.',
      })
      return
    }

    const recentlyPlayed = recentTracks
      .slice(1)
      .map(toTrack)
      .filter((track): track is Track => track !== null)

    const result: ListeningResponse = {
      lastPlayed,
      nowPlaying: recentTrack['@attr']?.nowplaying === 'true',
      recentlyPlayed,
    }

    cachedResult = { data: result, expiresAt: Date.now() + cacheDuration }
    sendJson(response, 200, result, cacheHeader)
  } catch {
    sendJson(response, 502, {
      error: 'Last.fm is temporarily unavailable. Please try again later.',
    })
  }
}
