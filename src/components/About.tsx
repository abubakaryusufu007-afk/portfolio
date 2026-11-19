interface AboutProps {
  bio: string
}

function About({ bio }: AboutProps) {
  return (
    <section
      className="content-section about-section"
      id="about"
      aria-labelledby="about-title"
    >
      <h2 className="section-title" id="about-title">
        ABOUT
      </h2>
      <p className="about-copy">{bio}</p>
    </section>
  )
}

export default About
