export interface Profile {
  name: string
  role: string
  bio: string
  links: { label: string; href: string }[]
}

export interface ExperienceItem {
  role: string
  organization: string
  description: string
}

export interface EducationItem {
  degree: string
  institution: string
  description: string
}

export interface ProjectItem {
  name: string
  description: string
  technologies?: string[]
  links?: { label: string; href: string }[]
}

export interface Track {
  title: string
  artist: string
  cover: string | null
  url: string
}

export interface ListeningData {
  lastPlayed: Track
  nowPlaying: boolean
  recentlyPlayed: Track[]
}

export const navigationLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Listening', href: '#listening' },
]

export const profile: Profile = {
  name: 'Yusuf Abubakar',
  role: 'Frontend Engineer',
  bio: "I build web interfaces with React, javascript , typscript, css, tailwaind css,. I'm a Computer Science student at Federal University Dutse, learning  Frontend Development.",
  links: [
    { label: 'Email', href: 'mailto:abubakaryusufu007@gmail.com' },
    {
      label: 'GitHub',
      href: 'https://github.com/abubakaryusufu007-afk',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/yusuvamir/',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/yusuf-abubakar-a61859397',
    },
    { label: 'X', href: 'https://x.com/yusuvamir' },
  ],
}

export const experience: ExperienceItem[] = [
  {
    role: 'Team Member',
    organization: "Africa's Talking Open Hackathon (PropTech), Kaduna",
    description:
      'Part of Team 2 building Estate Dues Ledger: a dues book for estates with a manager dashboard, SMS receipts, a USSD balance check and a public ledger, packaged as a Docker image for the Africa\'s Talking Marketplace.',
  },
  {
    role: 'Student',
    organization: 'Huawei ICT Academy, Federal University Dutse',
    description:
      'Completed the Huawei ICT Academy AI course and passed the certification exam. Working toward further certifications.',
  },
  {
    role: 'Team member',
    organization:'Neo innovatech solutions',
    description:'chief information officer(CIO)',
  },
  {
    role: 'Student',
    organization:'Yahya Hub',
    description:'Yahya Hub Website',
  },
  {
    role:'junior frontend developer',
    organization:'Yahya Hub',
    description:'Developing and maintaining web applications using React and TypeScript.',
  }
]

export const education: EducationItem = {
  degree: 'B.Sc. Computer Science',
  institution: 'Federal University Dutse',
  description:
  'Currently Level 300. CGPA: 4.27/5.0. Member of NACOS (Nigerian Association of Computer Science Students).',
}

export const projects: ProjectItem[] = [
  {
    name: 'Estate Dues Ledger',
    description:
      "A dues book for estates with a manager dashboard, SMS receipts, a USSD balance check, and a public ledger, packaged as a Docker image for the Africa's Talking Marketplace.",
  },
  {
    name: 'Yahya Hub Website',
    description: 'A website for the Yahya Hub community.',
  },
  {
    name:'africa\'s talking open hackathon',
    description:'A hackathon organized by Africa\'s Talking, where I was part of a team that built a project called Estate Dues Ledger.',
  }
]

export const stack = [
  'React',
  'JavaScript',
  'Tailwind CSS',
  'css',
  'TypeScript',
]

