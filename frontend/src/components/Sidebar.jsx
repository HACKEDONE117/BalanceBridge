import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Shield, LogOut, PlusCircle, FileCheck, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { SidebarContext } from '../context/SidebarContext';
import LogoutConfirmModal from './LogoutConfirmModal';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const { collapsed, toggleSidebar } = useContext(SidebarContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-container" style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', marginBottom: '2rem', paddingLeft: collapsed ? '0' : '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="logo-badge" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
            <FileCheck size={22} style={{ transform: 'translateX(1px)', flexShrink: 0 }} />
          </div>
          {!collapsed && (
            <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>
              <span style={{ color: 'var(--logo-balance)' }}>Balance</span>
              <span style={{ color: 'var(--primary)' }}>Bridge</span>
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            padding: '0.25rem',
            borderRadius: '6px'
          }}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      <nav className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Dashboard">
          <LayoutDashboard size={20} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/reconcile/new" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="New Reconciliation">
          <PlusCircle size={20} style={{ flexShrink: 0 }} />
          {!collapsed && <span>New Reconciliation</span>}
        </NavLink>

        <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="History & Reports">
          <History size={20} style={{ flexShrink: 0 }} />
          {!collapsed && <span>History & Reports</span>}
        </NavLink>

        {user?.role === 'ADMIN' && (
          <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Admin Panel">
            <Shield size={20} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Admin Panel</span>}
          </NavLink>
        )}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        {!collapsed && (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', paddingLeft: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Logged in as <strong>{user?.name || user?.email}</strong>
          </div>
        )}
        <button 
          className="btn btn-danger" 
          style={{ width: '100%', justifyContent: 'center', padding: collapsed ? '0.65rem 0' : '0.65rem 1.25rem' }} 
          onClick={() => setShowLogoutConfirm(true)}
          title="Logout"
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
      />
    </aside>
  );
}
