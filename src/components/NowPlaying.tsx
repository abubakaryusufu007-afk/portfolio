import { useEffect, useState } from 'react'

interface Track {
  title: string
  artists: string
  url: string
  imageUrl?: string
}

type NowPlayingState =
  | { status: 'loading' | 'idle' | 'setup' | 'premium' | 'unavailable' }
  | { status: 'playing'; track: Track }

function NowPlaying() {
  const [state, setState] = useState<NowPlayingState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    let timeoutId: ReturnType<typeof setTimeout>

    const checkNowPlaying = async () => {
      try {
        const response = await fetch('/api/now-playing')

        if (response.status === 503) {
          const result = (await response.json()) as { error?: string }
          if (active) {
            setState({ status: result.error === 'premium_required' ? 'premium' : 'setup' })
          }
        } else if (!response.ok) {
          throw new Error('Now-playing request failed')
        } else {
          const result = (await response.json()) as {
            isPlaying?: boolean
            track?: Track
          }

          if (active) {
            setState(
              result.isPlaying && result.track
                ? { status: 'playing', track: result.track }
                : { status: 'idle' },
            )
          }
        }
      } catch {
        if (active) setState({ status: 'unavailable' })
      }

      if (active) timeoutId = setTimeout(checkNowPlaying, 30_000)
    }

    void checkNowPlaying()

    return () => {
      active = false
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <section
      id="now-playing"
      aria-labelledby="now-playing-title"
      className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-5 py-14 text-center sm:px-8 sm:py-20"
    >
      <h2
        id="now-playing-title"
        className="m-0 text-2xl font-bold tracking-tight text-foreground sm:text-4xl"
      >
        Now Playing
      </h2>
      <div className="w-full max-w-xl" aria-live="polite" aria-atomic="true">
        {state.status === 'loading' && (
          <p className="m-0 text-sm text-muted">Checking Spotify...</p>
        )}
        {state.status === 'idle' && (
          <p className="m-0 text-sm text-muted">Nothing playing right now.</p>
        )}
        {state.status === 'setup' && (
          <p className="m-0 text-sm text-muted">
            Spotify isn&apos;t connected yet.
          </p>
        )}
        {state.status === 'premium' && (
          <p className="m-0 text-sm text-muted">
            Spotify requires an active Premium subscription for the app owner.
          </p>
        )}
        {state.status === 'unavailable' && (
          <p className="m-0 text-sm text-muted">
            Spotify status is temporarily unavailable.
          </p>
        )}
        {state.status === 'playing' && (
          <a
            className="flex items-center gap-4 rounded-lg border border-border p-3 text-left no-underline transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none sm:gap-5 sm:p-4"
            href={state.track.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Now playing ${state.track.title} by ${state.track.artists} on Spotify`}
          >
            {state.track.imageUrl ? (
              <img
                className="size-16 shrink-0 rounded-md object-cover sm:size-20"
                src={state.track.imageUrl}
                alt=""
              />
            ) : (
              <div
                className="grid size-16 shrink-0 place-items-center rounded-md border border-border text-xs font-semibold text-muted sm:size-20"
                aria-hidden="true"
              >
                SPOTIFY
              </div>
            )}
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase text-accent">
                Listening on Spotify
              </span>
              <span className="mt-1 block truncate text-base font-semibold text-foreground sm:text-lg">
                {state.track.title}
              </span>
              <span className="mt-1 block truncate text-sm text-muted">
                {state.track.artists}
              </span>
            </span>
          </a>
        )}
      </div>
    </section>
  )
}

export default NowPlaying
