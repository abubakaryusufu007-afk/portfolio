import type { Profile } from '../data/portfolioData'

interface ProfileHeaderProps {
  profile: Profile
}

function WelcomeScreen({ profile }: ProfileHeaderProps) {
  return (
    <header className="profile-header" id="home">
      <h1 className="profile-name">{profile.name}</h1>
      <p className="profile-role">{profile.role}</p>
      <p className="profile-bio">{profile.bio}</p>
      <nav className="profile-links" aria-label="Social and contact links">
        {profile.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.href.startsWith('https://')
              ? { target: '_blank', rel: 'noreferrer' }
              : {})}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default WelcomeScreen
