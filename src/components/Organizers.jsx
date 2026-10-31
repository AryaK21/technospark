import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Award,
  ShieldCheck,
  Cpu,
  Briefcase,
  Palette,
  Sparkles,
  Code2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

// ============================================================================
// LOCAL PROJECT IMPORTS & SERVICES
// ============================================================================
import gsap from 'gsap';
import { getOrganizers } from '../services/organizersService';
import { facultyCoordinators, studentBranches } from '../data/organizers';
import OrganizerCard from './OrganizerCard';
import '../styles/team.css';

// ============================================================================
// CANONICAL TEAM CONFIGURATIONS & METADATA
// ============================================================================
// Standardizes display metadata for team branches from Supabase `organizers.team`
const TEAM_CONFIG = {
  managment: {
    branchId: 'managment',
    branchName: 'Management & Operations Team',
    shortName: 'Management',
    accentColor: '#00F0FF', // neon blue
    icon: Briefcase,
    description:
      'Directing event logistics, venue orchestration, attendee operations, and hackathon stage command.',
    priority: 1
  },
  web: {
    branchId: 'web',
    branchName: 'Web & Multiverse Portal Team',
    shortName: 'Web & Dev',
    accentColor: '#A855F7', // Neon Purple
    icon: Code2,
    description:
      'Engineering the interactive 3D WebGL multiverse experience, real-time registration systems, and digital dashboards.',
    priority: 2
  },
  technical: {
    branchId: 'technical',
    branchName: 'Technical & AI Team',
    shortName: 'Technical',
    accentColor: '#D946EF', // magenta
    icon: Cpu,
    description:
      'Architecting hackathon problem tracks, CTF systems, AI/ML models, and deep-tech workshops.',
    priority: 3
  },
  sponsorship: {
    branchId: 'sponsorship',
    branchName: 'Sponsorship & PR Team',
    shortName: 'Sponsorship',
    accentColor: '#10B981', // Emerald Green
    icon: Award,
    description:
      'Forging corporate alliances, industry sponsorships, community outreach, and institutional partnerships.',
    priority: 4
  },
  'documentation and design': {
    branchId: 'documentation and design',
    branchName: 'Documentation & Design Team',
    shortName: 'Doc & Design',
    accentColor: '#F59E0B', // Cyber Amber
    icon: Palette,
    description:
      'Crafting Spider-Verse graphic aesthetics, stage visual collateral, comic posters, and technical documentation.',
    priority: 5
  },
  'social media': {
    branchId: 'social media',
    branchName: 'Social Media & Outreach Team',
    shortName: 'Social Media',
    accentColor: '#F43F5E', // Hot Pink
    icon: Sparkles,
    description:
      'Amplifying Technospark across the multiverse through viral reels, live event coverage, and community hype.',
    priority: 6
  }
};

/**
 * Normalizes raw role strings from Supabase public.organizers table
 */
function getNormalizedRole(roleStr) {
  if (!roleStr) return 'member';
  const r = roleStr.trim().toLowerCase();
  if (
    r.includes('faculty') ||
    r.includes('coordinator') ||
    r.includes('co-ordinator') ||
    r.includes('convener') ||
    r.includes('mentor')
  ) {
    return 'faculty';
  }
  if (r === 'lead') {
    return 'lead';
  }
  if (r === 'co-lead' || r === 'co lead' || r === 'colead') {
    return 'co-lead';
  }
  if (r === 'head' || r.includes('head')) {
    return 'head';
  }
  if (r === 'member') {
    return 'member';
  }
  return r;
}

/**
 * Normalizes team strings to match canonical keys
 */
function getNormalizedTeamKey(teamStr) {
  if (!teamStr) return 'other';
  const t = teamStr.trim().toLowerCase();
  if (t === 'managment' || t === 'management' || t === 'operations' || t === 'logistics') {
    return 'managment';
  }
  if (t === 'web' || t === 'webdev' || t === 'web development' || t === 'development') {
    return 'web';
  }
  if (t === 'technical' || t === 'tech' || t === 'technical & ai') {
    return 'technical';
  }
  if (t === 'sponsorship' || t === 'sponsors' || t === 'pr') {
    return 'sponsorship';
  }
  if (t.includes('documentation') || t.includes('design') || t === 'creative') {
    return 'documentation and design';
  }
  if (t.includes('social') || t.includes('media')) {
    return 'social media';
  }
  return t;
}

