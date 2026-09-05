// ============================================================================
// TECHNOSPARK EVENT DATA
// ============================================================================
// Add, edit, or remove events in this file.
// The Events component automatically reads this data and displays the cards.
//
// Properties:
// - id: Unique string identifier for the event
// - title: Full display name of the event
// - category: 'Workshop' | 'Hackathon' | 'Seminar' | 'Competition'
// - date: Day number as string (e.g. '24')
// - month: 3-letter month (e.g. 'OCT')
// - year: Event year (e.g. '2026')
// - time: Event timing / duration
// - location: Venue or physical/virtual location
// - status: 'upcoming' | 'past'
// - badge: Short highlight badge text
// - shortDesc: 1-2 sentence overview shown on the card
// - fullDesc: Detailed explanation displayed inside the Details modal
// - schedule: Array of timeline steps for the event
// - highlights: Bullet points of key takeaways / prizes
// ============================================================================

export const events = [
  {
    id: 'technova-hackathon-2026',
    indexNum: '01',
    headerCategory: 'FLAGSHIP HACKATHON',
    headerColor: '#F59E0B',
    title: 'TECHNOVA 2026',
    category: 'Hackathon',
    date: '24 OCT 2026',
    time: '36 Hours (Continuous)',
    location: 'PCCOE Tech Core • Lab 404',
    shortDesc: 'The official 36-hour flagship hackathon bringing elite student developers together to build innovative solutions for AI, Web3, and Smart Systems.',
    fullDesc: 'TECHNOVA 2026 is Technospark’s flagship annual hackathon. Student teams collide in multidisciplinary sprints across problem tracks including Neural AI Systems, Web3 Decentralized Architecture, Cloud Infrastructure, and IoT Hardware. Senior software architects from top tech firms will mentor teams throughout the 36-hour sprint.',
    techStack: ['React', 'Web3', 'AI', 'Node.js'],
    linkSubtext: 'LIVE SPRINT + HACKATHON ARENA',
    buttonLabel: 'Infiltrate Sprint',
    buttonColor: '#F59E0B',
    image: '/assets/images/event_hackathon_banner.jpg',
    highlights: [
      '⚡ ₹50,000+ Prize Pool & Exclusive Spiderverse Swag',
      '⚡ 1-on-1 Mentorship from Principal Engineers',
      '⚡ Verifiable On-Chain Certificates for All Finalists'
    ]
  },
  {
    id: 'ai-ml-practical-workshop',
    indexNum: '02',
    headerCategory: 'DEEP LEARNING LAB',
    headerColor: '#A78BFA',
    title: 'NEURAL MATRIX LAB',
    category: 'Workshop',
    date: '12 NOV 2026',
    time: '14:00 – 18:00 IST',
    location: 'Computing Lab 3 • Hybrid',
    shortDesc: 'Hands-on deep learning workshop on implementing neural network architectures, computer vision pipelines, and deploying model endpoints.',
    fullDesc: 'Build, train, and deploy neural networks live using PyTorch and OpenCV. Participants will construct convolutional vision models, optimize inference speed, and launch a production model endpoint on cloud GPU clusters.',
    techStack: ['PyTorch', 'Python', 'OpenCV', 'CUDA'],
    linkSubtext: 'OPEN SOURCE LAB REPOSITORY',
    buttonLabel: 'Access Lab',
    buttonColor: '#A78BFA',
    image: '/assets/images/project_ai_vision.jpg',
    highlights: [
      '⚡ GPU Cloud Credit Allocation for All Attendees',
      '⚡ Deploy Live Vision Models to Production',
      '⚡ Certified AI Developer Badge'
    ]
  },
  {
    id: 'cybershield-ctf-2026',
    indexNum: '03',
    headerCategory: 'SECURITY CTF',
    headerColor: '#00F0FF',
    title: 'CYBERSHIELD CTF',
    category: 'Competition',
    date: '05 DEC 2026',
    time: '10:00 – 18:00 IST',
    location: 'Cyber Operations Lab + Virtual Arena',
    shortDesc: 'An intense 8-hour Capture The Flag challenge testing web exploitation, reverse engineering, cryptography, and digital forensics.',
    fullDesc: 'An intense 8-hour Capture The Flag challenge crafted by Technospark Security Operations. Test your skills across Web Exploitation, Reverse Engineering, Cryptography, and Digital Forensics with real-time leaderboard dynamics.',
    techStack: ['Security', 'Python', 'Reverse Eng', 'Crypto'],
    linkSubtext: 'DEFCON ARENA REGISTRATION',
    buttonLabel: 'Register Arena',
    buttonColor: '#00F0FF',
    image: '/assets/images/project_cyber_shield.jpg',
    highlights: [
      '⚡ 20+ Custom Exploitation Challenges',
      '⚡ Live Scoreboard with First-Blood Bonuses',
      '⚡ Cybersecurity Hardware Kits for Winners'
    ]
  }
];

export const categoryTheme = {
  Workshop: {
    badgeBg: 'rgba(0, 240, 255, 0.15)',
    badgeText: '#00F0FF',
    borderColor: 'rgba(0, 240, 255, 0.4)'
  },
  Hackathon: {
    badgeBg: 'rgba(168, 85, 247, 0.18)',
    badgeText: '#A855F7',
    borderColor: 'rgba(168, 85, 247, 0.5)'
  },
  Seminar: {
    badgeBg: 'rgba(217, 70, 239, 0.15)',
    badgeText: '#D946EF',
    borderColor: 'rgba(217, 70, 239, 0.4)'
  },
  Competition: {
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    badgeText: '#3B82F6',
    borderColor: 'rgba(59, 130, 246, 0.4)'
  }
};
