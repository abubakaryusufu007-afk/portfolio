import type { ExperienceItem } from '../data/portfolioData'

interface ExperienceEntryProps {
  item: ExperienceItem
}

function ExperienceEntry({ item }: ExperienceEntryProps) {
  return (
    <article className="experience-entry">
      <h3>
        <span>{item.role}</span>
        <span aria-hidden="true"> · </span>
        <span className="entry-organization">{item.organization}</span>
      </h3>
      <p>{item.description}</p>
    </article>
  )
}

export default ExperienceEntry
