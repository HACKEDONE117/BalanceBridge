import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
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
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="System Administration Panel" />

        <div className="content-body">
          {pendingRequests.length > 0 && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Bell size={20} />
                <span><strong>Action Required:</strong> You have <strong>{pendingRequests.length}</strong> standard user registration request(s) waiting for your approval.</span>
              </div>
              <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }} onClick={() => setActiveTab('pending')}>
                Review Requests
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              style={{
                backgroundColor: activeTab === 'pending' ? 'var(--primary)' : undefined,
                color: activeTab === 'pending' ? '#fff' : undefined,
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
                  padding: '0.1rem 0.4rem',
                  fontSize: '0.7rem',
                  fontWeight: 700
                }}>
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              className="btn btn-secondary"
              style={{ backgroundColor: activeTab === 'users' ? 'var(--primary)' : undefined, color: activeTab === 'users' ? '#fff' : undefined }}
              onClick={() => setActiveTab('users')}
            >
              <Users size={16} /> All Registered Users
            </button>

            <button
              className="btn btn-secondary"
              style={{ backgroundColor: activeTab === 'logs' ? 'var(--primary)' : undefined, color: activeTab === 'logs' ? '#fff' : undefined }}
              onClick={() => setActiveTab('logs')}
            >
              <Activity size={16} /> System Audit Logs
            </button>
          </div>

          {activeTab === 'pending' ? (
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Standard User Registration Requests</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Approve or reject standard accountant user accounts requesting to register under your organization.
                </p>
              </div>

              {pendingRequests.length > 0 ? (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Applicant Name</th>
                        <th>Email Address</th>
                        <th>Role</th>
                        <th>Approval Status</th>
                        <th>Requested Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map((u) => (
                        <tr key={u.id}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td><span className="badge badge-matched">{u.role}</span></td>
                          <td>
                            <span className="badge badge-possible">
                              <Clock size={12} /> Pending Review
                            </span>
                          </td>
                          <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                className="btn btn-primary"
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'var(--success)' }}
                                onClick={() => handleApproveUser(u.id)}
                              >
                                <Check size={14} /> Approve User
                              </button>
                              <button
                                className="btn btn-danger"
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
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
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <UserCheck size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <p>No pending registration requests for your account.</p>
                </div>
              )}
            </div>
          ) : activeTab === 'users' ? (
            <div className="card" style={{ padding: 0 }}>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Approval Status</th>
                      <th>Active Status</th>
                      <th>Registered Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
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
                        <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                        <td>
                          <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleToggleUserStatus(u.id)}>
                            {u.active ? <ToggleRight size={16} color="var(--success)" /> : <ToggleLeft size={16} color="var(--danger)" />}
                            {u.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <div className="table-container">
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
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        <td><strong>{log.userEmail}</strong></td>
                        <td><span className="badge badge-possible">{log.action}</span></td>
                        <td>{log.details}</td>
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
