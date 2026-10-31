// ============================================================================
// TECHNOSPARK CLUB INFORMATION & CONFIGURATION
// ============================================================================
// Edit club name, taglines, social media links, pillars, or navigation links here.
// ============================================================================

export const clubInfo = {
  name: 'TECHNOSPARK',
  fullName: 'TECHNOSPARK — ITSA TECHNICAL CLUB',
  affiliation: 'Information Technology Students Association (ITSA)',
  institution: 'Pimpri Chinchwad College of Engineering and Research (PCCOER)',
  tagline: 'WHERE IDEAS MEET TECHNOLOGY.',
  motto: 'Ideas. Innovation. Community.',
  shortDescription: 'Technospark is the premier technical club of ITSA, bringing students together through technology, events, learning, and innovation.',
  aboutDescription: 'Founded under the Information Technology Students Association (ITSA), Technospark serves as the vibrant technical epicenter for curious students, builders, and aspiring engineers. We bridge academic theory and real-world engineering through collaborative hackathons, hands-on masterclasses, peer code reviews, and industry speaker sessions.',

  // Official Logos
  logos: {
    whiteTransparent: '/assets/logos/TSWHITE-removebg-preview.png',
    blueTransparent: '/assets/logos/TSBLUE-removebg-preview.png',
    whiteSolid: '/assets/logos/TSWHITE.png',
    originalSquare: '/assets/logos/logo.jpeg'
  },

  // Main Navigation Links
  navLinks: [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Events', href: '#events' },
    { label: 'Team', href: '#organizers' },
    { label: 'Gallery', href: '#gallery' }
  ],

  // Social Links & Contacts
  socialLinks: [
    { name: 'Instagram', url: '#', handle: '@technospark_pccoe' },
    { name: 'LinkedIn', url: '#', handle: 'Technospark ITSA' },
    { name: 'Email', url: '#', handle: '#' }
  ],

  // Club Pillars (Migrated Structure from Prototype)
  pillars: [
    {
      id: 'learn',
      title: 'LEARN',
      tagline: 'Master Core & Modern Technologies',
      icon: 'BookOpen',
      description: 'Comprehensive hands-on workshops covering neural networks, cloud computing, distributed systems, and systems programming guided by seasoned mentors.'
    },
    {
      id: 'build',
      title: 'BUILD',
      tagline: 'From Concept to Production',
      icon: 'Cpu',
      description: '36-hour hackathons and build sprints where students architect full-stack applications, deploy verifiable smart contracts, and engineer connected IoT hardware.'
    },
    {
      id: 'collaborate',
      title: 'COLLABORATE',
      tagline: 'Synergy in Technical Squads',
      icon: 'Users',
      description: 'Cross-domain teams where frontend designers, systems developers, and data scientists join forces to conquer challenging technical frontiers.'
    },
    {
      id: 'innovate',
      title: 'INNOVATE',
      tagline: 'Pushing Beyond the Horizon',
      icon: 'Sparkles',
      description: 'Incubating ambitious ideas, contributing to open-source ecosystems, and publishing applied engineering solutions.'
    }
  ],

  // Key Stats
  stats: [
    { value: '500+', label: 'Student Innovators', detail: 'Active across community sprints' },
    { value: '12+', label: 'Major Sprints & Events', detail: 'Annual workshops & hackathons' },
    { value: '36hr', label: 'Flagship Hackathon', detail: 'Non-stop continuous building' },
    { value: '₹50K+', label: 'Prizes & Grants', detail: 'Awarded to student projects' }
  ],

  // Year for Copyright
  currentYear: 2026
};
