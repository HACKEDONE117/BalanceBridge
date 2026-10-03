import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SidebarContext } from '../context/SidebarContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../services/api';
import { User, LogOut, Shield, Bell, PanelLeftOpen, PanelLeftClose, Sun, Moon } from 'lucide-react';
import LogoutConfirmModal from './LogoutConfirmModal';

export default function Navbar({ title }) {
  const { user, logout } = useContext(AuthContext);
  const { collapsed, toggleSidebar } = useContext(SidebarContext);
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);
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

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            padding: '0.4rem 0.6rem',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}
          title={collapsed ? 'Show Side Panel' : 'Hide Side Panel'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title || 'Financial Reconciliation Engine'}</h2>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: isDark ? '#facc15' : '#ea580c',
            padding: '0.4rem 0.75rem',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
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
            title="Click to view pending standard user registrations"
          >
            <Bell size={16} className="spinner" style={{ animationDuration: '3s' }} />
            <span><strong>{pendingCount}</strong> Pending Requests</span>
          </button>
        )}

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <User size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user.email}</span>
            <span className="badge badge-matched" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', marginLeft: '0.25rem' }}>
              {user.role}
            </span>
          </div>
        )}

        <button 
          className="btn btn-danger" 
          onClick={() => setShowLogoutConfirm(true)}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          title="Sign out of account"
        >
          <LogOut size={15} />
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
