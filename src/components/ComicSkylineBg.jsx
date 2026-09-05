import React from 'react';

// ============================================================================
// SPIDERVERSE COMIC SKYLINE BACKGROUND COMPONENT
// ============================================================================
// Renders dynamic, multi-layered moving comic building silhouettes with twilight sky
// gradients, halftone print textures, glowing neon windows, and spiderweb accents
// inspired by Spider-Man Spiderverse comic landscapes.
// ============================================================================

export default function ComicSkylineBg() {
  return (
    <div className="comic-skyline-wrapper" aria-hidden="true">
      {/* Spiderverse Twilight Sky Gradient Background */}
      <div className="comic-sky-gradient" />

      {/* Halftone Comic Book Dot Matrix Overlay */}
      <div className="comic-halftone-overlay" />

      {/* Top Left Spiderweb Accent */}
      <div className="spiderweb-accent top-left">
        <svg viewBox="0 0 200 200" width="180" height="180" fill="none" stroke="currentColor">
          <path d="M0,0 L200,200 M0,0 L200,80 M0,0 L80,200 M0,0 L200,0 M0,0 L0,200" strokeWidth="1.2" stroke="rgba(255, 255, 255, 0.4)" />
          <path d="M30,0 Q30,30 0,30 M60,0 Q60,60 0,60 M100,0 Q100,100 0,100 M150,0 Q150,150 0,150" strokeWidth="1.5" stroke="rgba(0, 240, 255, 0.6)" fill="none" />
          <path d="M45,18 Q35,35 18,45 M85,34 Q65,65 34,85 M125,50 Q95,95 50,125" strokeWidth="1" stroke="rgba(168, 85, 247, 0.5)" fill="none" />
        </svg>
      </div>

      {/* Top Right Spiderweb Accent */}
      <div className="spiderweb-accent top-right">
        <svg viewBox="0 0 200 200" width="180" height="180" fill="none" stroke="currentColor">
          <path d="M200,0 L0,200 M200,0 L0,80 M200,0 L120,200 M200,0 L0,0 M200,0 L200,200" strokeWidth="1.2" stroke="rgba(255, 255, 255, 0.4)" />
          <path d="M170,0 Q170,30 200,30 M140,0 Q140,60 200,60 M100,0 Q100,100 200,100 M50,0 Q50,150 200,150" strokeWidth="1.5" stroke="rgba(0, 240, 255, 0.6)" fill="none" />
        </svg>
      </div>

      {/* Far Background Skyline Layer (Slow Drift) */}
      <div className="skyline-layer far-layer">
        <div className="skyline-track-loop">
          <SkylineSVGFar />
          <SkylineSVGFar />
        </div>
      </div>

      {/* Mid Background Skyline Layer (Medium Speed Drift) */}
      <div className="skyline-layer mid-layer">
        <div className="skyline-track-loop">
          <SkylineSVGPrimary />
          <SkylineSVGPrimary />
        </div>
      </div>

      {/* Near Foreground Building Silhouettes (Faster Drift) */}
      <div className="skyline-layer near-layer">
        <div className="skyline-track-loop">
          <SkylineSVGNear />
          <SkylineSVGNear />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// SVG BUILDING TRACK - FAR LAYER
// ----------------------------------------------------------------------------
function SkylineSVGFar() {
  return (
    <svg className="skyline-svg" viewBox="0 0 1200 400" preserveAspectRatio="none">
      <defs>
        <pattern id="farWindowPattern" width="16" height="24" patternUnits="userSpaceOnUse">
          <rect x="3" y="4" width="4" height="6" fill="rgba(254, 240, 138, 0.6)" />
          <rect x="9" y="4" width="4" height="6" fill="rgba(56, 189, 248, 0.5)" />
          <rect x="3" y="14" width="4" height="6" fill="rgba(192, 132, 252, 0.5)" />
        </pattern>
      </defs>

      {/* Far Silhouettes */}
      <path d="M0,400 L0,180 L40,180 L40,120 L70,120 L70,180 L110,180 L110,400 Z" fill="#1e1b4b" opacity="0.85" />
      <rect x="42" y="125" width="26" height="50" fill="url(#farWindowPattern)" />

      <path d="M110,400 L110,150 L140,110 L170,110 L200,150 L200,400 Z" fill="#2e1065" opacity="0.9" />
      <line x1="155" y1="110" x2="155" y2="70" stroke="#f43f5e" strokeWidth="2" />
      <circle cx="155" cy="70" r="3" fill="#f43f5e" />

      <path d="M200,400 L200,200 L280,200 L280,400 Z" fill="#1e1b4b" opacity="0.8" />
      <rect x="210" y="210" width="60" height="180" fill="url(#farWindowPattern)" />

      <path d="M280,400 L280,100 L320,80 L360,100 L360,400 Z" fill="#3b0764" opacity="0.95" />
      <line x1="320" y1="80" x2="320" y2="40" stroke="#00f0ff" strokeWidth="2" />
      <circle cx="320" cy="40" r="4" fill="#00f0ff" />

      <path d="M360,400 L360,220 L440,220 L440,400 Z" fill="#172554" opacity="0.8" />
      <rect x="370" y="230" width="60" height="150" fill="url(#farWindowPattern)" />

      <path d="M440,400 L440,140 L520,140 L520,400 Z" fill="#2e1065" opacity="0.9" />
      <rect x="450" y="150" width="60" height="230" fill="url(#farWindowPattern)" />

      <path d="M520,400 L520,90 L550,60 L580,90 L580,400 Z" fill="#1e1b4b" opacity="0.85" />
      <line x1="550" y1="60" x2="550" y2="20" stroke="#f43f5e" strokeWidth="2" />
      <circle cx="550" cy="20" r="3" fill="#f43f5e" />

      <path d="M580,400 L580,170 L660,170 L660,400 Z" fill="#3b0764" opacity="0.9" />
      <rect x="590" y="180" width="60" height="200" fill="url(#farWindowPattern)" />

      <path d="M660,400 L660,130 L740,130 L740,400 Z" fill="#172554" opacity="0.85" />
      <rect x="670" y="140" width="60" height="240" fill="url(#farWindowPattern)" />

      <path d="M740,400 L740,110 L800,110 L800,400 Z" fill="#2e1065" opacity="0.9" />
      <path d="M800,400 L800,190 L880,190 L880,400 Z" fill="#1e1b4b" opacity="0.8" />
      <rect x="810" y="200" width="60" height="180" fill="url(#farWindowPattern)" />

      <path d="M880,400 L880,100 L920,70 L960,100 L960,400 Z" fill="#3b0764" opacity="0.95" />
      <line x1="920" y1="70" x2="920" y2="30" stroke="#00f0ff" strokeWidth="2" />
      <circle cx="920" cy="30" r="4" fill="#00f0ff" />

      <path d="M960,400 L960,160 L1060,160 L1060,400 Z" fill="#172554" opacity="0.85" />
      <rect x="975" y="170" width="70" height="210" fill="url(#farWindowPattern)" />

      <path d="M1060,400 L1060,120 L1200,120 L1200,400 Z" fill="#2e1065" opacity="0.9" />
    </svg>
  );
}

// ----------------------------------------------------------------------------
// SVG BUILDING TRACK - PRIMARY MID LAYER
// ----------------------------------------------------------------------------
function SkylineSVGPrimary() {
  return (
    <svg className="skyline-svg" viewBox="0 0 1200 400" preserveAspectRatio="none">
      <defs>
        <pattern id="midCyanWindows" width="20" height="30" patternUnits="userSpaceOnUse">
          <rect x="3" y="5" width="6" height="8" rx="1" fill="#00f0ff" opacity="0.85" />
          <rect x="11" y="5" width="6" height="8" rx="1" fill="#38bdf8" opacity="0.7" />
          <rect x="3" y="18" width="6" height="8" rx="1" fill="#a855f7" opacity="0.8" />
          <rect x="11" y="18" width="6" height="8" rx="1" fill="#f43f5e" opacity="0.65" />
        </pattern>

        <pattern id="midYellowWindows" width="18" height="26" patternUnits="userSpaceOnUse">
          <rect x="3" y="4" width="5" height="7" fill="#fef08a" opacity="0.9" />
          <rect x="10" y="4" width="5" height="7" fill="#fef08a" opacity="0.6" />
          <rect x="3" y="15" width="5" height="7" fill="#00f0ff" opacity="0.85" />
          <rect x="10" y="15" width="5" height="7" fill="#a855f7" opacity="0.75" />
        </pattern>
      </defs>

      {/* Skyscraper 1 */}
      <g>
        <rect x="20" y="100" width="90" height="300" fill="#090d16" stroke="#00f0ff" strokeWidth="1.5" />
        <rect x="30" y="115" width="70" height="270" fill="url(#midCyanWindows)" />
        <line x1="65" y1="100" x2="65" y2="40" stroke="#00f0ff" strokeWidth="2.5" />
        <circle cx="65" cy="40" r="4" fill="#00f0ff" />
      </g>

      {/* Skyscraper 2 - Steeped Tower */}
      <g>
        <path d="M120,400 L120,160 L140,160 L140,120 L160,120 L160,80 L200,80 L200,120 L220,120 L220,160 L240,160 L240,400 Z" fill="#0c1222" stroke="#a855f7" strokeWidth="1.5" />
        <rect x="165" y="90" width="30" height="290" fill="url(#midYellowWindows)" />
        <line x1="180" y1="80" x2="180" y2="25" stroke="#f43f5e" strokeWidth="2" />
        <circle cx="180" cy="25" r="4" fill="#f43f5e" />
      </g>

      {/* Skyscraper 3 */}
      <g>
        <rect x="260" y="150" width="100" height="250" fill="#070a12" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="272" y="165" width="76" height="220" fill="url(#midCyanWindows)" />
      </g>

      {/* Skyscraper 4 - High-Tech Diagonal Spire */}
      <g>
        <path d="M380,400 L380,140 L440,60 L480,60 L480,400 Z" fill="#0f172a" stroke="#00f0ff" strokeWidth="1.5" />
        <rect x="395" y="150" width="70" height="230" fill="url(#midYellowWindows)" />
        <line x1="460" y1="60" x2="460" y2="15" stroke="#00f0ff" strokeWidth="3" />
        <circle cx="460" cy="15" r="5" fill="#00f0ff" />
      </g>

      {/* Skyscraper 5 */}
      <g>
        <rect x="500" y="180" width="85" height="220" fill="#090d16" stroke="#d946ef" strokeWidth="1.5" />
        <rect x="510" y="195" width="65" height="190" fill="url(#midCyanWindows)" />
      </g>

      {/* Skyscraper 6 - Twin Apex Towers */}
      <g>
        <path d="M600,400 L600,110 L630,70 L660,110 L660,400 Z" fill="#0c1222" stroke="#00f0ff" strokeWidth="1.5" />
        <rect x="610" y="120" width="40" height="260" fill="url(#midYellowWindows)" />

        <path d="M670,400 L670,110 L700,70 L730,110 L730,400 Z" fill="#0c1222" stroke="#a855f7" strokeWidth="1.5" />
        <rect x="680" y="120" width="40" height="260" fill="url(#midCyanWindows)" />

        {/* Connecting Skybridge */}
        <rect x="650" y="200" width="30" height="12" fill="#00f0ff" opacity="0.8" />
        <rect x="650" y="280" width="30" height="12" fill="#a855f7" opacity="0.8" />
      </g>

      {/* Skyscraper 7 */}
      <g>
        <rect x="750" y="130" width="110" height="270" fill="#070a12" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="765" y="145" width="80" height="240" fill="url(#midYellowWindows)" />
        <line x1="805" y1="130" x2="805" y2="50" stroke="#f43f5e" strokeWidth="2.5" />
        <circle cx="805" cy="50" r="4" fill="#f43f5e" />
      </g>

      {/* Skyscraper 8 */}
      <g>
        <path d="M880,400 L880,160 L920,110 L960,160 L960,400 Z" fill="#090d16" stroke="#00f0ff" strokeWidth="1.5" />
        <rect x="895" y="170" width="50" height="210" fill="url(#midCyanWindows)" />
      </g>

      {/* Skyscraper 9 */}
      <g>
        <rect x="980" y="90" width="95" height="310" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
        <rect x="992" y="105" width="71" height="280" fill="url(#midYellowWindows)" />
        <line x1="1027" y1="90" x2="1027" y2="30" stroke="#00f0ff" strokeWidth="3" />
        <circle cx="1027" cy="30" r="5" fill="#00f0ff" />
      </g>

      {/* Skyscraper 10 */}
      <g>
        <rect x="1090" y="150" width="90" height="250" fill="#070a12" stroke="#00f0ff" strokeWidth="1.5" />
        <rect x="1100" y="165" width="70" height="220" fill="url(#midCyanWindows)" />
      </g>
    </svg>
  );
}

// ----------------------------------------------------------------------------
// SVG BUILDING TRACK - NEAR FOREGROUND LAYER
// ----------------------------------------------------------------------------
function SkylineSVGNear() {
  return (
    <svg className="skyline-svg" viewBox="0 0 1200 400" preserveAspectRatio="none">
      <defs>
        <pattern id="nearBigWindows" width="24" height="36" patternUnits="userSpaceOnUse">
          <rect x="4" y="6" width="7" height="10" fill="#00f0ff" opacity="0.9" />
          <rect x="13" y="6" width="7" height="10" fill="#a855f7" opacity="0.85" />
          <rect x="4" y="20" width="7" height="10" fill="#fef08a" opacity="0.8" />
          <rect x="13" y="20" width="7" height="10" fill="#f43f5e" opacity="0.75" />
        </pattern>
      </defs>

      {/* Foreground building cutouts at bottom */}
      <path d="M0,400 L0,230 L110,230 L110,400 Z" fill="#030712" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2" />
      <rect x="15" y="245" width="80" height="145" fill="url(#nearBigWindows)" />

      <path d="M130,400 L130,200 L230,200 L230,400 Z" fill="#020617" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
      <rect x="145" y="215" width="70" height="175" fill="url(#nearBigWindows)" />

      <path d="M260,400 L260,250 L380,250 L380,400 Z" fill="#030712" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2" />
      <rect x="275" y="265" width="90" height="125" fill="url(#nearBigWindows)" />

      <path d="M410,400 L410,210 L500,210 L500,400 Z" fill="#020617" stroke="rgba(217, 70, 239, 0.5)" strokeWidth="2" />
      <rect x="425" y="225" width="60" height="165" fill="url(#nearBigWindows)" />

      <path d="M530,400 L530,240 L650,240 L650,400 Z" fill="#030712" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2" />
      <rect x="545" y="255" width="90" height="135" fill="url(#nearBigWindows)" />

      <path d="M680,400 L680,190 L790,190 L790,400 Z" fill="#020617" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
      <rect x="695" y="205" width="80" height="185" fill="url(#nearBigWindows)" />

      <path d="M820,400 L820,230 L930,230 L930,400 Z" fill="#030712" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2" />
      <rect x="835" y="245" width="80" height="145" fill="url(#nearBigWindows)" />

      <path d="M960,400 L960,200 L1080,200 L1080,400 Z" fill="#020617" stroke="rgba(217, 70, 239, 0.5)" strokeWidth="2" />
      <rect x="975" y="215" width="90" height="175" fill="url(#nearBigWindows)" />

      <path d="M1110,400 L1110,240 L1200,240 L1200,400 Z" fill="#030712" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2" />
    </svg>
  );
}
