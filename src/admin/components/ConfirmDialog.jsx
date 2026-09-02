import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

// ============================================================================
// ADMIN CONFIRMATION DIALOG MODAL
// ============================================================================
// Reusable confirmation modal for destructive or critical actions (e.g. Delete).
//
// Props:
// - isOpen: Boolean controlling visibility
// - title: Modal heading (e.g. "Delete Event?")
// - message: Explanatory warning text
// - confirmLabel: Label for confirm button (default: "Delete")
// - cancelLabel: Label for cancel button (default: "Cancel")
// - isDanger: Boolean for styling red destructive button (default: true)
// - onConfirm: Function callback on approval
// - onCancel: Function callback on rejection
// ============================================================================

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action? This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDanger = true,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div 
        className="admin-modal-container" 
        style={{ maxWidth: '440px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isDanger && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={18} />
              </div>
            )}
            <h3 className="admin-modal-title">{title}</h3>
          </div>
          <button className="admin-btn-icon" onClick={onCancel} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-body">
          <p style={{ margin: 0, color: 'var(--admin-text-main)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>

        <div className="admin-modal-footer">
          <button 
            type="button" 
            className="admin-btn admin-btn-secondary" 
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button 
            type="button" 
            className={`admin-btn ${isDanger ? 'admin-btn-danger' : 'admin-btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
