import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Award,
  ShieldCheck,
  Cpu,
  Briefcase,
  Palette,
  Sparkles,
  Code2
} from 'lucide-react';

// ============================================================================
// LOCAL PROJECT IMPORTS:
// ============================================================================
import gsap from 'gsap';
import { facultyCoordinators, studentBranches } from '../data/organizers';
import OrganizerCard from './OrganizerCard';
import '../styles/team.css';

// ============================================================================
// FALLBACK DEMO DATA (Used automatically in preview or when props aren't passed)
// ============================================================================
const DEFAULT_FACULTY = [
  {
    id: 'fac-1',
    indexNum: '01',
    name: 'DR. ANANYA DESHMUKH',
    role: 'Faculty Convener & Head of Department',
    tag: 'CONVENER',
    accentColor: '#F59E0B',
    linkedin: 'https://linkedin.com',
    email: 'convener@technospark.edu'
  },
  {
    id: 'fac-2',
    indexNum: '02',
    name: 'PROF. RAJESH KULKARNI',
    role: 'Faculty Coordinator & Innovation Mentor',
    tag: 'MENTOR',
    accentColor: '#00F0FF',
    linkedin: 'https://linkedin.com',
    email: 'coordinator@technospark.edu'
  }
];

const DEFAULT_BRANCHES = [
  {
    branchId: 'leadership',
    branchName: 'Executive Leadership Team',
    accentColor: '#F43F5E',
    description:
      'Directing overall chapter strategy, flagship hackathons, institutional partnerships, and cross-division execution.',
    members: [
      {
        id: 'lead-1',
        indexNum: '03',
        name: 'AARAV SHARMA',
        role: 'President',
        tag: 'EXEC LEAD',
        accentColor: '#F43F5E',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
        email: 'president@technospark.edu'
      },
      {
        id: 'lead-2',
        indexNum: '04',
        name: 'ISHITA VERMA',
        role: 'Vice President',
        tag: 'OPERATIONS',
        accentColor: '#00F0FF',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'lead-3',
        indexNum: '05',
        name: 'ROHAN PATIL',
        role: 'General Secretary',
        tag: 'STRATEGY',
        accentColor: '#A855F7',
        linkedin: 'https://linkedin.com'
      }
    ]
  },
  {
    branchId: 'technical',
    branchName: 'Technical & AI Team',
    accentColor: '#00F0FF',
    description:
      'Architecting hackathon problem statements, CTF infrastructure, AI/ML laboratories, and deep-tech workshops.',
    members: [
      {
        id: 'tech-1',
        indexNum: '06',
        name: 'VIKRAMADITYA JOSHI',
        role: 'Technical Head',
        tag: 'AI / SYSTEMS',
        accentColor: '#00F0FF',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'tech-2',
        indexNum: '07',
        name: 'NEHA GUPTA',
        role: 'Cloud & DevSecOps Lead',
        tag: 'INFRA',
        accentColor: '#38BDF8',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      }
    ]
  },
  {
    branchId: 'webdev',
    branchName: 'Web & Multiverse Portal Team',
    accentColor: '#A855F7',
    description:
      'Engineering the 3D WebGL Spider-Verse experience, live event registration portals, and real-time leaderboards.',
    members: [
      {
        id: 'web-1',
        indexNum: '08',
        name: 'SIDDHARTH NAIR',
        role: 'Lead Full-Stack Developer',
        tag: 'THREE.JS / REACT',
        accentColor: '#A855F7',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'web-2',
        indexNum: '09',
        name: 'TANVI MORE',
        role: 'Frontend & Motion Engineer',
        tag: 'GSAP / SHADERS',
        accentColor: '#F43F5E',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      }
    ]
  },
  {
    branchId: 'design',
    branchName: 'Creative & Comic Art Team',
    accentColor: '#F59E0B',
    description:
      'Crafting the Spider-Verse visual identity, halftone print collateral, stage projections, and motion trailers.',
    members: [
      {
        id: 'des-1',
        indexNum: '10',
        name: 'KABIR MEHTA',
        role: 'Creative Director',
        tag: 'ART DIRECTION',
        accentColor: '#F59E0B',
        linkedin: 'https://linkedin.com'
      },
      {
        id: 'des-2',
        indexNum: '11',
        name: 'ANYA CHAWLA',
        role: 'UI/UX & Motion Designer',
        tag: 'VISUALS',
        accentColor: '#00F0FF',
        linkedin: 'https://linkedin.com'
      }
    ]
  },
  {
    branchId: 'operations',
    branchName: 'Operations & Logistics Team',
    accentColor: '#38BDF8',
    description:
      'Managing venue logistics, sponsor relations, speaker hospitality, and 24-hour hackathon floor command.',
    members: [
      {
        id: 'ops-1',
        indexNum: '12',
        name: 'ADITYA SAWANT',
        role: 'Head of Operations',
        tag: 'LOGISTICS',
        accentColor: '#38BDF8',
        linkedin: 'https://linkedin.com'
      }
    ]
  }
];