/**
 * Retrieves metadata for a team key with fallback for custom teams
 */
function getTeamMetadata(teamKey) {
  if (TEAM_CONFIG[teamKey]) return TEAM_CONFIG[teamKey];
  const title = teamKey
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    branchId: teamKey,
    branchName: `${title} Team`,
    shortName: title,
    accentColor: '#00F0FF',
    icon: Layers,
    description: `Core operatives powering the ${title} division.`,
    priority: 99
  };
}

/**
 * Builds the hierarchical team structure according to:
 * 1. Role hierarchy:
 *    - Level 01: Faculty Co-ordinator
 *    - Level 02: Executive Leadership (Lead first, then Co-lead)
 *    - Level 03: Team Divisions (when role is head or member)
 * 2. In each team division:
 *    - Organizers with role 'head' placed first
 *    - Organizers with role 'member' placed second
 */
function buildTeamHierarchy(rawOrganizers) {
  const faculty = [];
  const executiveLeads = [];
  const teamGroups = {};

  rawOrganizers.forEach((rawOrg) => {
    const roleKey = getNormalizedRole(rawOrg.role);
    const name = rawOrg.Name || rawOrg.name || 'Operative';
    const photo = rawOrg.image || rawOrg.photo || '/assets/images/akshat.jpg';
    const linkedin = rawOrg.linkedin || rawOrg.profile || '';

    if (roleKey === 'faculty') {
      faculty.push({
        ...rawOrg,
        name,
        role: rawOrg.role || 'Faculty Co-ordinator',
        tag: 'FACULTY ARCHITECT',
        divisionCode: 'FACULTY ARCHITECT',
        accentColor: '#F59E0B',
        image: photo,
        linkedin,
        isFaculty: true
      });
    } else if (roleKey === 'lead' || roleKey === 'co-lead') {
      const isLead = roleKey === 'lead';
      executiveLeads.push({
        ...rawOrg,
        name,
        role: isLead ? 'Club Lead' : 'Club Co-Lead',
        tag: isLead ? 'CLUB LEAD' : 'CO-LEAD',
        divisionCode: 'HIGH COMMAND',
        accentColor: isLead ? '#00F0FF' : '#F43F5E',
        image: photo,
        linkedin,
        _isLead: isLead
      });
    } else {
      // Role is 'head' or 'member' (or general team operative)
      const teamKey = getNormalizedTeamKey(rawOrg.team);
      if (!teamGroups[teamKey]) {
        teamGroups[teamKey] = [];
      }
      const isHead = roleKey === 'head';
      teamGroups[teamKey].push({
        ...rawOrg,
        name,
        role: isHead ? 'Team Head' : rawOrg.role || 'Team Member',
        tag: isHead ? 'TEAM HEAD' : 'CORE MEMBER',
        team: rawOrg.team || teamKey,
        image: photo,
        linkedin,
        _isHead: isHead
      });
    }
  });

  // Sort Faculty alphabetically by name
  faculty.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  // Sort Executive Leads: Lead first, then Co-lead
  executiveLeads.sort((a, b) => {
    if (a._isLead && !b._isLead) return -1;
    if (!a._isLead && b._isLead) return 1;
    return (a.name || '').localeCompare(b.name || '');
  });

  // Build team branches array and sort operatives in each team: head first, then member
  const branches = Object.keys(teamGroups).map((teamKey) => {
    const meta = getTeamMetadata(teamKey);
    const members = teamGroups[teamKey];

    // Priority sorting: head operatives come before members
    members.sort((a, b) => {
      if (a._isHead && !b._isHead) return -1;
      if (!a._isHead && b._isHead) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });

    // Assign card metadata & index numbers
    const membersWithMeta = members.map((m, idx) => ({
      ...m,
      accentColor: meta.accentColor,
      divisionCode: `${meta.shortName.toUpperCase()} DIV`,
      indexNum: String(idx + 1).padStart(2, '0')
    }));

    return {
      ...meta,
      members: membersWithMeta
    };
  });

  // Sort branches by priority
  branches.sort((a, b) => (a.priority || 99) - (b.priority || 99));

  return { faculty, executiveLeads, branches };
}

