import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ColumnMapperModal from '../components/ColumnMapperModal';
import { Upload, Play, Settings, AlertCircle } from 'lucide-react';

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
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Start New Reconciliation" />

        <div className="content-body" style={{ maxWidth: '900px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Reconciliation Session</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Upload accounting exports and bank statements in PDF, Excel (.xlsx/.xls), or CSV format.
          </p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStartReconciliation}>
            {/* Step 1: Metadata */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>1. Reconciliation Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Reconciliation Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Company / Business Name *</label>
                  <input type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Period Start Date *</label>
                  <input type="date" value={formData.periodStart} onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Period End Date *</label>
                  <input type="date" value={formData.periodEnd} onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })} required />
                </div>
              </div>
            </div>

            {/* Step 2: Upload Files */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Accounting File Box */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>2. Accounting File</h3>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setShowAccMapper(true)}>
                    <Settings size={12} /> Map Columns
                  </button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Tally, Busy, Zoho, Marg export (.xlsx, .xls, .csv, .pdf)
                </p>

                <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius)', padding: '2rem 1rem', textAlign: 'center', backgroundColor: 'rgba(15,23,42,0.5)', marginBottom: '1rem' }}>
                  <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    {accFile ? <strong>{accFile.name}</strong> : 'Drag & drop file or click to browse'}
                  </div>
                  <input type="file" accept=".xlsx,.xls,.csv,.pdf" onChange={(e) => handleFileChange(e, setAccFile)} style={{ display: 'none' }} id="acc-file-input" />
                  <label htmlFor="acc-file-input" className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Select File
                  </label>
                </div>
                {accFile && accFile.name.toLowerCase().endsWith('.pdf') && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>PDF Password (if protected)</label>
                    <input type="password" placeholder="Enter PDF password if locked" value={accPassword} onChange={(e) => setAccPassword(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                  </div>
                )}
              </div>

              {/* Bank Statement Box */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>3. Bank Statement</h3>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setShowBankMapper(true)}>
                    <Settings size={12} /> Map Columns
                  </button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Bank statement export (.xlsx, .xls, .csv, .pdf)
                </p>

                <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius)', padding: '2rem 1rem', textAlign: 'center', backgroundColor: 'rgba(15,23,42,0.5)', marginBottom: '1rem' }}>
                  <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    {bankFile ? <strong>{bankFile.name}</strong> : 'Drag & drop file or click to browse'}
                  </div>
                  <input type="file" accept=".xlsx,.xls,.csv,.pdf" onChange={(e) => handleFileChange(e, setBankFile)} style={{ display: 'none' }} id="bank-file-input" />
                  <label htmlFor="bank-file-input" className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Select File
                  </label>
                </div>
                {bankFile && bankFile.name.toLowerCase().endsWith('.pdf') && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>PDF Password (if protected)</label>
                    <input type="password" placeholder="Enter PDF password if locked" value={bankPassword} onChange={(e) => setBankPassword(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                  </div>
                )}
              </div>
            </div>

            {loading && (
              <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(56,189,248,0.1)', border: '1px solid var(--primary)', textAlign: 'center', padding: '1.5rem' }}>
                <div className="spinner" style={{ marginBottom: '0.5rem' }}>⏳ Processing...</div>
                <p style={{ fontWeight: 600, color: 'var(--primary)' }}>{stepStatus}</p>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }} disabled={loading}>
              <Play size={20} />
              {loading ? 'Running Engine...' : 'Execute Reconciliation Engine'}
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
