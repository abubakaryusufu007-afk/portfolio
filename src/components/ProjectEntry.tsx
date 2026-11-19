import type { ProjectItem } from '../data/portfolioData'

interface ProjectEntryProps {
  item: ProjectItem
}

function ProjectEntry({ item }: ProjectEntryProps) {
  return (
    <article className="project-entry">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      {item.technologies && item.technologies.length > 0 && (
        <ul className="stack-list project-technologies">
          {item.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      )}
      {item.links && item.links.length > 0 && (
        <ul className="project-links">
          {item.links.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default ProjectEntry
