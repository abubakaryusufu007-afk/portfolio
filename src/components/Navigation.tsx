interface NavigationLink {
  label: string
  href: string
}

interface NavigationProps {
  links: NavigationLink[]
}

function Navigation({ links }: NavigationProps) {
  return (
    <header className="site-header">
      <a className="site-mark" href="#home" aria-label="Yusuf Abubakar home">
        YA
      </a>
      <nav className="site-navigation" aria-label="Main navigation">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default Navigation
