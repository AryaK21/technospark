// ============================================================================
// GALLERY DATA
// ============================================================================
// Add, edit, or remove gallery items in this file.
// The Gallery component renders an asymmetric / editorial photo showcase.
//
// Properties:
// - id: Unique string or number identifier
// - title: Title / caption of the event or activity
// - category: Category tag (e.g. "Hackathon", "Workshop", "Competition", "Community")
// - image: Path to image in public/assets/images/
// - caption: Optional short description for the lightbox modal
//
// How to customize:
// - Add new photos into the public/assets/images/ folder.
// - Add a new object entry to the 'galleryItems' array below.
// ============================================================================

export const galleryItems = [
  {
    id: 1,
    title: "TECHNOVA HACKATHON — 36H BUILD MATRIX",
    category: "[ HACKATHON // ARENA ]",
    image: "/assets/images/event_hackathon_banner.jpg",
    caption: "Over 500 student developers collaborating continuous 36-hour coding sprints on AI and distributed cloud architectures."
  },
  {
    id: 2,
    title: "DEEP LEARNING & TENSOR VISION LAB",
    category: "[ WORKSHOP // AI ]",
    image: "/assets/images/project_ai_vision.jpg",
    caption: "Students constructing and deploying real-time convolutional neural networks using PyTorch on cloud GPU instances."
  },
  {
    id: 3,
    title: "CYBERSHIELD DEFCON CTF SHOWDOWN",
    category: "[ COMPETITION // SEC ]",
    image: "/assets/images/project_cyber_shield.jpg",
    caption: "High-intensity 8-hour capture the flag tournament testing binary reverse engineering, cryptography, and zero-day defense."
  },
  {
    id: 4,
    title: "SMART CAMPUS IoT & HARDWARE INNOVATION",
    category: "[ EXHIBITION // HARDWARE ]",
    image: "/assets/images/project_iot_smart_campus.jpg",
    caption: "Prototyping connected embedded hardware systems for smart energy grids, autonomous sensors, and campus automation."
  },
  {
    id: 5,
    title: "EXECUTIVE TECH KEYNOTE AT PCCOE",
    category: "[ KEYNOTE // LEADERSHIP ]",
    image: "/assets/images/akshat.jpg",
    caption: "Annual technical club orientation and keynote presentation on open-source software engineering roadmaps."
  }
];
