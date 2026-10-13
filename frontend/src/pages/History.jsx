import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BridgeBackground from '../components/BridgeBackground';
import { History as HistoryIcon, Download, FileText, ArrowRight, Trash2, CheckCircle2, Clock } from 'lucide-react';

import MatchRateBarChart from '../components/charts/MatchRateBarChart';

export default function History() {
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/reconciliations');
      setReconciliations(res.data);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reconciliation session?')) {
      await api.delete(`/reconciliations/${id}`);
      fetchHistory();
    }
  };

  const handleDownloadPdf = async (id, name) => {
    try {
      const response = await api.get(`/reconciliations/${id}/report/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Reconciliation-Report-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download PDF report: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDownloadExcel = async (id, name) => {
    try {
      const response = await api.get(`/reconciliations/${id}/report/excel`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Reconciliation-Report-${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download Excel report: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="app-container" style={{ background: '#070d18', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <BridgeBackground />
      <Sidebar />
      <div className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Navbar title="Reconciliation History & Reports" />

        <div className="content-body">
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 600 }}>
              Session Archives & Audits
            </span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.3rem', marginBottom: '0.4rem', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              Reconciliation History
            </h1>
            <p style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.9rem' }}>
              View past reconciliation sessions, inspect discrepancies, and download audit reports.
            </p>
          </div>

          {reconciliations && reconciliations.length > 0 && (
            <div className="card gold-frame" style={{ marginBottom: '1.75rem', background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>Historical Performance & Match Trends</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(200, 155, 60, 0.12)', border: '1px solid rgba(200, 155, 60, 0.3)' }}>
                  {reconciliations.length} Sessions Logged
                </span>
              </div>
              <MatchRateBarChart reconciliations={reconciliations} />
            </div>
          )}

          <div className="card gold-frame" style={{ padding: 0, background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(200, 155, 60, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>All Processed Sessions</h3>
            </div>
            <div className="table-container" style={{ margin: 0, border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Session Name</th>
                    <th>Company</th>
                    <th>Accounting Period</th>
                    <th>Status</th>
                    <th>Matched Pairs</th>
                    <th>Created At</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reconciliations.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        No reconciliation sessions found. Click "New Reconciliation" to process your first set of ledgers.
                      </td>
                    </tr>
                  ) : (
                    reconciliations.map((r) => (
                      <tr key={r.id}>
                        <td><strong style={{ color: '#f8fafc' }}>{r.name}</strong></td>
                        <td style={{ color: '#cbd5e1' }}>{r.companyName}</td>
                        <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{r.periodStart} to {r.periodEnd}</td>
                        <td>
                          <span className={`badge ${r.status === 'COMPLETED' ? 'badge-matched' : 'badge-possible'}`}>
                            {r.status === 'COMPLETED' ? <CheckCircle2 size={12} style={{ marginRight: '4px' }} /> : <Clock size={12} style={{ marginRight: '4px' }} />}
                            {r.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{r.summary?.matchedCount || 0} matched</td>
                        <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderColor: 'rgba(200, 155, 60, 0.35)' }} onClick={() => navigate(`/reconcile/${r.id}`)}>
                              <ArrowRight size={13} /> Open
                            </button>
                            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderColor: 'rgba(200, 155, 60, 0.35)' }} onClick={() => handleDownloadPdf(r.id, r.name)}>
                              <FileText size={13} /> PDF
                            </button>
                            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderColor: 'rgba(200, 155, 60, 0.35)' }} onClick={() => handleDownloadExcel(r.id, r.name)}>
                              <Download size={13} /> Excel
                            </button>
                            <button className="btn btn-danger" style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }} onClick={() => handleDelete(r.id)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
