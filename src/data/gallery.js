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
    title: "TECHNOVA Hackathon — 36hr Build Sprint",
    category: "Hackathon",
    image: "/assets/images/event_hackathon_banner.jpg",
    caption: "Over 500 student developers collaborating on real-world engineering challenges."
  },
  {
    id: 2,
    title: "Hands-on Deep Learning Vision Lab",
    category: "Workshop",
    image: "/assets/images/project_ai_vision.jpg",
    caption: "Students implementing real-time convolutional neural networks with PyTorch."
  },
  {
    id: 3,
    title: "CYBERSHIELD CTF Tournament",
    category: "Competition",
    image: "/assets/images/project_cyber_shield.jpg",
    caption: "Intense 8-hour capture the flag competition testing cyber defense and cryptography."
  },
  {
    id: 4,
    title: "Smart Campus & IoT Innovation Showcase",
    category: "Exhibition",
    image: "/assets/images/project_iot_smart_campus.jpg",
    caption: "Prototyping connected embedded hardware systems for smart energy and campus automation."
  },
  {
    id: 5,
    title: "Keynote & Tech Seminar at PCCOE",
    category: "Keynote",
    image: "/assets/images/akshat.jpg",
    caption: "Annual technical club orientation and keynote presentation to first and second-year students."
  }
];
