// ============================================================================
// TEMPORARY MOCK DATA FOR TECHNOSPARK ADMIN PANEL
// ============================================================================
// IMPORTANT FOR BEGINNERS & FUTURE SUPABASE INTEGRATION:
//
// This file contains the initial placeholder data used by the admin dashboard.
// None of the data here is permanently stored in a database yet.
//
// When you connect Supabase later:
// 1. You will replace `mockDashboardStats` with aggregated COUNT() queries from Supabase.
// 2. You will replace `mockEvents` with `supabase.from('events').select('*')`.
// 3. You will replace `mockOrganizers` with `supabase.from('organizers').select('*')`.
// 4. You will replace `mockGallery` with `supabase.from('gallery').select('*')` + Supabase Storage URLs.
// 5. You will replace `mockAdminUsers` with `supabase.auth.admin.listUsers()` or a `profiles` table.
//
// For now, these objects provide realistic shapes and types so the UI looks and behaves
// like a real production dashboard.
// ============================================================================

// ============================================================================
// 1. DASHBOARD STATISTICS
// ============================================================================
// Future Supabase Query:
// const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true });
// const { count: orgCount } = await supabase.from('organizers').select('*', { count: 'exact', head: true });
// const { count: mediaCount } = await supabase.from('gallery').select('*', { count: 'exact', head: true });
// const { count: adminCount } = await supabase.from('admin_users').select('*', { count: 'exact', head: true });
export const mockDashboardStats = {
  events: 12,
  organizers: 8,
  galleryItems: 42,
  admins: 4,
  activeRegistrations: 384,
  upcomingEventsCount: 3
};

// ============================================================================
// ============================================================================
// 2. EVENTS MOCK DATA
// ============================================================================
// PostgreSQL Table: public.events
// Columns: id (uuid), name, category, event_date, start_time, end_time, venue
export const mockEvents = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'TECHNOVA HACKATHON 2026',
    title: 'TECHNOVA HACKATHON 2026',
    category: 'Hackathon',
    event_date: '2026-10-24',
    date: '2026-10-24',
    start_time: '09:00',
    startTime: '09:00 AM',
    end_time: '21:00',
    endTime: '09:00 PM',
    venue: 'PCCOE Campus Tech Hub, Pune',
    status: 'upcoming',
    registrationLink: 'https://technospark.in/register/technova2026',
    coverImage: '/assets/images/event_hackathon_banner.jpg',
    description: 'The annual 36-hour flagship hackathon bringing student developers together to solve real-world problems in AI, Web3, and IoT.'
  },
  {
    id: 'c9a646d3-9c61-4cd7-9f59-533c32b5f182',
    name: 'Practical AI & Neural Networks Workshop',
    title: 'Practical AI & Neural Networks Workshop',
    category: 'Workshop',
    event_date: '2026-11-12',
    date: '2026-11-12',
    start_time: '14:00',
    startTime: '02:00 PM',
    end_time: '18:00',
    endTime: '06:00 PM',
    venue: 'Computing Lab 3 • Hybrid',
    status: 'upcoming',
    registrationLink: 'https://technospark.in/register/ai-workshop',
    coverImage: '/assets/images/project_ai_vision.jpg',
    description: 'Hands-on deep learning workshop where participants build, train, and deploy real-time computer vision models with PyTorch.'
  },
  {
    id: 'd8e8fca2-1182-4e15-a71f-471355442e6d',
    name: 'CYBERSHIELD CTF Tournament',
    title: 'CYBERSHIELD CTF Tournament',
    category: 'Competition',
    event_date: '2026-12-05',
    date: '2026-12-05',
    start_time: '10:00',
    startTime: '10:00 AM',
    end_time: '18:00',
    endTime: '06:00 PM',
    venue: 'IT Department Seminar Hall',
    status: 'upcoming',
    registrationLink: 'https://technospark.in/register/cybershield',
    coverImage: '/assets/images/project_cyber_shield.jpg',
    description: 'High-intensity cybersecurity challenge testing web exploitation, reverse engineering, network forensics, and cryptography.'
  },
  {
    id: '7b1129bc-696a-4d7a-8f56-91e847c13488',
    name: 'Smart Campus & IoT Innovation Showcase',
    title: 'Smart Campus & IoT Innovation Showcase',
    category: 'Seminar',
    event_date: '2026-08-15',
    date: '2026-08-15',
    start_time: '11:00',
    startTime: '11:00 AM',
    end_time: '16:00',
    endTime: '04:00 PM',
    venue: 'Auditorium A • PCCOE',
    status: 'past',
    registrationLink: 'https://technospark.in/events/iot-showcase',
    coverImage: '/assets/images/project_iot_smart_campus.jpg',
    description: 'Exhibition of connected hardware systems, automated campus energy grids, and embedded sensor solutions.'
  },
  {
    id: '3c0e12d4-89f5-46c8-bc42-d9f7e8a91234',
    name: 'Web3 & Decentralized Systems Masterclass',
    title: 'Web3 & Decentralized Systems Masterclass',
    category: 'Workshop',
    event_date: '2026-07-20',
    date: '2026-07-20',
    start_time: '15:00',
    startTime: '03:00 PM',
    end_time: '19:00',
    endTime: '07:00 PM',
    venue: 'Online via Google Meet',
    status: 'past',
    registrationLink: 'https://technospark.in/events/web3-masterclass',
    coverImage: '/assets/images/project_ai_vision.jpg',
    description: 'Architecting decentralized applications, Solidity smart contracts, and EVM gas optimization techniques.'
  },
  {
    id: '9a8b7c6d-5e4f-3a2b-1c0d-ef9876543210',
    name: 'Cloud Architecture & Kubernetes Sprint',
    title: 'Cloud Architecture & Kubernetes Sprint',
    category: 'Workshop',
    event_date: '2027-01-18',
    date: '2027-01-18',
    start_time: '10:00',
    startTime: '10:00 AM',
    end_time: '15:00',
    endTime: '03:00 PM',
    venue: 'Main Computer Center',
    status: 'draft',
    registrationLink: 'https://technospark.in/events/k8s-sprint',
    coverImage: '/assets/images/event_hackathon_banner.jpg',
    description: 'Draft outline for microservice deployment, Helm charts, and CI/CD pipelines on GCP and AWS.'
  }
];

