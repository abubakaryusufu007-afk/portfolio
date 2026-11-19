import type { ExperienceItem } from '../data/portfolioData'
import ExperienceEntry from './ExperienceEntry'

interface ExperienceProps {
  items: ExperienceItem[]
}

function Experience({ items }: ExperienceProps) {
  return (
    <section
      className="content-section"
      id="experience"
      aria-labelledby="experience-title"
    >
      <h2 className="section-title" id="experience-title">
        EXPERIENCE
      </h2>
      <div className="experience-list">
        {items.map((item) => (
          <ExperienceEntry
            key={`${item.role}-${item.organization}`}
            item={item}
          />
        ))}
      </div>
    </section>
  )
}

export default Experience
