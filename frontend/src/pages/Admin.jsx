import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BridgeBackground from '../components/BridgeBackground';
import { Shield, Users, Activity, UserCheck, Check, X, ToggleLeft, ToggleRight, Clock, Bell } from 'lucide-react';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchUsers();
    fetchPendingRequests();
    fetchLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await api.get('/admin/pending-requests');
      setPendingRequests(res.data);
    } catch (err) {
      console.error('Failed to load pending requests', err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/audit-logs');
      setAuditLogs(res.data);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    }
  };

  const handleApproveUser = async (id) => {
    try {
      await api.post(`/admin/users/${id}/approve`);
      fetchUsers();
      fetchPendingRequests();
    } catch (err) {
      alert('Failed to approve user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectUser = async (id) => {
    try {
      await api.post(`/admin/users/${id}/reject`);
      fetchUsers();
      fetchPendingRequests();
    } catch (err) {
      alert('Failed to reject user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleUserStatus = async (id) => {
    await api.post(`/admin/users/${id}/toggle-status`);
    fetchUsers();
    fetchPendingRequests();
  };

  return (
    <div className="app-container" style={{ background: '#070d18', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <BridgeBackground />
      <Sidebar />
      <div className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Navbar title="System Administration Panel" />

        <div className="content-body">
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 600 }}>
              Enterprise Governance & Security
            </span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.3rem', marginBottom: '0.4rem', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              System Administration
            </h1>
            <p style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.9rem' }}>
              Manage team access, verify accountant registrations, and audit system reconciliation activities.
            </p>
          </div>

          {pendingRequests.length > 0 && (
            <div className="gold-frame" style={{ background: 'rgba(200, 155, 60, 0.12)', border: '1.5px solid rgba(200, 155, 60, 0.45)', color: '#fef08a', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bell size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem' }}>
                  <strong style={{ color: 'var(--primary)' }}>Action Required:</strong> You have <strong>{pendingRequests.length}</strong> standard user registration request(s) waiting for your approval.
                </span>
              </div>
              <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', fontWeight: 600 }} onClick={() => setActiveTab('pending')}>
                Review Requests
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn"
              style={{
                backgroundColor: activeTab === 'pending' ? 'var(--primary)' : 'rgba(15, 26, 48, 0.75)',
                color: activeTab === 'pending' ? '#070d18' : '#cbd5e1',
                border: activeTab === 'pending' ? '1px solid var(--primary)' : '1px solid rgba(200, 155, 60, 0.3)',
                fontWeight: activeTab === 'pending' ? 700 : 500,
                position: 'relative'
              }}
              onClick={() => setActiveTab('pending')}
            >
              <UserCheck size={16} /> Pending Requests
              {pendingRequests.length > 0 && (
                <span style={{
                  marginLeft: '0.4rem',
                  background: 'var(--danger)',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.7rem',
                  fontWeight: 700
                }}>
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              className="btn"
              style={{
                backgroundColor: activeTab === 'users' ? 'var(--primary)' : 'rgba(15, 26, 48, 0.75)',
                color: activeTab === 'users' ? '#070d18' : '#cbd5e1',
                border: activeTab === 'users' ? '1px solid var(--primary)' : '1px solid rgba(200, 155, 60, 0.3)',
                fontWeight: activeTab === 'users' ? 700 : 500
              }}
              onClick={() => setActiveTab('users')}
            >
              <Users size={16} /> Users Under You ({users.length})
            </button>

            <button
              className="btn"
              style={{
                backgroundColor: activeTab === 'logs' ? 'var(--primary)' : 'rgba(15, 26, 48, 0.75)',
                color: activeTab === 'logs' ? '#070d18' : '#cbd5e1',
                border: activeTab === 'logs' ? '1px solid var(--primary)' : '1px solid rgba(200, 155, 60, 0.3)',
                fontWeight: activeTab === 'logs' ? 700 : 500
              }}
              onClick={() => setActiveTab('logs')}
            >
              <Activity size={16} /> System Audit Logs
            </button>
          </div>

          {activeTab === 'pending' ? (
            <div className="card gold-frame" style={{ padding: 0, background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(200, 155, 60, 0.25)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>Standard User Registration Requests</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.3rem 0 0 0' }}>
                  Approve or reject standard accountant user accounts requesting to register under your organization.
                </p>
              </div>

              {pendingRequests.length > 0 ? (
                <div className="table-container" style={{ margin: 0, border: 'none' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Applicant Name</th>
                        <th>Email Address</th>
                        <th>Role</th>
                        <th>Approval Status</th>
                        <th>Requested Date</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map((u) => (
                        <tr key={u.id}>
                          <td><strong style={{ color: '#f8fafc' }}>{u.name}</strong></td>
                          <td style={{ color: '#cbd5e1' }}>{u.email}</td>
                          <td><span className="badge badge-matched">{u.role}</span></td>
                          <td>
                            <span className="badge badge-possible">
                              <Clock size={12} style={{ marginRight: '4px' }} /> Pending Review
                            </span>
                          </td>
                          <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button
                                className="btn btn-primary"
                                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: 'var(--success)', border: 'none' }}
                                onClick={() => handleApproveUser(u.id)}
                              >
                                <Check size={14} /> Approve User
                              </button>
                              <button
                                className="btn btn-danger"
                                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                onClick={() => handleRejectUser(u.id)}
                              >
                                <X size={14} /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8' }}>
                  <UserCheck size={48} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--primary)' }} />
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>No pending registration requests for your account.</p>
                </div>
              )}
            </div>
          ) : activeTab === 'users' ? (
            <div className="card gold-frame" style={{ padding: 0, background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(200, 155, 60, 0.25)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>Users Working Under You</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.3rem 0 0 0' }}>
                  Manage standard accountant users who registered under your administrator account.
                </p>
              </div>
              {users.length > 0 ? (
                <div className="table-container" style={{ margin: 0, border: 'none' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Approval Status</th>
                        <th>Active Status</th>
                        <th>Registered Date</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td><strong style={{ color: '#f8fafc' }}>{u.name}</strong></td>
                          <td style={{ color: '#cbd5e1' }}>{u.email}</td>
                          <td><span className="badge badge-matched">{u.role}</span></td>
                          <td>
                            <span className={`badge ${u.approvalStatus === 'APPROVED' ? 'badge-matched' : u.approvalStatus === 'REJECTED' ? 'badge-unmatched' : 'badge-possible'}`}>
                              {u.approvalStatus || (u.active ? 'APPROVED' : 'PENDING')}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${u.active ? 'badge-matched' : 'badge-unmatched'}`}>
                              {u.active ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderColor: 'rgba(200, 155, 60, 0.35)' }} onClick={() => handleToggleUserStatus(u.id)}>
                              {u.active ? <ToggleRight size={16} color="var(--success)" /> : <ToggleLeft size={16} color="var(--danger)" />}
                              {u.active ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8' }}>
                  <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--primary)' }} />
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>No Team Users Registered Under You Yet</p>
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                    When standard users register choosing your Administrator Name or Email, they will appear here for management.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="card gold-frame" style={{ padding: 0, background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(200, 155, 60, 0.25)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>System Audit Logs</h3>
              </div>
              <div className="table-container" style={{ margin: 0, border: 'none' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>User Email</th>
                      <th>Action</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                        <td><strong style={{ color: '#f8fafc' }}>{log.userEmail}</strong></td>
                        <td><span className="badge badge-possible">{log.action}</span></td>
                        <td style={{ color: '#cbd5e1' }}>{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
