import React from 'react';
import ReactDOM from 'react-dom';
import { LogOut, AlertTriangle, X } from 'lucide-react';

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      zIndex: 99999,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)'
    }}>
      <div className="modal-content" style={{
        maxWidth: '420px',
        width: '90%',
        padding: '2.25rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        margin: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.35rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}
          title="Close Modal"
        >
          <X size={18} />
        </button>

        <div className="logo-badge" style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          margin: '0 auto 1.25rem auto'
        }}>
          <LogOut size={26} style={{ transform: 'translateX(1px)', flexShrink: 0 }} />
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text-main)' }}>
          Confirm Sign Out
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: '1.5' }}>
          Are you sure you want to log out of your <strong>BalanceBridge</strong> account session?
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
            style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}
          >
            <LogOut size={16} /> Yes, Sign Out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
