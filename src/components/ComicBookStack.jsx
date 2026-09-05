import React from 'react';

// ============================================================================
// COMIC BOOK STACK SHOWCASE COMPONENT
// ============================================================================
// Recreates the overlapping tilted Spiderverse comic book covers fan layout
// seen at the bottom of the user's reference image!
// ============================================================================

export default function ComicBookStack() {
  const comicCovers = [
    {
      issue: '1ST ALL-NEW COLLECTOR ISSUE!',
      title: 'TECHNOSPARK',
      subtitle: 'MULTIVERSE HACK SPRINT',
      tag: 'COMICS GROUP',
      bgColor: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
      borderColor: '#00f0ff',
      price: '$0.25',
      tilt: '-12deg',
      offsetY: '20px'
    },
    {
      issue: 'SPECIAL 36-HOUR EDITION',
      title: 'SPIDER-VERSE',
      subtitle: 'CODE SPRINT & AI LAB',
      tag: 'MARVEL TECH',
      bgColor: 'linear-gradient(135deg, #854d0e 0%, #dc2626 100%)',
      borderColor: '#fef08a',
      price: '$0.35',
      tilt: '-4deg',
      offsetY: '0px'
    },
    {
      issue: 'LIMITED MULTIVERSE RUN',
      title: 'CYBERSHIELD',
      subtitle: 'DEFCON CTF SHOWDOWN',
      tag: 'SECURITY CTF',
      bgColor: 'linear-gradient(135deg, #581c87 0%, #c026d3 100%)',
      borderColor: '#a855f7',
      price: '$0.50',
      tilt: '6deg',
      offsetY: '15px'
    },
    {
      issue: 'OCTOBER 2026 EDITION',
      title: 'ITSA PCCOER',
      subtitle: 'FUTURE OF ENGINEERING',
      tag: 'OPEN SOURCE',
      bgColor: 'linear-gradient(135deg, #0f172a 0%, #15803d 100%)',
      borderColor: '#22c55e',
      price: '$0.25',
      tilt: '14deg',
      offsetY: '30px'
    }
  ];

  return (
    <div className="comic-stack-container" aria-hidden="true">
      <div className="comic-stack-label">[ // MULTIVERSE COMIC VAULT ]</div>
      <div className="comic-stack-grid">
        {comicCovers.map((cover, idx) => (
          <div
            key={idx}
            className="comic-cover-card"
            style={{
              background: cover.bgColor,
              borderColor: cover.borderColor,
              transform: `rotate(${cover.tilt}) translateY(${cover.offsetY})`
            }}
          >
            {/* Top Comic Group Banner */}
            <div className="comic-cover-header">
              <span className="comic-cover-tag">{cover.tag}</span>
              <span className="comic-cover-price">{cover.price}</span>
            </div>

            {/* Issue Number Badge */}
            <div className="comic-cover-issue">
              <span>{cover.issue}</span>
            </div>

            {/* Main Title Graphics */}
            <div className="comic-cover-title">{cover.title}</div>
            <div className="comic-cover-subtitle">{cover.subtitle}</div>

            {/* Bottom Comic Frame Art Line */}
            <div className="comic-cover-footer">
              <span>APPROVED BY THE CODE AUTHORITY</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
