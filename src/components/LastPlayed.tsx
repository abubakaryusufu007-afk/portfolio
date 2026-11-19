import type { Track } from '../data/portfolioData'

interface LastPlayedProps {
  track: Track
}

function LastPlayed({ track }: LastPlayedProps) {
  return (
    <a
      className="listening-last-played"
      href={track.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Listen to ${track.title} by ${track.artist}`}
    >
      {track.cover ? (
        <img className="listening-last-cover" src={track.cover} alt="" />
      ) : (
        <span
          className="listening-cover-fallback listening-last-cover"
          aria-hidden="true"
        />
      )}
      <span className="listening-track-copy">
        <span className="listening-track-title">{track.title}</span>
        <span className="listening-track-artist">{track.artist}</span>
      </span>
      <svg
        className="listening-arrow"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path d="M5 15 15 5M6 5h9v9" />
      </svg>
    </a>
  )
}

export default LastPlayed
