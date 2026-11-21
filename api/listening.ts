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
  lovedtracks?: { track?: LastFmTrack | LastFmTrack[] }
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
  statusCode: number,
  body: object,
  cacheControl = 'no-store',
) {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: {
      'Cache-Control': cacheControl,
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}

async function fetchLastFm(
  apiKey: string,
  user: string,
  method: 'user.getRecentTracks' | 'user.getLovedTracks',
  limit: number,
) {
  const params = new URLSearchParams({
    method,
    user,
    api_key: apiKey,
    format: 'json',
    limit: String(limit),
  })
  let response: Response
  try {
    response = await fetch(`${endpoint}?${params}`, {
      signal: AbortSignal.timeout(10_000),
    })
  } catch (error) {
    const reason =
      error instanceof Error && error.name === 'TimeoutError'
        ? 'timed out'
        : 'network error'
    throw new Error(`${method}: ${reason}`)
  }

  if (!response.ok) {
    throw new Error(`${method}: HTTP ${response.status}`)
  }

  let data: LastFmResponse
  try {
    data = (await response.json()) as LastFmResponse
  } catch {
    throw new Error(`${method}: invalid JSON response`)
  }

  if (data.error) {
    throw new Error(`${method}: API error ${data.error}`)
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

async function handler(request: Request) {
  if (request.method !== 'GET') {
    return sendJson(
      405,
      { error: 'Only GET requests are supported.' },
    )
  }

  const apiKey = process.env.LASTFM_API_KEY
  const user = process.env.LASTFM_USER
  console.log(
    'LASTFM_API_KEY set:',
    Boolean(apiKey),
    '| LASTFM_USER set:',
    Boolean(user),
  )
  if (!apiKey || !user) {
    return sendJson(503, {
      error: 'Listening data is not configured yet.',
    })
  }

  if (cachedResult && cachedResult.expiresAt > Date.now()) {
    return sendJson(200, cachedResult.data, cacheHeader)
  }

  try {
    const [recentData, lovedData] = await Promise.all([
      fetchLastFm(apiKey, user, 'user.getRecentTracks', 1),
      fetchLastFm(apiKey, user, 'user.getLovedTracks', 6),
    ])
    const recentTrack = toTrackList(recentData.recenttracks?.track)[0]
    const lastPlayed = recentTrack ? toTrack(recentTrack) : null

    if (!recentTrack || !lastPlayed) {
      return sendJson(404, {
        error: 'No recent listening data was found for this Last.fm account.',
      })
    }

    const recentlyPlayed = toTrackList(lovedData.lovedtracks?.track)
      .map(toTrack)
      .filter((track): track is Track => track !== null)

    const result: ListeningResponse = {
      lastPlayed,
      nowPlaying: recentTrack['@attr']?.nowplaying === 'true',
      recentlyPlayed,
    }

    cachedResult = { data: result, expiresAt: Date.now() + cacheDuration }
    return sendJson(200, result, cacheHeader)
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : 'Unknown Last.fm error'
    console.error('Listening request failed:', reason)
    return sendJson(502, {
      error: 'Last.fm is temporarily unavailable. Please try again later.',
      diagnostic: reason,
    })
  }
}

export default { fetch: handler }