// ============================================================================
// 3. ORGANIZERS / TEAM MOCK DATA
// ============================================================================
// PostgreSQL Table: public.organizers
// Columns: id (bigint identity), Name, role, linkedin, image
export const mockOrganizers = [
  {
    id: 1,
    Name: 'Akshat Shrivastava',
    name: 'Akshat Shrivastava',
    role: 'GDGoC Organizer & Lead',
    linkedin: 'https://linkedin.com/in/akshat-shrivastava',
    profile: 'https://linkedin.com/in/akshat-shrivastava',
    image: '/assets/images/akshat.jpg'
  },
  {
    id: 2,
    Name: 'Prajyot Tayde',
    name: 'Prajyot Tayde',
    role: 'Core Team & Technical Lead',
    linkedin: 'https://linkedin.com/in/prajyot-tayde',
    profile: 'https://linkedin.com/in/prajyot-tayde',
    image: '/assets/images/prajyot.jpg'
  },
  {
    id: 3,
    Name: 'Rupam Agrawal',
    name: 'Rupam Agrawal',
    role: 'Execution & Operations Lead',
    linkedin: 'https://linkedin.com/in/rupam-agrawal',
    profile: 'https://linkedin.com/in/rupam-agrawal',
    image: '/assets/images/rupam.svg'
  },
  {
    id: 4,
    Name: 'Adarsh Thakare',
    name: 'Adarsh Thakare',
    role: 'Web & App Facilitator',
    linkedin: 'https://linkedin.com/in/adarsh-thakare',
    profile: 'https://linkedin.com/in/adarsh-thakare',
    image: '/assets/images/adarsh.svg'
  },
  {
    id: 5,
    Name: 'Tanvi Deshmukh',
    name: 'Tanvi Deshmukh',
    role: 'Design & Creative Lead',
    linkedin: 'https://linkedin.com/in/tanvi-deshmukh',
    profile: 'https://linkedin.com/in/tanvi-deshmukh',
    image: '/assets/images/akshat.jpg'
  },
  {
    id: 6,
    Name: 'Siddharth Patil',
    name: 'Siddharth Patil',
    role: 'Alumni Advisor',
    linkedin: 'https://linkedin.com/in/siddharth-patil',
    profile: 'https://linkedin.com/in/siddharth-patil',
    image: '/assets/images/prajyot.jpg'
  }
];

