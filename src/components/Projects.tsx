import type { ProjectItem } from '../data/portfolioData'
import ProjectEntry from './ProjectEntry'

interface ProjectsProps {
  items: ProjectItem[]
}

function Projects({ items }: ProjectsProps) {
  return (
    <section
      className="content-section"
      id="projects"
      aria-labelledby="projects-title"
    >
      <h2 className="section-title" id="projects-title">
        PROJECTS
      </h2>
      <div className="projects-grid">
        {items.map((item) => (
          <ProjectEntry key={item.name} item={item} />
        ))}
      </div>
    </section>
  )
}

export default Projects
