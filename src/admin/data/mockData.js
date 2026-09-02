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
// 2. EVENTS MOCK DATA
// ============================================================================
// Future Supabase Table: `events`
// Columns: id (uuid), title, category, date, time, venue, status, registration_url, cover_image, description, highlights
export const mockEvents = [
  {
    id: 'evt-001',
    title: 'TECHNOVA HACKATHON 2026',
    category: 'Hackathon',
    date: '2026-10-24',
    startTime: '09:00 AM',
    endTime: '09:00 PM (Next Day)',
    venue: 'PCCOE Campus Tech Hub, Pune',
    status: 'upcoming', // 'upcoming' | 'past' | 'draft'
    registrationLink: 'https://technospark.in/register/technova2026',
    coverImage: '/assets/images/event_hackathon_banner.jpg',
    description: 'The annual 36-hour flagship hackathon bringing student developers together to solve real-world problems in AI, Web3, and IoT.',
    badge: 'Flagship Event',
    attendees: 520,
    highlights: 'Cash prizes over ₹50,000+, 1-on-1 industry mentorship, direct recruiter networking'
  },
  {
    id: 'evt-002',
    title: 'Practical AI & Neural Networks Workshop',
    category: 'Workshop',
    date: '2026-11-12',
    startTime: '02:00 PM',
    endTime: '06:00 PM',
    venue: 'Computing Lab 3 • Hybrid',
    status: 'upcoming',
    registrationLink: 'https://technospark.in/register/ai-workshop',
    coverImage: '/assets/images/project_ai_vision.jpg',
    description: 'Hands-on deep learning workshop where participants build, train, and deploy real-time computer vision models with PyTorch.',
    badge: 'Hands-on Lab',
    attendees: 180,
    highlights: 'End-to-end model training, free GPU compute access, verified certificates'
  },
  {
    id: 'evt-003',
    title: 'CYBERSHIELD CTF Tournament',
    category: 'Competition',
    date: '2026-12-05',
    startTime: '10:00 AM',
    endTime: '06:00 PM',
    venue: 'IT Department Seminar Hall',
    status: 'upcoming',
    registrationLink: 'https://technospark.in/register/cybershield',
    coverImage: '/assets/images/project_cyber_shield.jpg',
    description: 'High-intensity cybersecurity challenge testing web exploitation, reverse engineering, network forensics, and cryptography.',
    badge: 'Competitive',
    attendees: 240,
    highlights: 'Real-world CTF sandbox, vulnerability challenges, security toolkit swag'
  },
  {
    id: 'evt-004',
    title: 'Smart Campus & IoT Innovation Showcase',
    category: 'Seminar',
    date: '2026-08-15',
    startTime: '11:00 AM',
    endTime: '04:00 PM',
    venue: 'Auditorium A • PCCOE',
    status: 'past',
    registrationLink: 'https://technospark.in/events/iot-showcase',
    coverImage: '/assets/images/project_iot_smart_campus.jpg',
    description: 'Exhibition of connected hardware systems, automated campus energy grids, and embedded sensor solutions.',
    badge: 'Completed',
    attendees: 310,
    highlights: '15 student hardware prototypes exhibited, guest keynote from Smart Cities council'
  },
  {
    id: 'evt-005',
    title: 'Web3 & Decentralized Systems Masterclass',
    category: 'Workshop',
    date: '2026-07-20',
    startTime: '03:00 PM',
    endTime: '07:00 PM',
    venue: 'Online via Google Meet',
    status: 'past',
    registrationLink: 'https://technospark.in/events/web3-masterclass',
    coverImage: '/assets/images/project_ai_vision.jpg',
    description: 'Architecting decentralized applications, Solidity smart contracts, and EVM gas optimization techniques.',
    badge: 'Past Masterclass',
    attendees: 195,
    highlights: 'Solidity contracts deployment, IPFS storage integration, code auditing review'
  },
  {
    id: 'evt-006',
    title: 'Cloud Architecture & Kubernetes Sprint',
    category: 'Workshop',
    date: '2027-01-18',
    startTime: '10:00 AM',
    endTime: '03:00 PM',
    venue: 'Main Computer Center',
    status: 'draft',
    registrationLink: 'https://technospark.in/events/k8s-sprint',
    coverImage: '/assets/images/event_hackathon_banner.jpg',
    description: 'Draft outline for microservice deployment, Helm charts, and CI/CD pipelines on GCP and AWS.',
    badge: 'Draft Planning',
    attendees: 0,
    highlights: 'Production cluster configuration, load balancing setup, Prometheus monitoring'
  }
];

