import type { AwardItem } from '../data/portfolioData'

interface AwardEntryProps {
  item: AwardItem
}

function AwardEntry({ item }: AwardEntryProps) {
  return (
    <article className="award-card">
      <span className="award-type">{item.type}</span>
      <h3>{item.title}</h3>
      <p>{item.issuer}</p>
      <span className="award-year">{item.year}</span>
    </article>
  )
}

export default AwardEntry
