import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

// ============================================================================
// ADMIN TOAST NOTIFICATION COMPONENT
// ============================================================================
// Provides subtle non-blocking feedback when forms submit or items change.
//
// Props:
// - toast: Object { id, message, type: 'success' | 'error' | 'info' }
// - onClose: Function callback to dismiss
// ============================================================================

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle2 size={18} color="#10b981" />,
    error: <AlertCircle size={18} color="#ef4444" />,
    info: <Info size={18} color="#38bdf8" />
  };

  return (
    <div className={`admin-toast admin-toast-${toast.type || 'info'}`}>
      {icons[toast.type || 'info']}
      <span>{toast.message}</span>
      <button 
        onClick={onClose} 
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--admin-text-muted)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
