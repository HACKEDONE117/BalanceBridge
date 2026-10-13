import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BridgeBackground from '../components/BridgeBackground';
import ColumnMapperModal from '../components/ColumnMapperModal';
import { Upload, Play, Settings, AlertCircle, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export default function NewReconciliation() {
  const [formData, setFormData] = useState({
    name: 'Bank Reconciliation Session',
    companyName: 'Acme Corp',
    periodStart: '2025-04-01',
    periodEnd: '2025-04-30'
  });

  const [accFile, setAccFile] = useState(null);
  const [bankFile, setBankFile] = useState(null);
  const [accPassword, setAccPassword] = useState('');
  const [bankPassword, setBankPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stepStatus, setStepStatus] = useState('');

  const [showAccMapper, setShowAccMapper] = useState(false);
  const [showBankMapper, setShowBankMapper] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStartReconciliation = async (e) => {
    e.preventDefault();
    if (!accFile || !bankFile) {
      setError('Please upload both the Accounting File and Bank Statement.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      setStepStatus('Creating reconciliation session...');
      const reconRes = await api.post('/reconciliations', formData);
      const reconId = reconRes.data.id;

      setStepStatus('Uploading & parsing Accounting File...');
      const accFormData = new FormData();
      accFormData.append('file', accFile);
      if (accPassword) accFormData.append('password', accPassword);
      await api.post(`/reconciliations/${reconId}/accounting-file`, accFormData);

      setStepStatus('Uploading & parsing Bank Statement...');
      const bankFormData = new FormData();
      bankFormData.append('file', bankFile);
      if (bankPassword) bankFormData.append('password', bankPassword);
      await api.post(`/reconciliations/${reconId}/bank-file`, bankFormData);

      setStepStatus('Running deterministic multi-level matching engine...');
      await api.post(`/reconciliations/${reconId}/process`);

      setStepStatus('Complete!');
      navigate(`/reconcile/${reconId}`);
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || 'File processing exception';
      setError(`Reconciliation failed: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ background: '#070d18', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <BridgeBackground />
      <Sidebar />
      <div className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Navbar title="Start New Reconciliation" />

        <div className="content-body" style={{ maxWidth: '960px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 600 }}>
              Autonomous Reconciliation Engine
            </span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.3rem', marginBottom: '0.4rem', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              Create Reconciliation Session
            </h1>
            <p style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.9rem' }}>
              Upload accounting ledgers and bank statements in PDF, Excel (.xlsx/.xls), or CSV format.
            </p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStartReconciliation}>
            {/* Step 1: Metadata */}
            <div className="card gold-frame" style={{ marginBottom: '1.5rem', background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(200, 155, 60, 0.15)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(200, 155, 60, 0.4)' }}>
                  1
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>Reconciliation Details</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Reconciliation Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Company / Business Name *</label>
                  <input type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Period Start Date *</label>
                  <input
                    type="date"
                    value={formData.periodStart}
                    onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                    onClick={(e) => e.target.showPicker?.()}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Period End Date *</label>
                  <input
                    type="date"
                    value={formData.periodEnd}
                    onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                    onClick={(e) => e.target.showPicker?.()}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Upload Files */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Accounting File Box */}
              <div className="card gold-frame" style={{ background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(200, 155, 60, 0.15)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(200, 155, 60, 0.4)' }}>
                      2
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>Accounting File</h3>
                  </div>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderColor: 'rgba(200, 155, 60, 0.35)' }} onClick={() => setShowAccMapper(true)}>
                    <Settings size={12} /> Map Columns
                  </button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.8)', marginBottom: '1rem' }}>
                  Tally, Busy, Zoho, Marg export (.xlsx, .xls, .csv, .pdf)
                </p>

                <div style={{ border: '1.5px dashed rgba(200, 155, 60, 0.45)', borderRadius: '12px', padding: '2rem 1rem', textAlign: 'center', backgroundColor: 'rgba(7, 13, 24, 0.65)', marginBottom: '1rem' }}>
                  <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.85rem', marginBottom: '0.6rem', color: '#e2e8f0' }}>
                    {accFile ? <strong style={{ color: 'var(--primary)' }}>{accFile.name}</strong> : 'Drag & drop file or browse'}
                  </div>
                  <input type="file" accept=".xlsx,.xls,.csv,.pdf" onChange={(e) => handleFileChange(e, setAccFile)} style={{ display: 'none' }} id="acc-file-input" />
                  <label htmlFor="acc-file-input" className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.4rem 0.9rem', fontSize: '0.8rem', borderColor: 'rgba(200, 155, 60, 0.4)' }}>
                    Select Accounting File
                  </label>
                </div>
                {accFile && accFile.name.toLowerCase().endsWith('.pdf') && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PDF Password (if protected)</label>
                    <input type="password" placeholder="Enter PDF password if locked" value={accPassword} onChange={(e) => setAccPassword(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                  </div>
                )}
              </div>

              {/* Bank Statement Box */}
              <div className="card gold-frame" style={{ background: 'rgba(15, 26, 48, 0.75)', backdropFilter: 'blur(16px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(200, 155, 60, 0.15)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(200, 155, 60, 0.4)' }}>
                      3
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>Bank Statement</h3>
                  </div>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderColor: 'rgba(200, 155, 60, 0.35)' }} onClick={() => setShowBankMapper(true)}>
                    <Settings size={12} /> Map Columns
                  </button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.8)', marginBottom: '1rem' }}>
                  Bank statement export (.xlsx, .xls, .csv, .pdf)
                </p>

                <div style={{ border: '1.5px dashed rgba(200, 155, 60, 0.45)', borderRadius: '12px', padding: '2rem 1rem', textAlign: 'center', backgroundColor: 'rgba(7, 13, 24, 0.65)', marginBottom: '1rem' }}>
                  <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.85rem', marginBottom: '0.6rem', color: '#e2e8f0' }}>
                    {bankFile ? <strong style={{ color: 'var(--primary)' }}>{bankFile.name}</strong> : 'Drag & drop file or browse'}
                  </div>
                  <input type="file" accept=".xlsx,.xls,.csv,.pdf" onChange={(e) => handleFileChange(e, setBankFile)} style={{ display: 'none' }} id="bank-file-input" />
                  <label htmlFor="bank-file-input" className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.4rem 0.9rem', fontSize: '0.8rem', borderColor: 'rgba(200, 155, 60, 0.4)' }}>
                    Select Bank File
                  </label>
                </div>
                {bankFile && bankFile.name.toLowerCase().endsWith('.pdf') && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PDF Password (if protected)</label>
                    <input type="password" placeholder="Enter PDF password if locked" value={bankPassword} onChange={(e) => setBankPassword(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                  </div>
                )}
              </div>
            </div>

            {loading && (
              <div className="card gold-frame" style={{ marginBottom: '1.5rem', background: 'rgba(200, 155, 60, 0.08)', textAlign: 'center', padding: '1.75rem' }}>
                <div className="spinner" style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '1rem', fontWeight: 600 }}>⚡ Autonomous Matching in Progress...</div>
                <p style={{ fontWeight: 600, color: 'var(--primary)', margin: 0 }}>{stepStatus}</p>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.1rem', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.04em' }} disabled={loading}>
              <Play size={20} fill="currentColor" />
              {loading ? 'Executing Engine...' : 'Execute Autonomous Reconciliation'}
            </button>
          </form>

          {/* Modal Mappers */}
          <ColumnMapperModal
            isOpen={showAccMapper}
            onClose={() => setShowAccMapper(false)}
            fileType="Accounting File"
            headers={['Date', 'Particular', 'Debit(NAVE)', 'Credit(JAMA)', 'Balance']}
            sampleRows={[
              ['01/04/25', 'Banosa Vidharbh Confectionery Banosa Neft', '4795.00', '', '385003.65Dr'],
              ['01/04/25', 'Digras Rafik Kirana Digras Neft', '3528.00', '', '388531.65Dr']
            ]}
            onConfirm={(m) => console.log('Acc Mappings', m)}
          />

          <ColumnMapperModal
            isOpen={showBankMapper}
            onClose={() => setShowBankMapper(false)}
            fileType="Bank Statement"
            headers={['Date', 'Narration', 'Chq./Ref.No.', 'Value Dt', 'Withdrawal Amt.', 'Deposit Amt.', 'Closing Balance']}
            sampleRows={[
              ['01/04/25', 'NEFT DR-KKBK0002050-AMBER INDUSTRIES AKO', 'HDFCN52025040150521296', '01/04/25', '30,968.00', '', '307,573.65']
            ]}
            onConfirm={(m) => console.log('Bank Mappings', m)}
          />
        </div>
      </div>
    </div>
  );
}
