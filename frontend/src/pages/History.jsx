import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { History as HistoryIcon, Download, FileText, ArrowRight, Trash2 } from 'lucide-react';

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
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Reconciliation History & Reports" />

        <div className="content-body">
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Session History</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>View past reconciliation sessions and download reports</p>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Period</th>
                    <th>Status</th>
                    <th>Matched Pairs</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reconciliations.map((r) => (
                    <tr key={r.id}>
                      <td><strong>{r.name}</strong></td>
                      <td>{r.companyName}</td>
                      <td>{r.periodStart} to {r.periodEnd}</td>
                      <td>
                        <span className={`badge ${r.status === 'COMPLETED' ? 'badge-matched' : 'badge-possible'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>{r.summary?.matchedCount || 0} matched</td>
                      <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => navigate(`/reconcile/${r.id}`)}>
                            <ArrowRight size={14} /> Open
                          </button>
                          <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleDownloadPdf(r.id, r.name)}>
                            <FileText size={14} /> PDF
                          </button>
                          <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleDownloadExcel(r.id, r.name)}>
                            <Download size={14} /> Excel
                          </button>
                          <button className="btn btn-danger" style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDelete(r.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
