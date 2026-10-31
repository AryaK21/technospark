// ============================================================================
// TECHNOSPARK ORGANIZERS & TEAM HIERARCHY DATA
// ============================================================================
// Contains:
// 1. Executive Leadership Organizers (Original Technospark Dataset)
// 2. Faculty Coordinators & Mentors (Department of IT, PCCOER)
// 3. Student Team Branches (Leadership, Technical, Web Dev, Operations, Design, Advisory)
// ============================================================================

export const organizers = [
  {
    id: 1,
    indexNum: "01",
    name: "AKSHAT SHRIVASTAVA",
    role: "GDGoC Organizer",
    tag: "ORGANIZER",
    accentColor: "#00F0FF", // Cyan
    photo: "/images/organizers/akshat.png",
    fallbackPhoto: "/assets/images/akshat.jpg",
    linkedin: "https://www.linkedin.com/in/akshat-shrivastava-",
    bullets: [
      "Lead Community Organizer driving student developer ecosystem and campus initiatives",
      "Overseeing Technospark 2026 technical tracks, hackathons, and industry mentorship",
      "Facilitating hands-on workshops in Cloud Architecture, AI systems, and Open Source"
    ]
  },
  {
    id: 2,
    indexNum: "02",
    name: "PRAJYOT TAYDE",
    role: "Core Team",
    tag: "CORE TEAM",
    accentColor: "#F59E0B", // Amber / Orange
    photo: "/images/organizers/prajyot.png",
    fallbackPhoto: "/assets/images/prajyot.jpg",
    linkedin: "https://www.linkedin.com/in/prajyot-tayde-",
    bullets: [
      "Core planning lead coordinating multidisciplinary teams for flagship technical events",
      "Managing end-to-end event logistics, scheduling, and judge alignment",
      "Spearheading participant engagement and cross-college coordination"
    ]
  },
  {
    id: 3,
    indexNum: "03",
    name: "RUPAM AGRAWAL",
    role: "Execution Lead",
    tag: "EXECUTION",
    accentColor: "#A855F7", // Lavender / Purple
    photo: "/images/organizers/rupam.png",
    fallbackPhoto: "/assets/images/rupam.svg",
    linkedin: "https://www.linkedin.com/in/rupam-agrawal-",
    bullets: [
      "Operations & execution lead driving real-time management across all event venues",
      "Overseeing technical infrastructure, attendee check-ins, and on-ground logistics",
      "Directing volunteer task forces to ensure seamless tournament execution"
    ]
  },
  {
    id: 4,
    indexNum: "04",
    name: "ADARSH THAKARE",
    role: "Web & App Facilitator",
    tag: "DEVELOPMENT",
    accentColor: "#EF4444", // Red
    photo: "/images/organizers/adarsh.png",
    fallbackPhoto: "/assets/images/adarsh.svg",
    linkedin: "https://www.linkedin.com/in/adarsh-thakare-",
    bullets: [
      "Web and application development lead engineering digital solutions for Technospark",
      "Leading student developers in building real-time dashboards and scoring systems",
      "Mentoring hackathon teams on scalable frontend architecture and API integration"
    ]
  }
];

// ── Faculty Coordinators & Department Mentors ───────────────────────────────
export const facultyCoordinators = [
  {
    id: 'fac-1',
    name: 'Dr. Archana Chaugule',
    position: 'Faculty Coordinator',
    role: 'Head of Department, IT',
    tag: 'FACULTY',
    accentColor: '#A855F7',
    photo: '/assets/images/akshat.jpg',
    email: 'hod.it@pccoer.in',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'fac-2',
    name: 'Prof. Swapnil Shinde',
    position: 'Faculty Coordinator',
    role: 'Assistant Professor, IT',
    tag: 'FACULTY',
    accentColor: '#00F0FF',
    photo: '/assets/images/prajyot.jpg',
    email: 'swapnil.shinde@pccoer.in',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'fac-3',
    name: 'Prof. Priya Jadhav',
    position: 'Faculty Coordinator',
    role: 'Assistant Professor, IT',
    tag: 'FACULTY',
    accentColor: '#F59E0B',
    photo: '/assets/images/akshat.jpg',
    email: 'priya.jadhav@pccoer.in',
    linkedin: 'https://linkedin.com'
  }
];