// ============================================================================
// MAIN FUNCTIONAL ORGANIZERS COMPONENT
// ============================================================================
export function Organizers({
  facultyData,
  branchesData,
  CardComponent
}) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const facultyRef = useRef(null);
  const leadershipRef = useRef(null);
  const branchesRef = useRef(null);

  // Live state from Supabase
  const [organizersList, setOrganizersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeBranch, setActiveBranch] = useState('all');

  const ActiveCard = CardComponent || OrganizerCard;

  // Fetch live organizers from Supabase
  const fetchLiveOrganizers = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const { data, error } = await getOrganizers();
      if (error) {
        console.error('[Organizers] Supabase fetch error:', error);
        setFetchError('Unable to load live team data. Displaying cached records.');
        setOrganizersList([]);
      } else {
        setOrganizersList(data || []);
      }
    } catch (err) {
      console.error('[Organizers] Unexpected error:', err);
      setFetchError('Connection error. Displaying fallback team data.');
      setOrganizersList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveOrganizers();
  }, []);

  // Compute hierarchical structure from live Supabase data (or fallback)
  const { faculty, executiveLeads, branches } = useMemo(() => {
    // If props were explicitly passed, respect them
    if (facultyData || branchesData) {
      return {
        faculty: facultyData || facultyCoordinators || [],
        executiveLeads: [],
        branches: branchesData || studentBranches || []
      };
    }

    // If live Supabase data is available, build hierarchy from it
    if (organizersList && organizersList.length > 0) {
      return buildTeamHierarchy(organizersList);
    }

    // If Supabase returned empty (e.g. before data is seeded), use fallback dataset
    const fallbackFaculty = (facultyCoordinators || []).map((f, idx) => ({
      ...f,
      isFaculty: true,
      indexNum: String(idx + 1).padStart(2, '0')
    }));

    // Extract leadership from studentBranches if available
    let fallbackLeads = [];
    const otherBranches = [];

    (studentBranches || []).forEach((b) => {
      if (b.branchId === 'leadership') {
        fallbackLeads = (b.members || []).map((m, idx) => ({
          ...m,
          divisionCode: 'HIGH COMMAND',
          indexNum: String(idx + 1).padStart(2, '0'),
          _isLead: (m.position || '').toLowerCase().includes('lead')
        }));
        // Sort leads: Lead first, Co-Lead second
        fallbackLeads.sort((a, b) => {
          const aLead = (a.position || '').toLowerCase() === 'lead' ? 1 : 2;
          const bLead = (b.position || '').toLowerCase() === 'lead' ? 1 : 2;
          return aLead - bLead;
        });
      } else {
        // In other branches, sort: Head first, then Member
        const sortedMembers = [...(b.members || [])].sort((a, b) => {
          const aHead = (a.position || '').toLowerCase().includes('head') ? 1 : 2;
          const bHead = (b.position || '').toLowerCase().includes('head') ? 1 : 2;
          return aHead - bHead;
        });
        otherBranches.push({
          ...b,
          members: sortedMembers.map((m, idx) => ({
            ...m,
            divisionCode: `${b.branchName.replace(' Team', '').toUpperCase()} DIV`,
            indexNum: String(idx + 1).padStart(2, '0')
          }))
        });
      }
    });

    return {
      faculty: fallbackFaculty,
      executiveLeads: fallbackLeads,
      branches: otherBranches
    };
  }, [organizersList, facultyData, branchesData]);

  // Telemetry counts for the HUD
  const totalOperativesCount = useMemo(() => {
    const branchOperatives = branches.reduce(
      (sum, b) => sum + (b.members ? b.members.length : 0),
      0
    );
    return faculty.length + executiveLeads.length + branchOperatives;
  }, [faculty, executiveLeads, branches]);

  const coreLeadershipCount = useMemo(() => {
    let headsCount = 0;
    branches.forEach((b) => {
      headsCount += (b.members || []).filter(
        (m) => (m.role || m.position || '').toLowerCase().includes('head')
      ).length;
    });
    return faculty.length + executiveLeads.length + headsCount;
  }, [faculty, executiveLeads, branches]);

  const activeDivisionsCount = branches.length;

  // Filter branches by active division tab
  const filteredBranches = useMemo(() => {
    return branches
      .filter((branch) => activeBranch === 'all' || branch.branchId === activeBranch)
      .filter((branch) => branch.members && branch.members.length > 0);
  }, [branches, activeBranch]);

  // Determine whether Executive Leadership should be shown based on filter
  const showExecutiveLeads = useMemo(() => {
    if (executiveLeads.length === 0) return false;
    return activeBranch === 'all' || activeBranch === 'leadership';
  }, [executiveLeads, activeBranch]);

  // GSAP entrance animation
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
              tl.fromTo(facultyRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, '-=0.3');
            }
            if (leadershipRef.current) {
              tl.fromTo(
                leadershipRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0 },
                '-=0.2'
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
  }, [isLoading]);

  return (
    <section
      id="organizers"
      ref={sectionRef}
      className="organizers-section"
      aria-label="Technospark Organizers and Team"
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
              The faculty mentors, club executive leads, and division operatives powering
              Technospark across management, web engineering, AI, and creative direction.
            </p>
          </div>

          {/* 3-Card Telemetry Summary Strip */}
          <div className="team-telemetry-strip">
            <div className="team-stat-stamp" style={{ '--stamp-accent': '#00F0FF' }}>
              <div className="team-stat-value">{totalOperativesCount}</div>
              <div className="team-stat-label">Total Operatives</div>
            </div>
            <div className="team-stat-stamp" style={{ '--stamp-accent': '#F43F5E' }}>
              <div className="team-stat-value">{coreLeadershipCount}</div>
              <div className="team-stat-label">Core Leads & Heads</div>
            </div>
            <div className="team-stat-stamp" style={{ '--stamp-accent': '#F59E0B' }}>
              <div className="team-stat-value">{activeDivisionsCount}</div>
              <div className="team-stat-label">Active Divisions</div>
            </div>
          </div>
        </div>

        {/* Informational notification if error occurred */}
        {fetchError && (
          <div className="team-error-banner" role="alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={18} color="#F43F5E" />
              <span>{fetchError}</span>
            </div>
            <button
              type="button"
              onClick={fetchLiveOrganizers}
              className="team-error-retry-btn"
            >
              Retry Sync
            </button>
          </div>
        )}

        {/* Loading Spinner State */}
        {isLoading && (
          <div className="team-loading-container">
            <div className="team-loading-spinner" />
            <span className="team-loading-text">
              SYNCING MULTIVERSE OPERATIVES ..
            </span>
          </div>
        )}

        {!isLoading && (
          <>
            {/* ============================================================ */}
            {/* 2. LEVEL 01: FACULTY COORDINATORS & MENTORS COMMAND DECK     */}
            {/* ============================================================ */}
            {faculty.length > 0 && (
              <div ref={facultyRef} className="team-tier-panel">
                <div className="team-tier-banner">
                  <div className="team-tier-badge-group">
                    <span className="team-tier-code">LEVEL 01 // ADVISORY</span>
                    <h3 className="team-tier-heading">FACULTY COORDINATORS & MENTORS</h3>
                  </div>
                  <span className="team-tier-caption">INSTITUTIONAL GUIDANCE & OVERSIGHT</span>
                </div>

                <div className="team-faculty-grid">
                  {faculty.map((fac, idx) => (
                    <ActiveCard
                      key={fac.id || `fac-${idx}`}
                      organizer={{
                        ...fac,
                        indexNum: fac.indexNum || String(idx + 1).padStart(2, '0')
                      }}
                      isFaculty={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Circuit Tree Connector */}
            <div className="team-tree-junction" aria-hidden="true">
              <div className="team-trunk-line" />
              <div className="team-trunk-hub">
                <ShieldCheck size={16} color="#000000" />
                <span>LEVEL 02 // CLUB EXECUTIVE LEADS</span>
              </div>
              <div className="team-trunk-line" />
            </div>

            {/* ============================================================ */}
            {/* 3. LEVEL 02: EXECUTIVE LEADERSHIP (LEAD & CO-LEAD)           */}
            {/* ============================================================ */}
            {showExecutiveLeads && (
              <div
                ref={leadershipRef}
                className="team-tier-panel team-tier-panel--leadership"
              >
                <div className="team-tier-banner">
                  <div className="team-tier-badge-group">
                    <span className="team-tier-code team-tier-code--leadership">
                      LEVEL 02 // HIGH COMMAND
                    </span>
                    <h3 className="team-tier-heading">CLUB EXECUTIVE LEADS</h3>
                  </div>
                  <span className="team-tier-caption team-tier-caption--leadership">
                    CHAPTER STRATEGY & HIGH DIRECTION
                  </span>
                </div>

                <div className="team-faculty-grid">
                  {executiveLeads.map((lead, idx) => (
                    <ActiveCard
                      key={lead.id || `lead-${idx}`}
                      organizer={{
                        ...lead,
                        indexNum: lead.indexNum || String(idx + 1).padStart(2, '0')
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Connector to Student Divisions */}
            <div className="team-tree-junction" aria-hidden="true">
              <div className="team-trunk-line" />
              <div className="team-trunk-hub" style={{ background: '#00F0FF' }}>
                <Layers size={15} color="#000000" />
                <span>LEVEL 03 // STUDENT OPERATIONS DIVISIONS</span>
              </div>
              <div className="team-trunk-line" />
              <div className="team-manifold-bar" />
            </div>

            {/* ============================================================ */}
            {/* 4. INTERACTIVE DIVISION FILTER CONSOLE                       */}
            {/* ============================================================ */}
            <div className="team-control-console">
              <div
                className="team-branch-filter-tabs"
                role="tablist"
                aria-label="Filter by division"
              >
                {/* All Divisions Tab */}
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
                  <span className="team-tab-count">
                    {branches.reduce((sum, b) => sum + (b.members ? b.members.length : 0), 0)}
                  </span>
                </button>

                {/* Division Tabs */}
                {branches.map((branch) => {
                  const Icon = branch.icon || Layers;
                  const isActive = activeBranch === branch.branchId;
                  const accent = branch.accentColor || '#00F0FF';

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
                      <span>{branch.shortName || branch.branchName.replace(' Team', '')}</span>
                      <span className="team-tab-count">
                        {branch.members ? branch.members.length : 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ============================================================ */}
            {/* 5. LEVEL 03: STUDENT DIVISION DOSSIER CONTAINERS             */}
            {/* ============================================================ */}
            <div ref={branchesRef} className="team-branches-container">
              {filteredBranches.map((branch, bIdx) => {
                const Icon = branch.icon || Layers;
                const branchAccent = branch.accentColor || '#00F0FF';

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

                    {/* Structured Member Trading Cards Grid (Heads first, then Members) */}
                    <div className="team-branch-members-grid">
                      {branch.members.map((member, mIdx) => (
                        <ActiveCard
                          key={member.id || `${branch.branchId}-${mIdx}`}
                          organizer={{
                            accentColor: branchAccent,
                            indexNum: member.indexNum || String(mIdx + 1).padStart(2, '0'),
                            ...member
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Empty Division Filter Fallback */}
              {filteredBranches.length === 0 && !showExecutiveLeads && (
                <div className="team-empty-state">
                  <h3 className="team-empty-title">NO OPERATIVES FOUND</h3>
                  <p className="team-empty-sub">
                    No team members registered in the selected division.
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
          </>
        )}
      </div>
    </section>
  );
}

export default Organizers;
