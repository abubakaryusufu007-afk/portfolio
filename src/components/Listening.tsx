import { useEffect, useState } from 'react'
import LastPlayed from './LastPlayed'
import RecentlyPlayed from './RecentlyPlayed'
import type { ListeningData } from '../data/portfolioData'
import './listening.css'

type ListeningState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: ListeningData }

function Listening() {
  const [state, setState] = useState<ListeningState>({ status: 'loading' })

  useEffect(() => {
    let active = true

    async function loadListening() {
      try {
        const response = await fetch('/api/listening')
        if (!response.ok) throw new Error('Listening request failed')
        const contentType = response.headers.get('content-type')
        if (!contentType?.includes('application/json')) {
          throw new Error('Listening response is not JSON')
        }

        const data = (await response.json()) as ListeningData
        if (active) setState({ status: 'ready', data })
      } catch {
        if (active) setState({ status: 'error' })
      }
    }

    void loadListening()
    return () => {
      active = false
    }
  }, [])

  return (
    <section
      id="listening"
      aria-labelledby="listening-title"
      className="listening-section content-section"
    >
      <div className="listening-content">
        <div className="listening-heading">
          <h2 id="listening-title">LISTENING</h2>
          <span>
            {state.status === 'ready' && state.data.nowPlaying
              ? 'Now playing'
              : 'Last played'}
          </span>
        </div>
        {state.status === 'loading' && (
          <p className="listening-message" aria-live="polite">
            Loading listening data...
          </p>
        )}
        {state.status === 'error' && (
          <p className="listening-message" role="status">
            Listening data is temporarily unavailable. Please try again later.
          </p>
        )}
        {state.status === 'ready' && (
          <>
            <LastPlayed track={state.data.lastPlayed} />
            <RecentlyPlayed tracks={state.data.recentlyPlayed} />
          </>
        )}
      </div>
    </section>
  )
}

export default Listening