// ============================================================================
// 4. GALLERY / MEDIA MOCK DATA
// ============================================================================
// Future Supabase Table: `gallery_media` + Supabase Storage Bucket: `media`
// Columns: id (uuid), title, media_type, url, thumbnail_url, associated_event, upload_date, file_size
export const mockGallery = [
  {
    id: 'gal-001',
    title: 'TECHNOVA Hackathon — 36hr Build Sprint Opening Ceremony',
    mediaType: 'image', // 'image' | 'video'
    url: '/assets/images/event_hackathon_banner.jpg',
    thumbnail: '/assets/images/event_hackathon_banner.jpg',
    associatedEvent: 'TECHNOVA HACKATHON 2026',
    uploadDate: '2026-08-20',
    dimensions: '1920 x 1080',
    fileSize: '2.4 MB',
    caption: 'Over 500 student developers collaborating on real-world engineering challenges in the PCCOE Tech Hub.'
  },
  {
    id: 'gal-002',
    title: 'Hands-on Deep Learning Vision Lab Live Demo',
    mediaType: 'image',
    url: '/assets/images/project_ai_vision.jpg',
    thumbnail: '/assets/images/project_ai_vision.jpg',
    associatedEvent: 'Practical AI & Neural Networks Workshop',
    uploadDate: '2026-08-18',
    dimensions: '1600 x 900',
    fileSize: '1.8 MB',
    caption: 'Students implementing real-time convolutional neural networks with PyTorch in computing lab.'
  },
  {
    id: 'gal-003',
    title: 'CYBERSHIELD CTF Tournament Highlights Reel',
    mediaType: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: '/assets/images/project_cyber_shield.jpg',
    associatedEvent: 'CYBERSHIELD CTF Tournament',
    uploadDate: '2026-08-15',
    dimensions: '1080p 60fps',
    fileSize: '18.5 MB',
    duration: '01:45',
    caption: 'Highlights video of the 8-hour live capture the flag hacking competition.'
  },
  {
    id: 'gal-004',
    title: 'Smart Campus IoT Embedded Prototypes Showcase',
    mediaType: 'image',
    url: '/assets/images/project_iot_smart_campus.jpg',
    thumbnail: '/assets/images/project_iot_smart_campus.jpg',
    associatedEvent: 'Smart Campus & IoT Innovation Showcase',
    uploadDate: '2026-08-10',
    dimensions: '1920 x 1280',
    fileSize: '3.1 MB',
    caption: 'Prototyping connected embedded hardware systems for smart energy and campus automation.'
  },
  {
    id: 'gal-005',
    title: 'Annual ITSA Technical Club Orientation Keynote',
    mediaType: 'image',
    url: '/assets/images/akshat.jpg',
    thumbnail: '/assets/images/akshat.jpg',
    associatedEvent: 'Technospark Club Orientation',
    uploadDate: '2026-07-28',
    dimensions: '1200 x 800',
    fileSize: '950 KB',
    caption: 'Welcome keynote presentation for incoming IT department batch at PCCOE auditorium.'
  },
  {
    id: 'gal-006',
    title: 'Technospark Hackathon Aftermovie & Winner Ceremony',
    mediaType: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: '/assets/images/event_hackathon_banner.jpg',
    associatedEvent: 'TECHNOVA HACKATHON 2026',
    uploadDate: '2026-07-14',
    dimensions: '4K Ultra HD',
    fileSize: '42.0 MB',
    duration: '03:12',
    caption: 'Recap of project pitches, prize distributions, and winner speeches.'
  }
];

// ============================================================================
// 5. ADMIN USERS & ACCESS MANAGEMENT MOCK DATA
// ============================================================================
// PostgreSQL Table: public.admin_users
// Columns: id (bigint identity), name, role, last_active
export const mockAdminUsers = [
  {
    id: 1,
    name: 'Prabodh',
    role: 'Administrator', // 'Administrator' | 'Editor' | 'Viewer'
    last_active: '2026-09-21 14:30:00',
    lastActive: 'Just now'
  },
  {
    id: 2,
    name: 'Akshat Shrivastava',
    role: 'Administrator',
    last_active: '2026-09-21 12:15:00',
    lastActive: '2 hours ago'
  },
  {
    id: 3,
    name: 'Prajyot Tayde',
    role: 'Editor',
    last_active: '2026-09-20 18:40:00',
    lastActive: 'Yesterday'
  },
  {
    id: 4,
    name: 'Rupam Agrawal',
    role: 'Editor',
    last_active: '2026-09-18 10:20:00',
    lastActive: '3 days ago'
  },
  {
    id: 5,
    name: 'Kavita Joshi',
    role: 'Viewer',
    last_active: '2026-08-25 09:00:00',
    lastActive: 'Pending Invite'
  }
];

// ============================================================================
// 6. CURRENT LOGGED-IN ADMIN (PLACEHOLDER)
// ============================================================================
// This user information will eventually come from Supabase Auth:
// const { data: { user } } = await supabase.auth.getUser();
export const currentAdminUser = {
  id: 'usr-001',
  name: 'Prabodh',
  role: 'Administrator',
  email: 'prabodh@technospark.org',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

// ============================================================================
// 7. CLUB SETTINGS MOCK DATA
// ============================================================================
// Future Supabase Table: `site_settings`
export const mockClubSettings = {
  clubName: 'TECHNOSPARK',
  fullName: 'TECHNOSPARK — ITSA TECHNICAL CLUB',
  affiliation: 'Information Technology Students Association (ITSA)',
  institution: 'Pimpri Chinchwad College of Engineering (PCCOE)',
  tagline: 'WHERE IDEAS MEET TECHNOLOGY.',
  contactEmail: 'technospark@pccoepune.org',
  registrationStatus: 'open', // 'open' | 'closed'
  maintenanceMode: false,
  notificationAlerts: true,
  socials: {
    instagram: 'https://instagram.com/technospark_pccoe',
    linkedin: 'https://linkedin.com/company/technospark-itsa',
    github: 'https://github.com/technospark-club'
  }
};
