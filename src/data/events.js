// ============================================================================
// TECHNOSPARK EVENT DATA
// ============================================================================
// Aligned with the requested Event Grid and Event Popup designs:
// - id        : Unique identifier
// - title     : Event display name (e.g. 'TECHNOVA HACKATHON 2026')
// - category  : 'Hackathon' | 'Workshop' | 'Competition' | 'Seminar'
// - badge     : Type badge (e.g. 'Flagship Event', 'Hands-on Lab')
// - status    : 'upcoming' | 'past'
// - era       : 'upcoming' | 'past' (for chronological timeline compatibility)
// - date      : Display date string
// - displayDate: Short date for timeline milestone tags
// - time      : Timing string
// - location  : Venue string
// - image     : Card banner image path
// - shortDesc : Concise description for the card
// - fullDesc  : Full narrative for the modal
// ============================================================================

export const events = [
  // ── UPCOMING EVENTS ────────────────────────────────────────────────────────
  {
    id: 'technova-hackathon-2026',
    title: 'TECHNOVA HACKATHON 2026',
    name: 'TECHNOVA HACKATHON 2026',
    category: 'Hackathon',
    badge: 'Flagship Event',
    status: 'upcoming',
    era: 'upcoming',
    event_date: '2026-11-24',
    date: 'NOV 24 - 25, 2026',
    displayDate: 'NOV 24, 2026',
    start_time: '10:00:00',
    end_time: '22:00:00',
    time: '36 Hours (Continuous)',
    venue: 'PCCOE Campus Tech Hub',
    location: 'PCCOE Campus Tech Hub',
    image: '/assets/images/event_hackathon_banner.jpg',
    shortDesc: 'The annual 36-hour hackathon bringing student developers together to build innovative solutions for real-world challenges.',
    fullDesc: 'TECHNOVA 2026 is Technospark’s flagship annual hackathon. Students collaborate in multidisciplinary teams across problem tracks including AI & Machine Learning, Web3, Cloud Systems, and Smart Campus IoT. Mentors from top tech industries will guide teams throughout the 36-hour sprint.'
  },
  {
    id: 'practical-ai-ml-workshop',
    title: 'Practical AI & Neural Networks Workshop',
    name: 'Practical AI & Neural Networks Workshop',
    category: 'Workshop',
    badge: 'Hands-on Lab',
    status: 'upcoming',
    era: 'upcoming',
    event_date: '2026-12-12',
    date: 'DEC 12, 2026',
    displayDate: 'DEC 12, 2026',
    start_time: '14:00:00',
    end_time: '18:00:00',
    time: '02:00 PM – 06:00 PM',
    venue: 'Computing Lab 3 • Hybrid',
    location: 'Computing Lab 3 • Hybrid',
    image: '/assets/images/project_ai_vision.jpg',
    shortDesc: 'Hands-on session on implementing deep neural architectures and computer vision pipelines from scratch.',
    fullDesc: 'Get hands-on experience building, training, and deploying neural networks using PyTorch and OpenCV. Participants will code practical models for image recognition and deploy a working endpoint on cloud hardware.'
  },
  {
    id: 'cybershield-ctf-2026',
    title: 'CYBERSHIELD CTF 2027',
    name: 'CYBERSHIELD CTF 2027',
    category: 'Competition',
    badge: 'Security Challenge',
    status: 'upcoming',
    era: 'upcoming',
    event_date: '2027-01-15',
    date: 'JAN 15, 2027',
    displayDate: 'JAN 15, 2027',
    start_time: '10:00:00',
    end_time: '18:00:00',
    time: '10:00 AM – 06:00 PM',
    venue: 'Online Platform + Lab Finals',
    location: 'Online Platform + Lab Finals',
    image: '/assets/images/project_cyber_shield.jpg',
    shortDesc: 'Jeopardy-style capture-the-flag tournament testing web exploitation, cryptography, and digital forensics.',
    fullDesc: 'An intense 8-hour Capture The Flag challenge crafted by the Technospark Security domain. Designed for both beginner security enthusiasts and seasoned CTF players, featuring tiered difficulty levels.'
  },

  // ── PAST EVENTS ────────────────────────────────────────────────────────────
  {
    id: 'code-sprint-2025',
    title: 'Code Sprint 2025 Algorithmic Marathon',
    name: 'Code Sprint 2025 Algorithmic Marathon',
    category: 'Competition',
    badge: 'Completed',
    status: 'past',
    era: 'past',
    event_date: '2025-09-15',
    date: 'SEP 15, 2025',
    displayDate: 'SEP 15, 2025',
    start_time: '10:00:00',
    end_time: '16:00:00',
    time: '10:00 AM – 04:00 PM',
    venue: 'Main Auditorium • PCCOE',
    location: 'Main Auditorium • PCCOE',
    image: '/assets/images/event_hackathon_banner.jpg',
    shortDesc: '6-hour algorithmic programming marathon with 200+ participants solving challenges across 5 difficulty tracks.',
    fullDesc: 'Code Sprint 2025 brought together 200+ student programmers in a 6-hour algorithmic marathon. Problems spanned greedy algorithms, dynamic programming, graph theory, and data structures.'
  },
  {
    id: 'iot-hack-lab-2025',
    title: 'IoT Sensor Networks & Embedded Lab',
    name: 'IoT Sensor Networks & Embedded Lab',
    category: 'Workshop',
    badge: 'Completed',
    status: 'past',
    era: 'past',
    event_date: '2025-07-22',
    date: 'JUL 22, 2025',
    displayDate: 'JUL 22, 2025',
    start_time: '09:00:00',
    end_time: '16:00:00',
    time: '09:00 AM – 04:00 PM',
    venue: 'Electronics Lab 1 • PCCOE',
    location: 'Electronics Lab 1 • PCCOE',
    image: '/assets/images/project_iot_smart_campus.jpg',
    shortDesc: 'Hardware hacking workshop on Raspberry Pi, Arduino sensor networks, and real-time MQTT streaming dashboards.',
    fullDesc: 'Participants built sensor networks using Raspberry Pi and Arduino, wired temperature, motion, and humidity sensors, and streamed real-time data to a custom MQTT broker dashboard.'
  },
  {
    id: 'ui-designathon-2025',
    title: 'Product UI & UX Designathon 2025',
    name: 'Product UI & UX Designathon 2025',
    category: 'Competition',
    badge: 'Completed',
    status: 'past',
    era: 'past',
    event_date: '2025-06-10',
    date: 'JUN 10, 2025',
    displayDate: 'JUN 10, 2025',
    start_time: '12:00:00',
    end_time: '20:00:00',
    time: '12:00 PM – 08:00 PM',
    venue: 'Innovation Lab • PCCOE',
    location: 'Innovation Lab • PCCOE',
    image: '/assets/images/akshat.jpg',
    shortDesc: '8-hour product prototyping sprint challenging teams to design and present a complete mobile application.',
    fullDesc: 'Teams of 2-3 competed to design a complete mobile app UI from scratch in 8 hours using Figma. Judging criteria included visual hierarchy, user journey, micro-interactions, and accessibility.'
  }
];

export const categoryTheme = {
  Workshop:    { color: '#00F0FF', badgeBg: 'rgba(0, 240, 255, 0.15)' },
  Hackathon:   { color: '#EF4444', badgeBg: 'rgba(239, 68, 68, 0.15)' },
  Competition: { color: '#38BDF8', badgeBg: 'rgba(56, 189, 248, 0.15)' },
  Seminar:     { color: '#A855F7', badgeBg: 'rgba(168, 85, 247, 0.15)' }
};