// ── Student Team Branches Hierarchy ─────────────────────────────────────────
export const studentBranches = [
  {
    branchId: 'leadership',
    branchName: 'Club Leadership',
    description: 'Core student executives guiding club vision, inter-collegiate hackathons, and community growth.',
    members: [
      {
        id: 'lead-1',
        name: 'Prabodh Kulkarni',
        position: 'Lead',
        tag: 'LEAD',
        accentColor: '#00F0FF',
        photo: '/assets/images/akshat.jpg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'lead-2',
        name: 'Arya Kukkadwal',
        position: 'Co-Lead',
        tag: 'CO-LEAD',
        accentColor: '#A855F7',
        photo: '/assets/images/prajyot.jpg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'lead-3',
        name: 'Rahul Machhirke',
        position: 'Head',
        tag: 'HEAD',
        accentColor: '#F59E0B',
        photo: '/assets/images/akshat.jpg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'lead-4',
        name: 'Akshat Shrivastava',
        position: 'Lead',
        tag: 'ORGANIZER',
        accentColor: '#00F0FF',
        photo: '/images/organizers/akshat.png',
        fallbackPhoto: '/assets/images/akshat.jpg',
        linkedin: 'https://www.linkedin.com/in/akshat-shrivastava-',
        github: 'https://github.com'
      }
    ]
  },
  {
    branchId: 'technical',
    branchName: 'Technical Team',
    description: 'Hands-on software engineers building hackathon platforms, cloud infrastructure, and technical problem tracks.',
    members: [
      {
        id: 'tech-1',
        name: 'Prajyot Tayde',
        position: 'Head',
        tag: 'TECH HEAD',
        accentColor: '#F59E0B',
        photo: '/images/organizers/prajyot.png',
        fallbackPhoto: '/assets/images/prajyot.jpg',
        linkedin: 'https://www.linkedin.com/in/prajyot-tayde-',
        github: 'https://github.com'
      },
      {
        id: 'tech-2',
        name: 'Adarsh Thakare',
        position: 'Co-Head',
        tag: 'TECH CO-HEAD',
        accentColor: '#EF4444',
        photo: '/images/organizers/adarsh.png',
        fallbackPhoto: '/assets/images/adarsh.svg',
        linkedin: 'https://www.linkedin.com/in/adarsh-thakare-',
        github: 'https://github.com'
      },
      {
        id: 'tech-3',
        name: 'Kaivalya Agarkar',
        position: 'Member',
        tag: 'DEV',
        accentColor: '#38BDF8',
        photo: '/assets/images/akshat.jpg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'tech-4',
        name: 'Sakshi Jadhav',
        position: 'Member',
        tag: 'DEV',
        accentColor: '#A855F7',
        photo: '/assets/images/prajyot.jpg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      }
    ]
  },
  {
    branchId: 'webdev',
    branchName: 'Web & App Development Team',
    description: 'Frontend architects and full-stack developers crafting high-performance, responsive digital systems.',
    members: [
      {
        id: 'web-1',
        name: 'Adarsh Thakare',
        position: 'Head',
        tag: 'WEB HEAD',
        accentColor: '#EF4444',
        photo: '/images/organizers/adarsh.png',
        fallbackPhoto: '/assets/images/adarsh.svg',
        linkedin: 'https://www.linkedin.com/in/adarsh-thakare-',
        github: 'https://github.com'
      },
      {
        id: 'web-2',
        name: 'Prajyot Tayde',
        position: 'Co-Head',
        tag: 'WEB CO-HEAD',
        accentColor: '#F59E0B',
        photo: '/images/organizers/prajyot.png',
        fallbackPhoto: '/assets/images/prajyot.jpg',
        linkedin: 'https://www.linkedin.com/in/prajyot-tayde-',
        github: 'https://github.com'
      },
      {
        id: 'web-3',
        name: 'Hemashree Jawdekar',
        position: 'Member',
        tag: 'FRONTEND',
        accentColor: '#00F0FF',
        photo: '/assets/images/akshat.jpg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'web-4',
        name: 'Omkar Patil',
        position: 'Member',
        tag: 'FULLSTACK',
        accentColor: '#A855F7',
        photo: '/assets/images/prajyot.jpg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      }
    ]
  },
  {
    branchId: 'operations',
    branchName: 'Execution & Operations Team',
    description: 'Directing event logistics, venue setup, participant management, and hackathon stage operations.',
    members: [
      {
        id: 'ops-1',
        name: 'Rupam Agrawal',
        position: 'Head',
        tag: 'EXECUTION',
        accentColor: '#A855F7',
        photo: '/images/organizers/rupam.png',
        fallbackPhoto: '/assets/images/rupam.svg',
        linkedin: 'https://www.linkedin.com/in/rupam-agrawal-',
        github: 'https://github.com'
      },
      {
        id: 'ops-2',
        name: 'Rahul Machhirke',
        position: 'Co-Head',
        tag: 'OPERATIONS',
        accentColor: '#00F0FF',
        photo: '/assets/images/akshat.jpg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'ops-3',
        name: 'Krishna Kamurti',
        position: 'Member',
        tag: 'LOGISTICS',
        accentColor: '#F59E0B',
        photo: '/assets/images/prajyot.jpg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'ops-4',
        name: 'Kushagra Brijwasi',
        position: 'Member',
        tag: 'ON-GROUND',
        accentColor: '#EF4444',
        photo: '/assets/images/akshat.jpg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      }
    ]
  },
  {
    branchId: 'design',
    branchName: 'Design & Creative Team',
    description: 'Visual identity, 3D assets, event posters, UI/UX designs, and brand communications.',
    members: [
      {
        id: 'des-1',
        name: 'Tanvi Deshmukh',
        position: 'Head',
        tag: 'DESIGN HEAD',
        accentColor: '#D946EF',
        photo: '/assets/images/akshat.jpg',
        linkedin: 'https://www.linkedin.com/in/tanvi-deshmukh',
        github: 'https://github.com'
      },
      {
        id: 'des-2',
        name: 'Disha Musale',
        position: 'Co-Head',
        tag: 'CREATIVE',
        accentColor: '#00F0FF',
        photo: '/assets/images/prajyot.jpg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'des-3',
        name: 'Sujal Kunte',
        position: 'Member',
        tag: 'UI/UX',
        accentColor: '#A855F7',
        photo: '/assets/images/adarsh.svg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'des-4',
        name: 'Raviraj Bhapkar',
        position: 'Member',
        tag: 'VISUAL',
        accentColor: '#F59E0B',
        photo: '/assets/images/rupam.svg',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      }
    ]
  },
  {
    branchId: 'advisory',
    branchName: 'Alumni & Advisory Council',
    description: 'Industry alumni providing mentorship, technical architecture guidance, and project evaluations.',
    members: [
      {
        id: 'adv-1',
        name: 'Siddharth Patil',
        position: 'Advisory Lead',
        tag: 'ALUMNI ADVISOR',
        accentColor: '#00F0FF',
        photo: '/assets/images/prajyot.jpg',
        linkedin: 'https://www.linkedin.com/in/siddharth-patil',
        github: 'https://github.com'
      }
    ]
  }
];
