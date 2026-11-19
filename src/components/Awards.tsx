import type { AwardItem } from '../data/portfolioData'
import AwardEntry from './AwardEntry'

interface AwardsProps {
  items: AwardItem[]
}

function Awards({ items }: AwardsProps) {
  return (
    <section
      className="content-section"
      id="awards"
      aria-labelledby="awards-title"
    >
      <h2 className="section-title" id="awards-title">
        AWARDS
      </h2>
      <p className="sample-note">
        Sample entries — replace these with awards you have earned before
        publishing.
      </p>
      <div className="awards-grid">
        {items.map((item) => (
          <AwardEntry key={`${item.type}-${item.title}`} item={item} />
        ))}
      </div>
    </section>
  )
}

export default Awards