// Inline fallback card so Organizers.jsx works standalone or with your OrganizerCard
function FallbackOrganizerCard({ organizer = {}, isFaculty = false }) {
  const accentColor = organizer.accentColor || (isFaculty ? '#F59E0B' : '#00F0FF');
  const roleText = organizer.role || organizer.position || 'Team Member';
  const nameText = organizer.Name || organizer.name || 'Team Member';
  const photoUrl = organizer.image || organizer.photo;
  const initials = nameText
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <article
      className={`retro-organizer-card ${isFaculty ? 'retro-organizer-card--faculty' : ''}`}
      style={{ '--card-accent': accentColor }}
    >
      <div className="org-card-top-bar">
        <span className="org-card-Clearance">
          <span className="org-clearance-dot" />
          {isFaculty ? 'FACULTY ARCHITECT' : 'CORE OPERATIVE'}
        </span>
        <span className="org-corner-badge">
          #{organizer.indexNum || (organizer.tag ? organizer.tag.slice(0, 4) : 'TS')}
        </span>
      </div>

      <div className="org-card-inner-body">
        <div className="org-center-avatar-wrap">
          <div className="org-center-avatar-ring">
            {photoUrl ? (
              <img src={photoUrl} alt={nameText} className="org-center-avatar-img" />
            ) : (
              <div className="org-avatar-fallback">{initials}</div>
            )}
          </div>
        </div>

        <h3 className="org-center-name">{nameText}</h3>
        <div className="org-center-divider" />

        <div className="org-center-role-wrap">
          <span className="org-center-role">{roleText}</span>
          {organizer.tag && <span className="org-center-tag-pill">{organizer.tag}</span>}
        </div>

        <div className="org-center-btn-wrap">
          {organizer.linkedin && (
            <a
              href={organizer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="org-view-profile-btn"
            >
              <span>Profile</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ============================================================================
// ORGANIZERS & TEAM COMPONENT — STRUCTURED HIERARCHICAL COMMAND MATRIX
// ============================================================================
export function Organizers({
  facultyData,
  branchesData,
  CardComponent
}) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const facultyRef = useRef(null);
  const branchesRef = useRef(null);

  const activeFaculty =
    facultyData ||
    (facultyCoordinators && facultyCoordinators.length > 0
      ? facultyCoordinators
      : DEFAULT_FACULTY);

  const activeBranches =
    branchesData ||
    (studentBranches && studentBranches.length > 0
      ? studentBranches
      : DEFAULT_BRANCHES);

  const ActiveCard = CardComponent || OrganizerCard || FallbackOrganizerCard;

  const [activeBranch, setActiveBranch] = useState('all');

  const branchIcons = {
    leadership: ShieldCheck,
    technical: Cpu,
    webdev: Code2,
    operations: Briefcase,
    design: Palette,
    advisory: Award
  };

  const branchAccents = {
    leadership: '#F43F5E',
    technical: '#00F0FF',
    webdev: '#A855F7',
    design: '#F59E0B',
    operations: '#38BDF8',
    advisory: '#10B981'
  };

  // Compute live telemetry counts
  const totalStudentMembers = useMemo(
    () => activeBranches.reduce((sum, b) => sum + (b.members ? b.members.length : 0), 0),
    [activeBranches]
  );

  // Filter branches by active division tab
  const filteredBranches = useMemo(() => {
    return activeBranches
      .filter((branch) => activeBranch === 'all' || branch.branchId === activeBranch)
      .filter((branch) => branch.members && branch.members.length > 0);
  }, [activeBranches, activeBranch]);

  // GSAP entrance animation (falls back gracefully if prefers-reduced-motion)
  useEffect(() => {
    const gsapInstance = gsap || window.gsap;
    if (!gsapInstance || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsapInstance.timeline({ defaults: { ease: 'power2.out', duration: 0.6 } });
            if (headerRef.current) {
              tl.fromTo(headerRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 });
            }
            if (facultyRef.current) {
              tl.fromTo(
                facultyRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0 },
                '-=0.3'
              );
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.08 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="organizers"
      ref={sectionRef}
      className="organizers-section"
      aria-label="Technospark Organizers and Team Hierarchy"
    >
      <div className="organizers-container">
        {/* ================================================================ */}
        {/* 1. COMMAND HEADER & TELEMETRY SUMMARY HUD                        */}
        {/* ================================================================ */}
        <div ref={headerRef} className="team-command-header">
          <div className="team-header-copy">
            <span className="section-eyebrow">[ EXECUTIVE LEADERSHIP & TEAM MATRIX ]</span>
            <h2 className="section-title">
              MEET OUR <span className="text-highlight">ORGANIZERS</span>
            </h2>
            <p className="team-header-lead">
              The faculty mentors, core architects, and student division leads powering
              Technospark across engineering, design, and operations.
            </p>
          </div>

          {/* 3-Card Telemetry Summary Strip */}

        </div>

        {/* ================================================================ */}
        {/* 2. LEVEL 01: FACULTY COORDINATORS & MENTORS COMMAND DECK         */}
        {/* ================================================================ */}
        <div ref={facultyRef} className="team-tier-panel">
          <div className="team-tier-banner">
            <div className="team-tier-badge-group">
              <span className="team-tier-code">LEVEL 01 // ADVISORY</span>
              <h3 className="team-tier-heading">FACULTY COORDINATORS & MENTORS</h3>
            </div>
            <span className="team-tier-caption">INSTITUTIONAL GUIDANCE & OVERSIGHT</span>
          </div>

          <div className="team-faculty-grid">
            {activeFaculty.map((fac, idx) => (
              <ActiveCard
                key={fac.id || idx}
                organizer={{
                  ...fac,
                  indexNum: fac.indexNum || String(idx + 1).padStart(2, '0')
                }}
                isFaculty={true}
              />
            ))}
          </div>
        </div>

        {/* ================================================================ */}
        {/* 3. HIERARCHICAL CIRCUIT TREE CONNECTOR                           */}
        {/* ================================================================ */}
        <div className="team-tree-junction" aria-hidden="true">
          <div className="team-trunk-line" />
          <div className="team-trunk-hub">
            <Layers size={15} color="#000000" />
            <span>LEVEL 02 // STUDENT OPERATIONS COUNCIL</span>
          </div>
          <div className="team-trunk-line" />
        </div>

        {/* ================================================================ */}
        {/* 4. INTERACTIVE DIVISION FILTER CONSOLE                           */}
        {/* ================================================================ */}
        <div className="team-control-console">
          <div className="team-branch-filter-tabs" role="tablist" aria-label="Filter by division">
            <button
              type="button"
              role="tab"
              aria-selected={activeBranch === 'all'}
              onClick={() => setActiveBranch('all')}
              className={`team-branch-tab ${activeBranch === 'all' ? 'active' : ''}`}
              style={{ '--tab-accent': '#00F0FF' }}
            >
              <Sparkles size={13} />
              <span>All Divisions</span>
              <span className="team-tab-count">{totalStudentMembers}</span>
            </button>

            {activeBranches.map((branch) => {
              const Icon = branchIcons[branch.branchId] || Layers;
              const isActive = activeBranch === branch.branchId;
              const accent = branch.accentColor || branchAccents[branch.branchId] || '#00F0FF';

              return (
                <button
                  key={branch.branchId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveBranch(branch.branchId)}
                  className={`team-branch-tab ${isActive ? 'active' : ''}`}
                  style={{ '--tab-accent': accent }}
                >
                  <Icon size={13} />
                  <span>{branch.branchName.replace(' Team', '')}</span>
                  <span className="team-tab-count">
                    {branch.members ? branch.members.length : 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================ */}
        {/* 5. LEVEL 02: STUDENT DIVISION DOSSIER CONTAINERS                 */}
        {/* ================================================================ */}
        <div ref={branchesRef} className="team-branches-container">
          {filteredBranches.map((branch, bIdx) => {
            const Icon = branchIcons[branch.branchId] || Layers;
            const branchAccent =
              branch.accentColor || branchAccents[branch.branchId] || '#00F0FF';

            return (
              <div
                key={branch.branchId}
                className="team-branch-card"
                style={{ '--branch-accent': branchAccent }}
              >
                {/* Top Comic Issue Header Strip */}
                <div className="team-branch-header">
                  <div className="team-branch-header-left">
                    <div className="team-branch-icon-stamp">
                      <Icon size={22} />
                    </div>
                    <div className="team-branch-title-block">
                      <span className="team-branch-eyebrow">
                        DIVISION 0{bIdx + 1} // {branch.branchId.toUpperCase()} SECTOR
                      </span>
                      <h3 className="team-branch-name">{branch.branchName}</h3>
                      {branch.description && (
                        <p className="team-branch-description">{branch.description}</p>
                      )}
                    </div>
                  </div>

                  <span className="team-branch-count-badge">
                    {branch.members.length}{' '}
                    {branch.members.length === 1 ? 'OPERATIVE' : 'OPERATIVES'}
                  </span>
                </div>

                {/* Structured Member Trading Cards Grid */}
                <div className="team-branch-members-grid">
                  {branch.members.map((member, mIdx) => (
                    <ActiveCard
                      key={member.id || mIdx}
                      organizer={{
                        accentColor: branchAccent,
                        indexNum: member.indexNum || String(mIdx + 1).padStart(2, '0'),
                        ...member,
                        divisionCode: `${branch.branchId.toUpperCase()} DIV`
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty Division Filter Fallback */}
          {filteredBranches.length === 0 && (
            <div className="team-empty-state">
              <h3 className="team-empty-title">NO OPERATIVES FOUND</h3>
              <p className="team-empty-sub">
                No team members found in the selected division.
              </p>
              <button
                type="button"
                onClick={() => setActiveBranch('all')}
                className="team-branch-tab active"
                style={{ '--tab-accent': '#00F0FF', margin: '0 auto' }}
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Organizers;