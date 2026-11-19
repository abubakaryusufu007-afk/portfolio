import WelcomeScreen from './components/WelcomeScreen'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Listening from './components/Listening'
import LifeAndWork from './components/LifeAndWork'
import {
  education,
  experience,
  profile,
  projects,
  stack,
} from './data/portfolioData'
import './portfolio.css'

const currentYear = new Date().getFullYear()

function App() {
  return (
    <div className="site">
      <main className="portfolio">
        <WelcomeScreen profile={profile} />
        <Skills items={stack} />
        <Experience items={experience} />
        <LifeAndWork />
        <Projects items={projects} />
        <Education education={education} />
        <Listening />
      </main>
      <footer className="site-footer">
        <span>© {currentYear} Yusuf Abubakar</span>
      </footer>
    </div>
  )
}

export default App
