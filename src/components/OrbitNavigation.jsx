import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Image, Users, Compass, Send } from 'lucide-react';

// ============================================================================
// ORBIT NAVIGATION COMPONENT (Interactive Globe Control HUD)
// ============================================================================
// Features:
// 1. Tightly frames the 3D Animated World Globe with 5 satellite nodes.
// 2. Eliminates unnecessary dead space between the globe and navigation options.
// 3. Compact, sleek cyber glassmorphic badge styling.
// 4. Directly navigates to the separate pages (/events, /gallery, /team, /about, /contact).
// ============================================================================

export default function OrbitNavigation() {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Calibrated to frame the 3D Globe with Comic Navbar Badges
  const orbitItems = [
    {
      id: 'events',
      title: 'EVENTS',
      path: '/events',
      icon: Calendar,
      angle: 0.18,
      rx: 310,
      ry: 170,
      accentColor: '#EF4444' // Bold Comic Red
    },
    {
      id: 'gallery',
      title: 'GALLERY',
      path: '/gallery',
      icon: Image,
      angle: 1.57,
      rx: 310,
      ry: 170,
      accentColor: '#00F0FF' // Cyber Cyan
    },
    {
      id: 'team',
      title: 'TEAM',
      path: '/team',
      icon: Users,
      angle: 2.96,
      rx: 310,
      ry: 170,
      accentColor: '#A855F7' // Neon Purple
    },
    {
      id: 'about',
      title: 'ABOUT',
      path: '/about',
      icon: Compass,
      angle: 4.05,
      rx: 310,
      ry: 170,
      accentColor: '#38BDF8' // Neon Blue
    },
    {
      id: 'contact',
      title: 'CONTACT',
      path: '/contact',
      icon: Send,
      angle: 5.37,
      rx: 310,
      ry: 170,
      accentColor: '#F59E0B' // Cyber Amber
    }
  ];

  return (
    <div className="orbit-nav-root">
      {/* ── Desktop Elliptical Orbit Container (Framing the Globe) ───────── */}
      <div className="desktop-orbit-container">
        {/* SVG Orbital Track Rings framing the globe */}
        <svg className="orbit-svg-track" aria-hidden="true">
          <ellipse
            cx="50%"
            cy="50%"
            rx="310"
            ry="170"
            fill="none"
            stroke="rgba(0, 240, 255, 0.28)"
            strokeWidth="1.2"
            strokeDasharray="5 7"
          />
          <ellipse
            cx="50%"
            cy="50%"
            rx="295"
            ry="160"
            fill="none"
            stroke="rgba(168, 85, 247, 0.20)"
            strokeWidth="0.9"
          />
        </svg>

        {/* 5 Comic Navbar Badge Satellite Nodes orbiting the globe */}
        {orbitItems.map((item) => {
          const Icon = item.icon;
          const x = Math.cos(item.angle) * item.rx;
          const y = Math.sin(item.angle) * item.ry;
          const isNodeHovered = hoveredNode === item.id;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`orbit-satellite-node comic-nav-badge ${isNodeHovered ? 'node-hovered' : ''}`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                '--node-accent': item.accentColor
              }}
              onMouseEnter={() => setHoveredNode(item.id)}
              onMouseLeave={() => setHoveredNode(null)}
              aria-label={`Go to ${item.title} page`}
            >
              <Icon size={14} className="comic-badge-icon" />
              <span className="comic-badge-label">{item.title}</span>
            </Link>
          );
        })}
      </div>

      {/* ── Mobile / Tablet Compact Orbital Deck (Comic Navbar Badges) ────── */}
      <div className="mobile-orbit-deck">
        {orbitItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className="mobile-orbit-card comic-nav-badge"
              style={{ '--node-accent': item.accentColor }}
            >
              <Icon size={14} className="comic-badge-icon" />
              <span className="comic-badge-label">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
