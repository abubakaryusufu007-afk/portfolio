interface StackProps {
  items: string[]
}

function Skills({ items }: StackProps) {
  return (
    <section
      className="content-section"
      id="skills"
      aria-labelledby="skills-title"
    >
      <h2 className="section-title" id="skills-title">
        SKILLS
      </h2>
      <ul className="stack-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export default Skills
