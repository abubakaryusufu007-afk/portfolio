import type { Track } from '../data/portfolioData'
import TrackRow from './TrackRow'

interface RecentlyPlayedProps {
  tracks: Track[]
}

function RecentlyPlayed({ tracks }: RecentlyPlayedProps) {
  return (
    <div className="listening-recently-played">
      <h3 className="listening-recently-played-title">Recently played</h3>
      {tracks.length > 0 ? (
        <div className="listening-track-grid">
          {tracks.map((track) => (
            <TrackRow key={`${track.title}-${track.artist}`} track={track} />
          ))}
        </div>
      ) : (
        <p className="listening-message">No other recent tracks found.</p>
      )}
    </div>
  )
}

export default RecentlyPlayed
