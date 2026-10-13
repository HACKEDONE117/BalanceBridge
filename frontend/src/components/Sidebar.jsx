import React, { useContext, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  ListOrdered, 
  BarChart3, 
  Layers, 
  ChevronDown, 
  ChevronRight, 
  PlusCircle, 
  History, 
  Shield, 
  LogOut, 
  FileText
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { SidebarContext } from '../context/SidebarContext';
import LogoutConfirmModal from './LogoutConfirmModal';
import BridgeLogo from './BridgeLogo';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const { collapsed, toggleSidebar } = useContext(SidebarContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Accordion toggle states for expandable menus
  const [openReconciliations, setOpenReconciliations] = useState(
    location.pathname.startsWith('/reconcile') || location.pathname === '/history'
  );
  const [openReports, setOpenReports] = useState(false);
  const [openIntegrations, setOpenIntegrations] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={{
      background: '#070d18',
      borderRight: '1px solid rgba(200, 155, 60, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 20
    }}>
      {/* Top Logo */}
      <div className="logo-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        marginBottom: '2rem',
        paddingLeft: collapsed ? '0' : '0.25rem'
      }}>
        <div 
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <BridgeLogo size={32} showText={!collapsed} subtitle="" />
        </div>
      </div>

      {/* Nav List - Exactly Matching the Reference Image:
          1. 🏠 Dashboard (Gold frame active state)
          2. 💳 Bank Accounts ˅
          3. 📑 Reconciliations ˅ (Expands to New Reconciliation & History/Sessions)
          4. 📊 Reports ˅
          5. ⚙ Integrations ˅
          6. 📋 Activity Log
      */}
      <nav className="nav-links">
        {/* 1. Dashboard */}
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
          title="Dashboard"
        >
          <Home size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ flex: 1 }}>Dashboard</span>}
        </NavLink>

        {/* 3. Reconciliations (Expandable: New Session & History) */}
        <div>
          <button
            type="button"
            className={`nav-item ${location.pathname.startsWith('/reconcile') || location.pathname === '/history' ? 'active' : ''}`}
            onClick={() => !collapsed && setOpenReconciliations(!openReconciliations)}
            title="Reconciliations"
            style={{ justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <ListOrdered size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>Reconciliations</span>}
            </div>
            {!collapsed && (openReconciliations ? <ChevronDown size={15} /> : <ChevronRight size={15} />)}
          </button>
          {!collapsed && openReconciliations && (
            <div className="nav-submenu">
              <NavLink 
                to="/reconcile/new" 
                className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
              >
                <PlusCircle size={13} />
                <span>New Reconciliation</span>
              </NavLink>
              <NavLink 
                to="/history" 
                className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
              >
                <History size={13} />
                <span>History & Sessions</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 4. Reports (Expandable) */}
        <div>
          <button
            type="button"
            className="nav-item"
            onClick={() => !collapsed && setOpenReports(!openReports)}
            title="Reports"
            style={{ justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <BarChart3 size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>Reports</span>}
            </div>
            {!collapsed && (openReports ? <ChevronDown size={15} color="#94a3b8" /> : <ChevronRight size={15} color="#94a3b8" />)}
          </button>
          {!collapsed && openReports && (
            <div className="nav-submenu">
              <NavLink to="/history" className="nav-subitem">
                <FileText size={13} />
                <span>Export Audit Reports</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 5. Integrations (Expandable) */}
        <div>
          <button
            type="button"
            className="nav-item"
            onClick={() => !collapsed && setOpenIntegrations(!openIntegrations)}
            title="Integrations"
            style={{ justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Layers size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>Integrations</span>}
            </div>
            {!collapsed && (openIntegrations ? <ChevronDown size={15} color="#94a3b8" /> : <ChevronRight size={15} color="#94a3b8" />)}
          </button>
          {!collapsed && openIntegrations && (
            <div className="nav-submenu">
              <span className="nav-subitem" style={{ opacity: 0.7, cursor: 'default' }}>
                <span>ERP Connectors</span>
              </span>
              <span className="nav-subitem" style={{ opacity: 0.7, cursor: 'default' }}>
                <span>Accounting Formats</span>
              </span>
            </div>
          )}
        </div>

        {/* Admin Panel (If user is ADMIN) */}
        {user?.role === 'ADMIN' && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
            title="Admin Panel"
            style={{ marginTop: '0.5rem' }}
          >
            <Shield size={18} style={{ flexShrink: 0, color: 'var(--primary)' }} />
            {!collapsed && <span style={{ flex: 1, color: '#f1f5f9' }}>Admin Panel</span>}
          </NavLink>
        )}
      </nav>

      {/* User Info & Logout Footer */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(200, 155, 60, 0.2)' }}>
        {!collapsed && (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', paddingLeft: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Account: <strong style={{ color: '#f1f5f9' }}>{user?.name || user?.email}</strong>
          </div>
        )}
        <button 
          className="btn btn-danger" 
          style={{ width: '100%', justifyContent: 'center', padding: collapsed ? '0.65rem 0' : '0.65rem 1.25rem', fontSize: '0.82rem' }} 
          onClick={() => setShowLogoutConfirm(true)}
          title="Logout"
        >
          <LogOut size={15} style={{ flexShrink: 0 }} />
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
