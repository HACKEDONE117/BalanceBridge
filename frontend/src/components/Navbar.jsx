import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SidebarContext } from '../context/SidebarContext';
import api from '../services/api';
import { User, LogOut, Shield, Bell, Settings } from 'lucide-react';
import LogoutConfirmModal from './LogoutConfirmModal';

export default function Navbar({ title }) {
  const { user, logout } = useContext(AuthContext);
  const { collapsed, toggleSidebar } = useContext(SidebarContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchPendingCount();
      const interval = setInterval(fetchPendingCount, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchPendingCount = async () => {
    try {
      const res = await api.get('/admin/pending-count');
      setPendingCount(res.data.count || 0);
    } catch (err) {
      console.error('Failed to fetch pending requests count', err);
    }
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login');
  };

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Sarah J.');

  return (
    <header className="topbar" style={{
      background: 'rgba(7, 13, 24, 0.95)',
      borderBottom: '1px solid rgba(200, 155, 60, 0.25)',
      backdropFilter: 'blur(12px)',
      padding: '0.85rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'rgba(15, 26, 48, 0.8)',
            border: '1px solid rgba(200, 155, 60, 0.3)',
            color: 'var(--gold-primary)',
            padding: '0.45rem 0.65rem',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          title={collapsed ? 'Show Side Panel' : 'Hide Side Panel'}
        >
          {/* Hamburger 3-line icon */}
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0"  width="18" height="2" rx="1" fill="currentColor"/>
            <rect x="0" y="6"  width="18" height="2" rx="1" fill="currentColor"/>
            <rect x="0" y="12" width="18" height="2" rx="1" fill="currentColor"/>
          </svg>
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.2px', margin: 0 }}>
          {title || 'Reconciliation Overview'}
        </h2>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Admin Notification Bell */}
        {user?.role === 'ADMIN' && pendingCount > 0 && (
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.8rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
            title="Click to view pending registrations"
          >
            <Bell size={15} className="spinner" style={{ animationDuration: '3s' }} />
            <span><strong>{pendingCount}</strong> Pending</span>
          </button>
        )}

        {/* User Profile Pill (Exact Match to Reference Top Right: [👤 Sarah J.]) */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(15, 26, 48, 0.7)',
            padding: '0.35rem 0.85rem',
            borderRadius: '24px',
            border: '1px solid rgba(200, 155, 60, 0.3)'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(200, 155, 60, 0.2)',
              border: '1px solid var(--gold-primary)',
              color: 'var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={15} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f3f4f6' }}>
              {displayName}
            </span>
          </div>
        )}

        {/* Settings Button (Exact Match to Reference Top Right: [⚙ Settings]) */}
        <button
          onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/dashboard')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            transition: 'color 0.2s'
          }}
          title="Account Settings"
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>

        {/* Logout Button */}
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
          title="Sign out of account"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
}
