// ============================================================================
// ORGANIZER DATA
// ============================================================================
// Add, edit, or remove organizer profiles in this file.
// The Organizers component automatically displays the profiles in a responsive grid.
//
// Properties:
// - id: Unique string or number identifier
// - name: Full name of the organizer
// - role: Designation / department role (e.g. "GDGoC Organizer", "Core Team")
// - image: Path to profile photograph (in public/assets/images/)
// - profile: Link to LinkedIn, GitHub, or personal portfolio (or '#' for placeholder)
//
// How to customize:
// - To change a photo: place the image in public/assets/images/ and update the 'image' path below.
// - To change profile URL: update the 'profile' property with a full URL like "https://linkedin.com/in/username".
// ============================================================================

export const organizers = [
  {
    id: 1,
    name: "Akshat Shrivastava",
    role: "GDGoC Organizer",
    image: "/assets/images/akshat.jpg",
    profile: "https://linkedin.com"
  },
  {
    id: 2,
    name: "Prajyot Tayde",
    role: "Core Team",
    image: "/assets/images/prajyot.jpg",
    profile: "https://linkedin.com"
  },
  {
    id: 3,
    name: "Rupam Agrawal",
    role: "Execution",
    image: "/assets/images/rupam.svg",
    profile: "https://linkedin.com"
  },
  {
    id: 4,
    name: "Adarsh Thakare",
    role: "Web & App Facilitator",
    image: "/assets/images/adarsh.svg",
    profile: "https://linkedin.com"
  }
];
