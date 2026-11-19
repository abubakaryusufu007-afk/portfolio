import type { EducationItem } from '../data/portfolioData'

interface EducationProps {
  education: EducationItem
}

function Education({ education }: EducationProps) {
  return (
    <section
      className="content-section"
      id="education"
      aria-labelledby="education-title"
    >
      <h2 className="section-title" id="education-title">
        EDUCATION
      </h2>
      <article className="education-entry">
        <h3>
          <span>{education.degree}</span>
          <span aria-hidden="true"> · </span>
          <span className="entry-organization">{education.institution}</span>
        </h3>
        <p>{education.description}</p>
      </article>
    </section>
  )
}

export default Education