// ============================================================================
// 3. ORGANIZERS / TEAM MOCK DATA
// ============================================================================
// Future Supabase Table: `organizers`
// Columns: id (uuid), name, role, bio, image_url, profile_url, display_order, is_active
export const mockOrganizers = [
  {
    id: 'org-001',
    name: 'Akshat Shrivastava',
    role: 'GDGoC Organizer & Lead',
    bio: 'Leads club strategy, technical partnerships, hackathons, and overall community growth at PCCOE.',
    image: '/assets/images/akshat.jpg',
    profile: 'https://linkedin.com/in/akshat-shrivastava',
    displayOrder: 1,
    status: 'active', // 'active' | 'inactive'
    email: 'akshat@technospark.org',
    eventsManaged: 8
  },
  {
    id: 'org-002',
    name: 'Prajyot Tayde',
    role: 'Core Team & Technical Lead',
    bio: 'Architects workshop curriculums, manages cloud infrastructure, and oversees hands-on coding bootcamps.',
    image: '/assets/images/prajyot.jpg',
    profile: 'https://linkedin.com/in/prajyot-tayde',
    displayOrder: 2,
    status: 'active',
    email: 'prajyot@technospark.org',
    eventsManaged: 6
  },
  {
    id: 'org-003',
    name: 'Rupam Agrawal',
    role: 'Execution & Operations Lead',
    bio: 'Coordinates on-ground logistics, venue booking, sponsorship deliverables, and team scheduling.',
    image: '/assets/images/rupam.svg',
    profile: 'https://linkedin.com/in/rupam-agrawal',
    displayOrder: 3,
    status: 'active',
    email: 'rupam@technospark.org',
    eventsManaged: 5
  },
  {
    id: 'org-004',
    name: 'Adarsh Thakare',
    role: 'Web & App Facilitator',
    bio: 'Oversees open source web repositories, portal integrations, and developer hackathon platforms.',
    image: '/assets/images/adarsh.svg',
    profile: 'https://linkedin.com/in/adarsh-thakare',
    displayOrder: 4,
    status: 'active',
    email: 'adarsh@technospark.org',
    eventsManaged: 4
  },
  {
    id: 'org-005',
    name: 'Tanvi Deshmukh',
    role: 'Design & Creative Lead',
    bio: 'Designs brand visuals, social media promotional collateral, and event UI/UX interfaces.',
    image: '/assets/images/akshat.jpg',
    profile: 'https://linkedin.com/in/tanvi-deshmukh',
    displayOrder: 5,
    status: 'active',
    email: 'tanvi@technospark.org',
    eventsManaged: 7
  },
  {
    id: 'org-006',
    name: 'Siddharth Patil',
    role: 'Alumni Advisor',
    bio: 'Previous lead advisor providing industry guest connections and mentoring student projects.',
    image: '/assets/images/prajyot.jpg',
    profile: 'https://linkedin.com/in/siddharth-patil',
    displayOrder: 6,
    status: 'inactive',
    email: 'siddharth.alumni@pccoepune.org',
    eventsManaged: 12
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
// Future Supabase Auth: `auth.users` + custom `profiles` or `user_roles` table.
// Columns: id (uuid), full_name, email, role, avatar_url, status, created_at, last_sign_in_at
export const mockAdminUsers = [
  {
    id: 'usr-001',
    name: 'Prabodh',
    email: 'prabodh@technospark.org',
    role: 'Administrator', // 'Administrator' | 'Editor' | 'Viewer'
    status: 'active', // 'active' | 'pending' | 'suspended'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdDate: '2026-01-10',
    lastActive: 'Just now',
    permissions: ['Full Access', 'Database Write', 'User Management', 'Publishing']
  },
  {
    id: 'usr-002',
    name: 'Akshat Shrivastava',
    email: 'akshat@technospark.org',
    role: 'Administrator',
    status: 'active',
    avatar: '/assets/images/akshat.jpg',
    createdDate: '2026-01-15',
    lastActive: '2 hours ago',
    permissions: ['Full Access', 'Database Write', 'User Management', 'Publishing']
  },
  {
    id: 'usr-003',
    name: 'Prajyot Tayde',
    email: 'prajyot@technospark.org',
    role: 'Editor',
    status: 'active',
    avatar: '/assets/images/prajyot.jpg',
    createdDate: '2026-02-01',
    lastActive: 'Yesterday',
    permissions: ['Events Management', 'Gallery Upload', 'Organizer Edit']
  },
  {
    id: 'usr-004',
    name: 'Rupam Agrawal',
    email: 'rupam@technospark.org',
    role: 'Editor',
    status: 'active',
    avatar: '/assets/images/rupam.svg',
    createdDate: '2026-02-14',
    lastActive: '3 days ago',
    permissions: ['Events Management', 'Gallery Upload']
  },
  {
    id: 'usr-005',
    name: 'Kavita Joshi',
    email: 'kavita.j@pccoepune.org',
    role: 'Viewer',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdDate: '2026-08-25',
    lastActive: 'Pending Invite',
    permissions: ['Read Only View']
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
