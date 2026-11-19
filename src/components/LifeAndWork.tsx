import codingPhoto from '../assets/life-work-coding.jpg'
import audiomackPhoto from '../assets/life-work-audiomack.jpg'
import posterPhoto from '../assets/life-work-poster.jpg'
import stairsPhoto from '../assets/life-work-stairs.jpg'
import streetPhoto from '../assets/life-work-street.jpg'
import './life-and-work.css'

const photos = [
  { src: posterPhoto, alt: 'A motivational poster on a wall', wide: false },
  {
    src: streetPhoto,
    alt: 'A street-side food stand on a sunny day',
    wide: false,
  },
  { src: stairsPhoto, alt: 'A staircase inside a building', wide: false },
  { src: codingPhoto, alt: 'A laptop displaying code on a desk', wide: false },
  {
    src: audiomackPhoto,
    alt: 'Audiomack music player and recommendations',
    wide: true,
  },
]

function LifeAndWork() {
  return (
    <section
      id="life-and-work"
      aria-labelledby="life-and-work-title"
      className="life-and-work-section"
    >
      <h2 id="life-and-work-title" className="section-title">
        LIFE &amp; WORK
      </h2>
      <div className="life-and-work-grid">
        {photos.map((photo) => (
          <figure
            className={`life-and-work-photo${photo.wide ? ' life-and-work-photo--wide' : ''}`}
            key={photo.src}
          >
            <a
              className="life-and-work-photo-link"
              href={photo.src}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open photo: ${photo.alt}`}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </a>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default LifeAndWork
