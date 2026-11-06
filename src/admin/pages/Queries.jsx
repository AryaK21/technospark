import React, { useState, useMemo } from 'react';
import {
  Mail,
  MessageSquare,
  RefreshCw,
  Eye,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  RotateCcw,
  X,
  User,
  AlertTriangle,
  ExternalLink,
  Send
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import { QUERIES_POLICY_SQL } from '../../services/queriesService';

// ============================================================================
// QUERIES ADMIN MANAGEMENT PAGE (/admin/queries)
// ============================================================================
// Features:
// - Latest queries on top (strictly sorted descending by ID)
// - Resolve/Reopen query status (excluded from sidebar badge count once resolved)
// - Interactive Mail reply functionality (Gmail Web, Default Mail app, Copy draft)
// - Filter by All, Pending, or Resolved status
// - Detailed modal view with direct actions
// ============================================================================

export default function Queries({
  queries = [],
  isLoading = false,
  isRlsError = false,
  onRefresh,
  onToggleResolve
}) {
  // Modal states
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [mailQuery, setMailQuery] = useState(null);

  // Mail draft form state
  const [mailRecipient, setMailRecipient] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');
  const [autoResolveOnSend, setAutoResolveOnSend] = useState(true);

  // Copy feedback states
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // 1. Strict Descending Order by ID so the latest query is on top
  const sortedQueries = useMemo(() => {
    return [...queries].sort((a, b) => Number(b.id) - Number(a.id));
  }, [queries]);

  // Counts
  const pendingCount = useMemo(
    () => sortedQueries.filter((q) => !q.resolved).length,
    [sortedQueries]
  );
  const resolvedCount = useMemo(
    () => sortedQueries.filter((q) => q.resolved).length,
    [sortedQueries]
  );

  // Copy helpers
  const handleCopyEmail = (email, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(QUERIES_POLICY_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Open Mail Reply Modal with pre-filled response draft
  const handleOpenMail = (query) => {
    const to = query.email || '';
    const subject = `Re: ${query.subject || 'Technospark Inquiry'}`;
    const name = query.name || 'there';
    const body = `Hi ${name},

Thank you for contacting Technospark at PCCOER, Pune.

Regarding your inquiry:
"${query.message || '(No message content)'}"

[Type your response here...]

Warm regards,
Technospark Coordination Team
Department of Information Technology, PCCOER
technospark.pccoer.it@gmail.com`;

    setMailRecipient(to);
    setMailSubject(subject);
    setMailBody(body);
    setAutoResolveOnSend(!query.resolved);
    setMailQuery(query);
  };

  // Trigger send via Gmail Web Composer
  const handleSendGmail = () => {
    if (!mailRecipient) {
      alert('Recipient email address is required.');
      return;
    }

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      mailRecipient
    )}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    window.open(gmailUrl, '_blank');

    if (autoResolveOnSend && mailQuery && !mailQuery.resolved && onToggleResolve) {
      onToggleResolve(mailQuery.id, false);
    }
    setMailQuery(null);
  };

  // Trigger send via Default System Mail Client (mailto:)
  const handleSendDefaultMail = () => {
    if (!mailRecipient) {
      alert('Recipient email address is required.');
      return;
    }

    const mailtoUrl = `mailto:${encodeURIComponent(mailRecipient)}?subject=${encodeURIComponent(
      mailSubject
    )}&body=${encodeURIComponent(mailBody)}`;
    window.location.href = mailtoUrl;

    if (autoResolveOnSend && mailQuery && !mailQuery.resolved && onToggleResolve) {
      onToggleResolve(mailQuery.id, false);
    }
    setMailQuery(null);
  };

  // Copy Draft Response
  const handleCopyDraft = () => {
    const fullDraft = `To: ${mailRecipient}\nSubject: ${mailSubject}\n\n${mailBody}`;
    navigator.clipboard.writeText(fullDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  // Table Columns Definition
  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (row) => (
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '0.8rem',
            color: 'var(--admin-blue-primary)',
            backgroundColor: 'var(--admin-blue-light)',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            border: '1px solid var(--admin-border-blue)'
          }}
        >
          #{row.id}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) =>
        row.resolved ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              border: '1px solid #86EFAC',
              letterSpacing: '0.03em'
            }}
          >
            <CheckCircle2 size={12} />
            <span>RESOLVED</span>
          </span>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              border: '1px solid #FDE68A',
              letterSpacing: '0.03em'
            }}
          >
            <Clock size={12} />
            <span>PENDING</span>
          </span>
        )
    },
    {
      key: 'name',
      label: 'Sender Name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: row.resolved ? '#F1F5F9' : 'rgba(37, 99, 235, 0.1)',
              color: row.resolved ? '#64748B' : 'var(--admin-blue-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.75rem',
              flexShrink: 0
            }}
          >
            {row.name ? row.name.charAt(0).toUpperCase() : <User size={14} />}
          </div>
          <span style={{ fontWeight: 600, color: 'var(--admin-text-title)' }}>
            {row.name || 'Anonymous'}
          </span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email Address',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Mail size={13} color="var(--admin-sky-blue)" />
          {row.email ? (
            <a
              href={`mailto:${row.email}`}
              style={{
                color: 'var(--admin-blue-primary)',
                textDecoration: 'none',
                fontSize: '0.82rem'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {row.email}
            </a>
          ) : (
            <span style={{ color: 'var(--admin-text-faint)', fontSize: '0.82rem' }}>None</span>
          )}
          {row.email && (
            <button
              type="button"
              className="admin-btn-icon"
              style={{ width: '22px', height: '22px', padding: 0 }}
              title="Copy Email"
              onClick={(e) => handleCopyEmail(row.email, e)}
            >
              {copiedEmail === row.email ? <Check size={11} color="#16A34A" /> : <Copy size={11} />}
            </button>
          )}
        </div>
      )
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (row) => (
        <span
          style={{
            fontWeight: 600,
            fontSize: '0.82rem',
            color: 'var(--admin-text-main)',
            maxWidth: '170px',
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          title={row.subject}
        >
          {row.subject || 'General Inquiry'}
        </span>
      )
    },
    {
      key: 'message',
      label: 'Message',
      render: (row) => (
        <span
          style={{
            fontSize: '0.82rem',
            color: 'var(--admin-text-muted)',
            maxWidth: '220px',
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          title={row.message}
        >
          {row.message || '(Empty message)'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.4rem'
          }}
        >
          {/* Resolve / Reopen Action */}
          {row.resolved ? (
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleResolve) onToggleResolve(row.id, true);
              }}
              title="Reopen inquiry as pending"
            >
              <RotateCcw size={12} />
              <span>Reopen</span>
            </button>
          ) : (
            <button
              type="button"
              className="admin-btn admin-btn-sm"
              style={{
                padding: '0.25rem 0.55rem',
                fontSize: '0.72rem',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                border: '1px solid #86EFAC',
                fontWeight: 600
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleResolve) onToggleResolve(row.id, false);
              }}
              title="Mark this inquiry as resolved"
            >
              <Check size={12} />
              <span>Resolve</span>
            </button>
          )}

          {/* Mail Action */}
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenMail(row);
            }}
            title="Compose email reply"
          >
            <Mail size={12} color="var(--admin-blue-primary)" />
            <span>Reply</span>
          </button>

          {/* View Details Action */}
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedQuery(row);
            }}
            title="View complete message"
          >
            <Eye size={12} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <PageHeader
        title="Public Queries"
        subtitle={`${pendingCount} pending inquiries &bull; ${resolvedCount} resolved (${sortedQueries.length} total)`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {onRefresh && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={onRefresh}
              disabled={isLoading}
              title="Sync queries with Supabase"
            >
              <RefreshCw size={14} className={isLoading ? 'admin-spinner' : ''} />
              <span>{isLoading ? 'Syncing...' : 'Sync'}</span>
            </button>
          )}
        </div>
      </PageHeader>

      {/* RLS Policy Notice */}
      {isRlsError && (
        <div
          style={{
            marginBottom: '1.25rem',
            padding: '1rem',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            color: '#991B1B'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1, fontSize: '0.82rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                Supabase Row Level Security (RLS) is blocking access to public.queries
              </div>
              <p style={{ margin: '0 0 0.5rem 0', color: '#7F1D1D' }}>
                To view queries in the admin panel and allow visitors to send messages, run this in your Supabase SQL Editor:
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <code
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #FECACA',
                    fontFamily: 'monospace',
                    fontSize: '0.78rem'
                  }}
                >
                  ALTER TABLE public.queries DISABLE ROW LEVEL SECURITY;
                </code>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="admin-btn admin-btn-sm"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#334155'
                  }}
                >
                  {copiedSql ? <Check size={12} color="#16A34A" /> : <Copy size={12} />}
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queries Table with Filter Options */}
      <DataTable
        columns={columns}
        data={sortedQueries}
        searchKey={(item, query) =>
          (item.name || '').toLowerCase().includes(query) ||
          (item.email || '').toLowerCase().includes(query) ||
          (item.subject || '').toLowerCase().includes(query) ||
          (item.message || '').toLowerCase().includes(query)
        }
        searchPlaceholder="Search queries by sender name, email, subject, or message..."
        filterOptions={[
          { value: 'pending', label: `Pending Queries (${pendingCount})` },
          { value: 'resolved', label: `Resolved Queries (${resolvedCount})` }
        ]}
        filterKey="status"
        emptyMessage="No queries found matching the selected filter."
      />

      {/* ── 1. View Query Details Modal ────────────────────────────────────── */}
      {selectedQuery && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedQuery(null)}>
          <div
            className="admin-modal-container"
            style={{ maxWidth: '600px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(37, 99, 235, 0.12)',
                    color: 'var(--admin-blue-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MessageSquare size={17} />
                </div>
                <div>
                  <h3 className="admin-modal-title" style={{ margin: 0 }}>
                    Inquiry Details #{selectedQuery.id}
                  </h3>
                  <div style={{ marginTop: '0.2rem' }}>
                    {selectedQuery.resolved ? (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#15803D',
                          backgroundColor: '#DCFCE7',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <CheckCircle2 size={11} /> Resolved
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#B45309',
                          backgroundColor: '#FEF3C7',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Clock size={11} /> Pending Review
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="admin-btn-icon"
                onClick={() => setSelectedQuery(null)}
                aria-label="Close query modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Sender & Email */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  backgroundColor: 'var(--admin-bg-table-header)',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--admin-border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--admin-text-faint)', textTransform: 'uppercase' }}>
                    Sender Name
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--admin-text-title)', marginTop: '0.2rem' }}>
                    {selectedQuery.name || 'Anonymous'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--admin-text-faint)', textTransform: 'uppercase' }}>
                    Email Address
                  </div>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    {selectedQuery.email ? (
                      <a
                        href={`mailto:${selectedQuery.email}`}
                        style={{ color: 'var(--admin-blue-primary)', textDecoration: 'none', fontWeight: 600 }}
                      >
                        {selectedQuery.email}
                      </a>
                    ) : (
                      <span style={{ color: 'var(--admin-text-muted)' }}>Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--admin-text-faint)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Subject
                </div>
                <div
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: 'var(--admin-text-title)',
                    padding: '0.6rem 0.85rem',
                    backgroundColor: 'var(--admin-surface)',
                    border: '1px solid var(--admin-border-subtle)',
                    borderRadius: '6px'
                  }}
                >
                  {selectedQuery.subject || 'General Inquiry'}
                </div>
              </div>

              {/* Message */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--admin-text-faint)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Full Message
                </div>
                <div
                  style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: 'var(--admin-text-main)',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--admin-surface)',
                    border: '1px solid var(--admin-border-subtle)',
                    borderRadius: '6px',
                    whiteSpace: 'pre-wrap',
                    minHeight: '120px',
                    maxHeight: '240px',
                    overflowY: 'auto'
                  }}
                >
                  {selectedQuery.message || '(Empty message)'}
                </div>
              </div>
            </div>

            <div className="admin-modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Resolve/Reopen button inside modal */}
                {selectedQuery.resolved ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => {
                      if (onToggleResolve) onToggleResolve(selectedQuery.id, true);
                      setSelectedQuery((prev) => (prev ? { ...prev, resolved: false, status: 'pending' } : null));
                    }}
                  >
                    <RotateCcw size={13} />
                    <span>Reopen as Pending</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-btn admin-btn-sm"
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      border: '1px solid #86EFAC',
                      fontWeight: 600
                    }}
                    onClick={() => {
                      if (onToggleResolve) onToggleResolve(selectedQuery.id, false);
                      setSelectedQuery((prev) => (prev ? { ...prev, resolved: true, status: 'resolved' } : null));
                    }}
                  >
                    <Check size={13} />
                    <span>Mark as Resolved</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={() => {
                    const q = selectedQuery;
                    setSelectedQuery(null);
                    handleOpenMail(q);
                  }}
                >
                  <Mail size={13} />
                  <span>Reply via Email</span>
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setSelectedQuery(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Interactive Mail Reply Modal ─────────────────────────────────── */}
      {mailQuery && (
        <div className="admin-modal-backdrop" onClick={() => setMailQuery(null)}>
          <div
            className="admin-modal-container"
            style={{ maxWidth: '620px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: 'var(--admin-sky-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Mail size={17} />
                </div>
                <div>
                  <h3 className="admin-modal-title" style={{ margin: 0 }}>
                    Reply to {mailQuery.name || 'Anonymous User'}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-faint)', marginTop: '0.15rem' }}>
                    Inquiry #{mailQuery.id} &bull; {mailQuery.email || 'No email specified'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="admin-btn-icon"
                onClick={() => setMailQuery(null)}
                aria-label="Close mail modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Recipient */}
              <div className="admin-form-group">
                <label className="admin-label">Recipient Email Address</label>
                <input
                  type="email"
                  className="admin-input"
                  value={mailRecipient}
                  onChange={(e) => setMailRecipient(e.target.value)}
                  placeholder="name@domain.com"
                />
              </div>

              {/* Subject */}
              <div className="admin-form-group">
                <label className="admin-label">Subject</label>
                <input
                  type="text"
                  className="admin-input"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  placeholder="Subject line..."
                />
              </div>

              {/* Message Response */}
              <div className="admin-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Response Draft</label>
                  <button
                    type="button"
                    onClick={handleCopyDraft}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedDraft ? '#16A34A' : 'var(--admin-blue-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    {copiedDraft ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedDraft ? 'Copied Draft!' : 'Copy Draft Text'}</span>
                  </button>
                </div>
                <textarea
                  className="admin-input"
                  rows={8}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    resize: 'vertical'
                  }}
                  value={mailBody}
                  onChange={(e) => setMailBody(e.target.value)}
                />
              </div>

              {/* Auto-Resolve Checkbox */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.82rem',
                  color: 'var(--admin-text-main)',
                  cursor: 'pointer',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--admin-bg-table-header)',
                  borderRadius: '6px',
                  border: '1px solid var(--admin-border-subtle)'
                }}
              >
                <input
                  type="checkbox"
                  checked={autoResolveOnSend}
                  onChange={(e) => setAutoResolveOnSend(e.target.checked)}
                  style={{ cursor: 'pointer', accentColor: 'var(--admin-blue-primary)' }}
                />
                <span>Mark this query as <strong>Resolved</strong> upon sending reply</span>
              </label>
            </div>

            <div className="admin-modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => setMailQuery(null)}
              >
                Cancel
              </button>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {/* Default Mail App */}
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={handleSendDefaultMail}
                  title="Open default system mail client (Outlook, Thunderbird, Apple Mail)"
                >
                  <Send size={13} />
                  <span>Default Mail App</span>
                </button>

                {/* Direct Gmail Web Composer */}
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={handleSendGmail}
                  title="Open prefilled response directly in Gmail web browser tab"
                >
                  <ExternalLink size={13} />
                  <span>Open in Gmail (Web)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
