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
    title: 'TECHNOVA HACKATHON 2026',
    category: 'Hackathon',
    date: '24',
    month: 'OCT',
    year: '2026',
    time: '36 Hours (Continuous)',
    location: 'PCCOE Campus Tech Hub',
    status: 'upcoming',
    badge: 'Flagship Event',
    shortDesc: 'The annual 36-hour hackathon bringing student developers together to build innovative solutions for real-world challenges.',
    fullDesc: 'TECHNOVA 2026 is Technospark’s flagship annual hackathon. Students collaborate in multidisciplinary teams across problem tracks including AI & Machine Learning, Web3, Cloud Systems, and Smart Campus IoT. Mentors from top tech industries will guide teams throughout the 36-hour sprint.',
    schedule: [
      { time: 'Day 1 • 09:00 AM', label: 'Opening Ceremony & Track Announcement' },
      { time: 'Day 1 • 11:00 AM', label: 'Hacking Begins & Mentor Round 1' },
      { time: 'Day 1 • 09:00 PM', label: 'Midnight Pitch Review & Snack Surge' },
      { time: 'Day 2 • 02:00 PM', label: 'Final Evaluation, Demos & Award Ceremony' }
    ],
    highlights: [
      'Cash prizes and goodies worth over ₹50,000+',
      'Direct 1-on-1 mentorship from industry software architects',
      'Certificate of participation and merit for all finalists'
    ]
  },
  {
    id: 'ai-ml-practical-workshop',
    title: 'Practical AI & Neural Networks Workshop',
    category: 'Workshop',
    date: '12',
    month: 'NOV',
    year: '2026',
    time: '02:00 PM – 06:00 PM',
    location: 'Computing Lab 3 • Hybrid',
    status: 'upcoming',
    badge: 'Hands-on Lab',
    shortDesc: 'Hands-on session on implementing deep neural architectures and computer vision pipelines from scratch.',
    fullDesc: 'Get hands-on experience building, training, and deploying neural networks using PyTorch and OpenCV. Participants will code practical models for image recognition and deploy a working endpoint on cloud hardware.',
    schedule: [
      { time: '02:00 PM', label: 'Neural Network Fundamentals & Math Intuition' },
      { time: '03:15 PM', label: 'Hands-on Coding: Training with PyTorch' },
      { time: '04:45 PM', label: 'Deploying Real-time Inference & Edge Optimization' },
      { time: '05:30 PM', label: 'Q&A, Code Review & Take-home Projects' }
    ],
    highlights: [
      'Interactive Jupyter notebooks provided to all attendees',
      'Deploy your own real-time vision model live',
      'Earn a verified Certificate of Completion'
    ]
  },
  {
    id: 'cybershield-ctf-2026',
    title: 'CYBERSHIELD CTF 2026',
    category: 'Competition',
    date: '05',
    month: 'DEC',
    year: '2026',
    time: '10:00 AM – 06:00 PM',
    location: 'Online Platform + Lab Finals',
    status: 'upcoming',
    badge: 'Security Challenge',
    shortDesc: 'Jeopardy-style capture-the-flag tournament testing web exploitation, cryptography, and digital forensics.',
    fullDesc: 'An intense 8-hour Capture The Flag challenge crafted by the Technospark Security domain. Designed for both beginner security enthusiasts and seasoned CTF players, featuring tiered difficulty levels.',
    schedule: [
      { time: '10:00 AM', label: 'CTF Platform Access & Rules Briefing' },
      { time: '10:30 AM', label: 'Round 1: Web Exploitation & Crypto Challenges' },
      { time: '02:00 PM', label: 'Round 2: Reverse Engineering & Binary Analysis' },
      { time: '05:30 PM', label: 'Leaderboard Freeze & Solution Walkthrough' }
    ],
    highlights: [
      '20+ custom crafted challenge scenarios',
      'Live scoreboard with first-blood bonuses',
      'Exclusive cybersecurity merchandise for top 3 teams'
    ]
  },
  {
    id: 'cloud-devops-bootcamp',
    title: 'Cloud Architecture & Kubernetes Zero-to-One',
    category: 'Workshop',
    date: '18',
    month: 'JAN',
    year: '2026',
    time: '10:00 AM – 03:00 PM',
    location: 'Auditorium 2 & Virtual Stream',
    status: 'past',
    badge: 'Completed',
    shortDesc: 'Comprehensive masterclass on containerizing microservices and managing cloud workloads with Docker & Kubernetes.',
    fullDesc: 'Over 200 students learned how modern cloud-native systems operate. We walked through container fundamentals with Docker, multi-node orchestration with Kubernetes, and automated deployment pipelines with GitHub Actions.',
    schedule: [
      { time: '10:00 AM', label: 'Virtualization vs Containerization' },
      { time: '11:30 AM', label: 'Kubernetes Pods, Services & Ingress Setup' },
      { time: '01:30 PM', label: 'Live Deployment of Microservices Architecture' }
    ],
    highlights: [
      '200+ active student participants',
      'Hands-on GCP Cloud Shell environment access',
      'Recorded sessions and repository code templates'
    ]
  },
  {
    id: 'tech-career-insights-seminar',
    title: 'Industry Insights: Building Software at Scale',
    category: 'Seminar',
    date: '28',
    month: 'FEB',
    year: '2026',
    time: '04:00 PM – 06:30 PM',
    location: 'Main Auditorium',
    status: 'past',
    badge: 'Completed',
    shortDesc: 'Alumni panel discussion and seminar on software engineering practices, system design, and open-source careers.',
    fullDesc: 'Technospark hosted engineering leaders and distinguished alumni working at top tech firms to share insights on engineering best practices, career roadmaps, preparing for technical interviews, and contributing to high-impact open source projects.',
    schedule: [
      { time: '04:00 PM', label: 'Welcome Address & ITSA Overview' },
      { time: '04:20 PM', label: 'Keynote: Scaling Systems from 1k to 1M Users' },
      { time: '05:15 PM', label: 'Interactive Panel Discussion & Open Q&A' }
    ],
    highlights: [
      'Keynote by Senior Cloud Architect alumni',
      'Interactive Q&A with 150+ attendees',
      'Direct resume review and career tips'
    ]
  }
];

// ============================================================================
// CATEGORY COLOR MAPPINGS
// Maps each category to a distinct semantic accent color
// ============================================================================
export const categoryTheme = {
  Workshop: {
    badgeBg: '#EAF2FF',
    badgeText: '#2563EB',
    borderColor: '#93C5FD'
  },
  Hackathon: {
    badgeBg: '#FEF3C7',
    badgeText: '#D97706',
    borderColor: '#FCD34D'
  },
  Seminar: {
    badgeBg: '#E0F2FE',
    badgeText: '#0284C7',
    borderColor: '#7DD3FC'
  },
  Competition: {
    badgeBg: '#EEF2F6',
    badgeText: '#0B2447',
    borderColor: '#CBD5E1'
  }
};
