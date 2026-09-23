import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function ColumnMapperModal({ isOpen, onClose, fileType, headers, sampleRows, onConfirm }) {
  const [mapping, setMapping] = useState({
    date: '0',
    description: '1',
    debit: '2',
    credit: '3',
    amount: '',
    reference: '4',
    balance: ''
  });

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setMapping((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = () => {
    onConfirm(mapping);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Manual Column Mapping</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configure column assignments for {fileType}</p>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Mappings Form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label>Date Column *</label>
            <select value={mapping.date} onChange={(e) => handleChange('date', e.target.value)}>
              <option value="">-- Select --</option>
              {headers?.map((h, idx) => (
                <option key={idx} value={idx}>Col {idx + 1}: {h}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description Column *</label>
            <select value={mapping.description} onChange={(e) => handleChange('description', e.target.value)}>
              <option value="">-- Select --</option>
              {headers?.map((h, idx) => (
                <option key={idx} value={idx}>Col {idx + 1}: {h}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Debit Column</label>
            <select value={mapping.debit} onChange={(e) => handleChange('debit', e.target.value)}>
              <option value="">-- Select --</option>
              {headers?.map((h, idx) => (
                <option key={idx} value={idx}>Col {idx + 1}: {h}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Credit Column</label>
            <select value={mapping.credit} onChange={(e) => handleChange('credit', e.target.value)}>
              <option value="">-- Select --</option>
              {headers?.map((h, idx) => (
                <option key={idx} value={idx}>Col {idx + 1}: {h}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Amount Column</label>
            <select value={mapping.amount} onChange={(e) => handleChange('amount', e.target.value)}>
              <option value="">-- Select --</option>
              {headers?.map((h, idx) => (
                <option key={idx} value={idx}>Col {idx + 1}: {h}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Reference / UTR Column</label>
            <select value={mapping.reference} onChange={(e) => handleChange('reference', e.target.value)}>
              <option value="">-- Select --</option>
              {headers?.map((h, idx) => (
                <option key={idx} value={idx}>Col {idx + 1}: {h}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Preview */}
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>Data Preview (First Sample Rows)</h4>
        <div className="table-container" style={{ maxHeight: '200px', marginBottom: '1.5rem' }}>
          <table>
            <thead>
              <tr>
                {headers?.map((h, i) => (
                  <th key={i}>Col {i + 1}: {h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleRows?.slice(0, 10).map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            <Check size={16} /> Save Mappings & Process
          </button>
        </div>
      </div>
    </div>
  );
}
