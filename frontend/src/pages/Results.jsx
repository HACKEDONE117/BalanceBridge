import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Download, Check, X, Info, FileSpreadsheet, FileText, Filter, Search, ArrowLeftRight, Eye } from 'lucide-react';

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recon, setRecon] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Inspector Modal State
  const [inspectorModal, setInspectorModal] = useState({
    isOpen: false,
    match: null,
    accTx: null,
    bankTx: null
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const reconRes = await api.get(`/reconciliations/${id}`);
      setRecon(reconRes.data);

      const txRes = await api.get(`/reconciliations/${id}/transactions`);
      setTransactions(txRes.data);

      const matchRes = await api.get(`/reconciliations/${id}/matches`);
      setMatches(matchRes.data);
    } catch (err) {
      console.error('Failed to load reconciliation data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMatch = async (matchId) => {
    await api.post(`/matches/${matchId}/confirm`);
    if (inspectorModal.isOpen) setInspectorModal({ isOpen: false, match: null, accTx: null, bankTx: null });
    loadData();
  };

  const handleRejectMatch = async (matchId) => {
    await api.post(`/matches/${matchId}/reject`);
    if (inspectorModal.isOpen) setInspectorModal({ isOpen: false, match: null, accTx: null, bankTx: null });
    loadData();
  };

  const handleDownloadPdf = async () => {
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

  const handleDownloadExcel = async () => {
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

  const handleOpenInspector = (tx) => {
    const match = matches.find(m => m.accountingTransactionId === tx.id || m.bankTransactionId === tx.id);
    let accTx = null;
    let bankTx = null;

    if (match) {
      accTx = transactions.find(t => t.id === match.accountingTransactionId);
      bankTx = transactions.find(t => t.id === match.bankTransactionId);
    } else if (tx.matchedPairId) {
      const pairedTx = transactions.find(t => t.id === tx.matchedPairId);
      if (tx.source === 'ACCOUNTING') {
        accTx = tx;
        bankTx = pairedTx;
      } else {
        accTx = pairedTx;
        bankTx = tx;
      }
    } else {
      if (tx.source === 'ACCOUNTING') accTx = tx;
      else bankTx = tx;
    }

    setInspectorModal({
      isOpen: true,
      match,
      accTx,
      bankTx
    });
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'MATCHED' && t.status === 'MATCHED') ||
      (activeTab === 'POSSIBLE_MATCH' && t.status === 'POSSIBLE_MATCH') ||
      (activeTab === 'AMOUNT_MISMATCH' && t.status === 'AMOUNT_MISMATCH') ||
      (activeTab === 'MISSING_IN_BANK' && t.source === 'ACCOUNTING' && t.status === 'UNMATCHED') ||
      (activeTab === 'MISSING_IN_ACCOUNTING' && t.source === 'BANK' && t.status === 'UNMATCHED') ||
      (activeTab === 'DUPLICATE' && t.status === 'DUPLICATE');

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.description.toLowerCase().includes(q) ||
      (t.referenceNumber && t.referenceNumber.toLowerCase().includes(q)) ||
      (t.amount !== undefined && t.amount !== null && t.amount.toString().includes(q));

    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'MATCHED': return <span className="badge badge-matched"><Check size={12} /> Matched</span>;
      case 'POSSIBLE_MATCH': return <span className="badge badge-possible"><Info size={12} /> Possible Match</span>;
      case 'AMOUNT_MISMATCH': return <span className="badge badge-mismatch">Amount Mismatch</span>;
      case 'DUPLICATE': return <span className="badge badge-duplicate">Duplicate</span>;
      default: return <span className="badge badge-unmatched">Unmatched</span>;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title={`Reconciliation Results - ${recon?.name || ''}`} />

        <div className="content-body">
          {/* Header Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{recon?.name}</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Company: <strong>{recon?.companyName}</strong> | Period: {recon?.periodStart} to {recon?.periodEnd}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleDownloadPdf} className="btn btn-secondary">
                <FileText size={16} /> Export PDF Report
              </button>
              <button onClick={handleDownloadExcel} className="btn btn-primary">
                <Download size={16} /> Export Excel Report
              </button>
            </div>
          </div>

          {/* Financial Summary Banner */}
          {recon?.summary && (
            <div>
              {/* Row 1: High Level Totals */}
              <div className="card-grid" style={{ marginBottom: '1rem' }}>
                <div className="card">
                  <div className="stat-label">Accounting Total</div>
                  <div className="stat-value">₹{recon.summary.totalAccountingAmount?.toLocaleString() || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{recon.summary.totalAccountingCount} items</div>
                </div>

                <div className="card">
                  <div className="stat-label">Bank Total</div>
                  <div className="stat-value">₹{recon.summary.totalBankAmount?.toLocaleString() || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{recon.summary.totalBankCount} items</div>
                </div>

                <div className="card">
                  <div className="stat-label">Matched Amount</div>
                  <div className="stat-value" style={{ color: 'var(--success)' }}>₹{recon.summary.matchedAmount?.toLocaleString() || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>{recon.summary.matchedCount} matched pairs</div>
                </div>

                <div className="card">
                  <div className="stat-label">Net Discrepancy</div>
                  <div className="stat-value" style={{ color: recon.summary.differenceAmount === 0 ? 'var(--success)' : 'var(--warning)' }}>
                    ₹{recon.summary.differenceAmount?.toLocaleString() || 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Difference</div>
                </div>
              </div>

              {/* Row 2: Debit & Credit Totals */}
              <div className="card-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="card" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div className="stat-label" style={{ color: '#f87171' }}>Acc. Debit (NAVE) Total</div>
                  <div className="stat-value" style={{ fontSize: '1.25rem' }}>₹{(recon.summary.totalAccountingDebit || 0).toLocaleString()}</div>
                </div>
                <div className="card" style={{ background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                  <div className="stat-label" style={{ color: '#34d399' }}>Acc. Credit (JAMA) Total</div>
                  <div className="stat-value" style={{ fontSize: '1.25rem' }}>₹{(recon.summary.totalAccountingCredit || 0).toLocaleString()}</div>
                </div>
                <div className="card" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div className="stat-label" style={{ color: '#f87171' }}>Bank Debit Total</div>
                  <div className="stat-value" style={{ fontSize: '1.25rem' }}>₹{(recon.summary.totalBankDebit || 0).toLocaleString()}</div>
                </div>
                <div className="card" style={{ background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                  <div className="stat-label" style={{ color: '#34d399' }}>Bank Credit Total</div>
                  <div className="stat-value" style={{ fontSize: '1.25rem' }}>₹{(recon.summary.totalBankCredit || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Items' },
              { id: 'MATCHED', label: `Matched (${recon?.summary?.matchedCount || 0})` },
              { id: 'POSSIBLE_MATCH', label: `Possible Matches (${recon?.summary?.possibleMatchCount || 0})` },
              { id: 'AMOUNT_MISMATCH', label: `Amount Mismatch (${recon?.summary?.amountMismatchCount || 0})` },
              { id: 'MISSING_IN_BANK', label: `Missing in Bank (${recon?.summary?.missingInBankCount || 0})` },
              { id: 'MISSING_IN_ACCOUNTING', label: `Missing in Accounting (${recon?.summary?.missingInAccountingCount || 0})` },
              { id: 'DUPLICATE', label: `Duplicates (${recon?.summary?.duplicateCount || 0})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn btn-secondary"
                style={{
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.8rem',
                  backgroundColor: activeTab === tab.id ? 'var(--primary)' : undefined,
                  color: activeTab === tab.id ? '#fff' : undefined
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Toolbar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <input
                type="text"
                placeholder="Search by description, reference number, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Transaction Workbench Table */}
          <div className="card" style={{ padding: 0 }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount (₹)</th>
                    <th>Type</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Matching Reason / Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => {
                    const match = matches.find(m => m.accountingTransactionId === tx.id || m.bankTransactionId === tx.id);

                    return (
                      <tr key={tx.id}>
                        <td>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: tx.source === 'ACCOUNTING' ? 'var(--primary)' : 'var(--accent)' }}>
                            {tx.source}
                          </span>
                        </td>
                        <td>{tx.transactionDate}</td>
                        <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <strong>{tx.description}</strong>
                        </td>
                        <td><strong>₹{tx.amount?.toLocaleString()}</strong></td>
                        <td>
                          <span style={{ fontSize: '0.75rem', color: tx.transactionType === 'DEBIT' ? '#f87171' : '#34d399' }}>
                            {tx.transactionType}
                          </span>
                        </td>
                        <td>{tx.referenceNumber || '-'}</td>
                        <td>{getStatusBadge(tx.status)}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            {match ? (
                              <div style={{ fontSize: '0.75rem' }}>
                                <div style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '0.2rem' }}>
                                  Score: {match.score}% ({match.matchType})
                                </div>
                                <ul style={{ paddingLeft: '1rem', margin: 0, color: 'var(--text-muted)' }}>
                                  {match.matchReasons?.slice(0, 2).map((r, i) => (
                                    <li key={i}>{r}</li>
                                  ))}
                                </ul>

                                {match.status === 'PENDING' && (
                                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                                    <button className="btn btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }} onClick={() => handleConfirmMatch(match.id)}>
                                      <Check size={12} /> Confirm
                                    </button>
                                    <button className="btn btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }} onClick={() => handleRejectMatch(match.id)}>
                                      <X size={12} /> Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unmatched item</span>
                            )}

                            <button
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', alignSelf: 'flex-start', marginTop: '0.2rem' }}
                              onClick={() => handleOpenInspector(tx)}
                            >
                              <Eye size={12} /> View Matched Pair
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side-by-Side Matched Pair Inspector Modal */}
        {inspectorModal.isOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '850px', width: '90%' }}>
              <div className="modal-header">
                <h3>Matched Transaction Pair Inspector</h3>
                <button className="close-btn" onClick={() => setInspectorModal({ isOpen: false, match: null, accTx: null, bankTx: null })}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                {inspectorModal.match && (
                  <div style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid var(--primary)', padding: '0.8rem', borderRadius: 'var(--radius)', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>
                        Match Confidence Score: {inspectorModal.match.score}% ({inspectorModal.match.matchType})
                      </strong>
                      <span className="badge badge-matched">{inspectorModal.match.status}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong>Breakdown Reasons:</strong>
                      <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem', marginBottom: 0 }}>
                        {inspectorModal.match.matchReasons?.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5rem 1fr', gap: '1rem', alignItems: 'center' }}>
                  {/* Left: Accounting Transaction */}
                  <div className="card" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid var(--primary)' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      Accounting Transaction
                    </h4>
                    {inspectorModal.accTx ? (
                      <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div><strong>Date:</strong> {inspectorModal.accTx.transactionDate}</div>
                        <div><strong>Amount:</strong> <span style={{ color: 'var(--success)', fontWeight: 700 }}>₹{inspectorModal.accTx.amount?.toLocaleString()}</span></div>
                        <div><strong>Type:</strong> {inspectorModal.accTx.transactionType}</div>
                        <div><strong>Reference / UTR:</strong> {inspectorModal.accTx.referenceNumber || 'N/A'}</div>
                        <div><strong>Description:</strong></div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '4px', fontSize: '0.75rem', wordBreak: 'break-word' }}>
                          {inspectorModal.accTx.description}
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>No paired accounting transaction</div>
                    )}
                  </div>

                  {/* Middle Divider Icon */}
                  <div style={{ textAlign: 'center', color: 'var(--primary)' }}>
                    <ArrowLeftRight size={24} />
                  </div>

                  {/* Right: Bank Transaction */}
                  <div className="card" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid var(--accent)' }}>
                    <h4 style={{ color: 'var(--accent)', marginBottom: '0.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      Bank Statement Transaction
                    </h4>
                    {inspectorModal.bankTx ? (
                      <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div><strong>Date:</strong> {inspectorModal.bankTx.transactionDate}</div>
                        <div><strong>Amount:</strong> <span style={{ color: 'var(--success)', fontWeight: 700 }}>₹{inspectorModal.bankTx.amount?.toLocaleString()}</span></div>
                        <div><strong>Type:</strong> {inspectorModal.bankTx.transactionType}</div>
                        <div><strong>Reference / UTR:</strong> {inspectorModal.bankTx.referenceNumber || 'N/A'}</div>
                        <div><strong>Description:</strong></div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '4px', fontSize: '0.75rem', wordBreak: 'break-word' }}>
                          {inspectorModal.bankTx.description}
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>No paired bank transaction</div>
                    )}
                  </div>
                </div>

                {inspectorModal.match && inspectorModal.match.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                    <button className="btn btn-primary" onClick={() => handleConfirmMatch(inspectorModal.match.id)}>
                      <Check size={14} /> Confirm Match
                    </button>
                    <button className="btn btn-danger" onClick={() => handleRejectMatch(inspectorModal.match.id)}>
                      <X size={14} /> Reject Match
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
