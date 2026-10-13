import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BridgeBackground from '../components/BridgeBackground';
import { Download, Check, X, Info, FileSpreadsheet, FileText, Filter, Search, ArrowLeftRight, Eye, CheckCircle2 } from 'lucide-react';

import StatusDonutChart from '../components/charts/StatusDonutChart';
import DebitCreditBalanceChart from '../components/charts/DebitCreditBalanceChart';

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
    <div className="app-container" style={{ background: '#070d18', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <BridgeBackground />
      <Sidebar />
      <div className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Navbar title={`Reconciliation Results - ${recon?.name || ''}`} />

        <div className="content-body">
          {/* Header Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 600 }}>
                Automated Ledger Verification
              </span>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.3rem', marginBottom: '0.3rem', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                {recon?.name || 'Reconciliation Session'}
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'rgba(148, 163, 184, 0.9)' }}>
                Entity: <strong style={{ color: 'var(--primary)' }}>{recon?.companyName}</strong> | Period: {recon?.periodStart} to {recon?.periodEnd}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleDownloadPdf} className="btn btn-secondary" style={{ borderColor: 'rgba(200, 155, 60, 0.35)' }}>
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
              <div className="card-grid" style={{ marginBottom: '1.25rem' }}>
                <div className="card gold-frame" style={{ background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)' }}>
                  <div className="stat-label">Accounting Total</div>
                  <div className="stat-value" style={{ color: '#f8fafc' }}>₹{recon.summary.totalAccountingAmount?.toLocaleString() || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(148, 163, 184, 0.8)' }}>{recon.summary.totalAccountingCount} items</div>
                </div>

                <div className="card gold-frame" style={{ background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)' }}>
                  <div className="stat-label">Bank Total</div>
                  <div className="stat-value" style={{ color: '#f8fafc' }}>₹{recon.summary.totalBankAmount?.toLocaleString() || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(148, 163, 184, 0.8)' }}>{recon.summary.totalBankCount} items</div>
                </div>

                <div className="card gold-frame" style={{ background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)' }}>
                  <div className="stat-label">Matched Amount</div>
                  <div className="stat-value" style={{ color: 'var(--primary)' }}>₹{recon.summary.matchedAmount?.toLocaleString() || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{recon.summary.matchedCount} matched pairs</div>
                </div>

                <div className="card gold-frame" style={{ background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)' }}>
                  <div className="stat-label">Net Discrepancy</div>
                  <div className="stat-value" style={{ color: recon.summary.differenceAmount === 0 ? 'var(--success)' : 'var(--warning)' }}>
                    ₹{recon.summary.differenceAmount?.toLocaleString() || 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(148, 163, 184, 0.8)' }}>Difference</div>
                </div>
              </div>

              {/* Row 2: Debit & Credit Totals */}
              <div className="card-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="card gold-frame" style={{ background: 'rgba(239, 68, 68, 0.08)', backdropFilter: 'blur(16px)' }}>
                  <div className="stat-label" style={{ color: '#f87171' }}>Acc. Debit (NAVE) Total</div>
                  <div className="stat-value" style={{ fontSize: '1.25rem', color: '#f8fafc' }}>₹{(recon.summary.totalAccountingDebit || 0).toLocaleString()}</div>
                </div>
                <div className="card gold-frame" style={{ background: 'rgba(52, 211, 153, 0.08)', backdropFilter: 'blur(16px)' }}>
                  <div className="stat-label" style={{ color: '#34d399' }}>Acc. Credit (JAMA) Total</div>
                  <div className="stat-value" style={{ fontSize: '1.25rem', color: '#f8fafc' }}>₹{(recon.summary.totalAccountingCredit || 0).toLocaleString()}</div>
                </div>
                <div className="card gold-frame" style={{ background: 'rgba(239, 68, 68, 0.08)', backdropFilter: 'blur(16px)' }}>
                  <div className="stat-label" style={{ color: '#f87171' }}>Bank Debit Total</div>
                  <div className="stat-value" style={{ fontSize: '1.25rem', color: '#f8fafc' }}>₹{(recon.summary.totalBankDebit || 0).toLocaleString()}</div>
                </div>
                <div className="card gold-frame" style={{ background: 'rgba(52, 211, 153, 0.08)', backdropFilter: 'blur(16px)' }}>
                  <div className="stat-label" style={{ color: '#34d399' }}>Bank Credit Total</div>
                  <div className="stat-value" style={{ fontSize: '1.25rem', color: '#f8fafc' }}>₹{(recon.summary.totalBankCredit || 0).toLocaleString()}</div>
                </div>
              </div>

              {/* Row 3: Visual Analytics Graphs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="card gold-frame" style={{ background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Report Status Distribution
                  </h4>
                  <StatusDonutChart
                    matched={recon.summary.matchedCount || 0}
                    possible={recon.summary.possibleMatchCount || 0}
                    unmatched={(recon.summary.missingInBankCount || 0) + (recon.summary.missingInAccountingCount || 0)}
                    duplicate={recon.summary.duplicateCount || 0}
                    mismatch={recon.summary.amountMismatchCount || 0}
                  />
                </div>

                <div className="card gold-frame" style={{ background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)' }}>
                  <DebitCreditBalanceChart summary={recon.summary} />
                </div>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(200, 155, 60, 0.25)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
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
                className="btn"
                style={{
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.85rem',
                  backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'rgba(15, 26, 48, 0.75)',
                  color: activeTab === tab.id ? '#070d18' : '#cbd5e1',
                  border: activeTab === tab.id ? '1px solid var(--primary)' : '1px solid rgba(200, 155, 60, 0.3)',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  borderRadius: '20px'
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
                placeholder="Search by narration, vendor, UTR reference number, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'rgba(15, 26, 48, 0.8)', borderColor: 'rgba(200, 155, 60, 0.4)' }}
              />
            </div>
          </div>

          {/* Transaction Workbench Table */}
          <div className="card gold-frame" style={{ padding: 0, background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)', overflow: 'hidden' }}>
            <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid rgba(200, 155, 60, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                Transaction Reconciliation Ledger ({filteredTransactions.length} items)
              </h3>
            </div>
            <div className="table-container" style={{ margin: 0, border: 'none' }}>
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
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        No transactions found for the selected filter or search query.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const match = matches.find(m => m.accountingTransactionId === tx.id || m.bankTransactionId === tx.id);

                      return (
                        <tr key={tx.id}>
                          <td>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: tx.source === 'ACCOUNTING' ? 'var(--primary)' : '#38bdf8' }}>
                              {tx.source}
                            </span>
                          </td>
                          <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{tx.transactionDate}</td>
                          <td style={{ maxWidth: '260px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <strong style={{ color: '#f8fafc' }}>{tx.description}</strong>
                          </td>
                          <td><strong style={{ color: '#f8fafc' }}>₹{tx.amount?.toLocaleString()}</strong></td>
                          <td>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: tx.transactionType === 'DEBIT' ? '#f87171' : '#34d399' }}>
                              {tx.transactionType}
                            </span>
                          </td>
                          <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{tx.referenceNumber || '-'}</td>
                          <td>{getStatusBadge(tx.status)}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                              {match ? (
                                <div style={{ fontSize: '0.75rem' }}>
                                  <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.2rem' }}>
                                    Score: {match.score}% ({match.matchType})
                                  </div>
                                  <ul style={{ paddingLeft: '1rem', margin: 0, color: '#94a3b8' }}>
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
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Unmatched item</span>
                              )}

                              <button
                                className="btn btn-secondary"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', alignSelf: 'flex-start', marginTop: '0.2rem', borderColor: 'rgba(200, 155, 60, 0.35)' }}
                                onClick={() => handleOpenInspector(tx)}
                              >
                                <Eye size={12} /> View Matched Pair
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side-by-Side Matched Pair Inspector Modal */}
        {inspectorModal.isOpen && (
          <div className="modal-overlay">
            <div className="modal-content gold-frame" style={{ maxWidth: '850px', width: '90%', background: '#0a1220', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(200, 155, 60, 0.6)' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid rgba(200, 155, 60, 0.3)' }}>
                <h3 style={{ color: '#f8fafc', fontWeight: 700, margin: 0 }}>Matched Transaction Pair Inspector</h3>
                <button className="close-btn" onClick={() => setInspectorModal({ isOpen: false, match: null, accTx: null, bankTx: null })}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: '1.5rem' }}>
                {inspectorModal.match && (
                  <div style={{ background: 'rgba(200, 155, 60, 0.1)', border: '1px solid rgba(200, 155, 60, 0.4)', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>
                        Match Confidence Score: {inspectorModal.match.score}% ({inspectorModal.match.matchType})
                      </strong>
                      <span className="badge badge-matched">{inspectorModal.match.status}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                      <strong style={{ color: 'var(--primary)' }}>Breakdown Reasons:</strong>
                      <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem', marginBottom: 0, color: '#94a3b8' }}>
                        {inspectorModal.match.matchReasons?.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2rem 1fr', gap: '1rem', alignItems: 'center' }}>
                  {/* Left: Accounting Transaction */}
                  <div className="card gold-frame" style={{ background: 'rgba(15, 26, 48, 0.85)', border: '1px solid rgba(200, 155, 60, 0.4)' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      Accounting Transaction
                    </h4>
                    {inspectorModal.accTx ? (
                      <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ color: '#cbd5e1' }}><strong>Date:</strong> {inspectorModal.accTx.transactionDate}</div>
                        <div style={{ color: '#cbd5e1' }}><strong>Amount:</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{inspectorModal.accTx.amount?.toLocaleString()}</span></div>
                        <div style={{ color: '#cbd5e1' }}><strong>Type:</strong> {inspectorModal.accTx.transactionType}</div>
                        <div style={{ color: '#cbd5e1' }}><strong>Reference / UTR:</strong> {inspectorModal.accTx.referenceNumber || 'N/A'}</div>
                        <div style={{ color: '#cbd5e1' }}><strong>Description:</strong></div>
                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.75rem', wordBreak: 'break-word', color: '#e2e8f0' }}>
                          {inspectorModal.accTx.description}
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>No paired accounting transaction</div>
                    )}
                  </div>

                  {/* Middle Divider Icon */}
                  <div style={{ textAlign: 'center', color: 'var(--primary)' }}>
                    <ArrowLeftRight size={24} />
                  </div>

                  {/* Right: Bank Transaction */}
                  <div className="card gold-frame" style={{ background: 'rgba(15, 26, 48, 0.85)', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                    <h4 style={{ color: '#38bdf8', marginBottom: '0.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      Bank Statement Transaction
                    </h4>
                    {inspectorModal.bankTx ? (
                      <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ color: '#cbd5e1' }}><strong>Date:</strong> {inspectorModal.bankTx.transactionDate}</div>
                        <div style={{ color: '#cbd5e1' }}><strong>Amount:</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{inspectorModal.bankTx.amount?.toLocaleString()}</span></div>
                        <div style={{ color: '#cbd5e1' }}><strong>Type:</strong> {inspectorModal.bankTx.transactionType}</div>
                        <div style={{ color: '#cbd5e1' }}><strong>Reference / UTR:</strong> {inspectorModal.bankTx.referenceNumber || 'N/A'}</div>
                        <div style={{ color: '#cbd5e1' }}><strong>Description:</strong></div>
                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.75rem', wordBreak: 'break-word', color: '#e2e8f0' }}>
                          {inspectorModal.bankTx.description}
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>No paired bank transaction</div>
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
