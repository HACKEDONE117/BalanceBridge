import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { PlusCircle, FileCheck, CheckCircle2, AlertTriangle, XCircle, Copy, FileSpreadsheet, ArrowRight, Download } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Dashboard Overview" />

        <div className="content-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Reconciliation Hub</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Automated rule-based financial reconciliation system</p>
            </div>
            <Link to="/reconcile/new" className="btn btn-primary">
              <PlusCircle size={18} />
              New Reconciliation
            </Link>
          </div>

          {/* Sample Data Bar */}
          <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(56,189,248,0.1))', border: '1px solid rgba(56,189,248,0.3)' }}>
            <div>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>⚡ Quick Test Sample Files Available</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Download pre-packaged Excel/CSV test data to verify matching engine features.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a href="/api/sample-data/accounting-excel" className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                <Download size={14} /> Accounting Excel
              </a>
              <a href="/api/sample-data/bank-excel" className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                <Download size={14} /> Bank Excel
              </a>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="card-grid">
            <div className="card stat-card">
              <div>
                <div className="stat-label">Total Reconciliations</div>
                <div className="stat-value">{stats?.totalReconciliations || 0}</div>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)' }}>
                <FileCheck size={24} />
              </div>
            </div>

            <div className="card stat-card">
              <div>
                <div className="stat-label">Matched Transactions</div>
                <div className="stat-value" style={{ color: 'var(--success)' }}>{stats?.matchedTransactions || 0}</div>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                <CheckCircle2 size={24} />
              </div>
            </div>

            <div className="card stat-card">
              <div>
                <div className="stat-label">Unmatched Transactions</div>
                <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats?.unmatchedTransactions || 0}</div>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
                <XCircle size={24} />
              </div>
            </div>

            <div className="card stat-card">
              <div>
                <div className="stat-label">Amount Mismatches</div>
                <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats?.mismatchedTransactions || 0}</div>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
                <AlertTriangle size={24} />
              </div>
            </div>

            <div className="card stat-card">
              <div>
                <div className="stat-label">Duplicates Detected</div>
                <div className="stat-value" style={{ color: 'var(--purple)' }}>{stats?.duplicateTransactions || 0}</div>
              </div>
              <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: 'var(--purple)' }}>
                <Copy size={24} />
              </div>
            </div>
          </div>

          {/* Recent Reconciliations Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Recent Reconciliations</h3>

            {stats?.recentReconciliations && stats.recentReconciliations.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Period</th>
                      <th>Status</th>
                      <th>Matched %</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentReconciliations.map((r) => {
                      const total = (r.summary?.totalAccountingCount || 0) + (r.summary?.totalBankCount || 0);
                      const matched = r.summary?.matchedCount || 0;
                      const percent = total > 0 ? Math.round((matched * 2 / total) * 100) : 0;

                      return (
                        <tr key={r.id}>
                          <td><strong>{r.name}</strong></td>
                          <td>{r.companyName}</td>
                          <td>{r.periodStart} to {r.periodEnd}</td>
                          <td>
                            <span className={`badge ${r.status === 'COMPLETED' ? 'badge-matched' : 'badge-possible'}`}>
                              {r.status}
                            </span>
                          </td>
                          <td>{percent}%</td>
                          <td>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => navigate(`/reconcile/${r.id}`)}>
                              View Results <ArrowRight size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <FileSpreadsheet size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p>No reconciliations created yet.</p>
                <Link to="/reconcile/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Start First Reconciliation
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
