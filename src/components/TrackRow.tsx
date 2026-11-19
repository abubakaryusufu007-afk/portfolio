import type { Track } from '../data/portfolioData'

interface TrackRowProps {
  track: Track
}

function TrackRow({ track }: TrackRowProps) {
  return (
    <a
      className="listening-track-row"
      href={track.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Listen to ${track.title} by ${track.artist}`}
    >
      {track.cover ? (
        <img className="listening-row-cover" src={track.cover} alt="" />
      ) : (
        <span
          className="listening-cover-fallback listening-row-cover"
          aria-hidden="true"
        />
      )}
      <span className="listening-track-copy">
        <span className="listening-track-title">{track.title}</span>
        <span className="listening-track-artist">{track.artist}</span>
      </span>
    </a>
  )
}

export default TrackRow
