import React from 'react';

export default function DebitCreditBalanceChart({ summary }) {
  if (!summary) return null;

  const accountingTotal = summary.totalAccountingAmount || 0;
  const bankTotal = summary.totalBankAmount || 0;
  const matchedAmount = summary.matchedAmount || 0;
  const maxVal = Math.max(accountingTotal, bankTotal, matchedAmount) || 1;

  const accPct = Math.round((accountingTotal / maxVal) * 100);
  const bankPct = Math.round((bankTotal / maxVal) * 100);
  const matchPct = Math.round((matchedAmount / maxVal) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Financial Volume Visualizer
      </h4>

      {/* Accounting Total Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
          <span>Accounting System Total</span>
          <strong style={{ color: 'var(--primary)' }}>₹{accountingTotal.toLocaleString()}</strong>
        </div>
        <div style={{ height: '8px', background: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${accPct}%`, height: '100%', background: 'linear-gradient(90deg, #ef4444, #b91c1c)', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Bank Statement Total Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
          <span>Bank Statement Total</span>
          <strong style={{ color: '#a855f7' }}>₹{bankTotal.toLocaleString()}</strong>
        </div>
        <div style={{ height: '8px', background: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${bankPct}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #7e22ce)', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Matched Amount Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
          <span>Matched Reconciled Amount</span>
          <strong style={{ color: 'var(--success)' }}>₹{matchedAmount.toLocaleString()}</strong>
        </div>
        <div style={{ height: '8px', background: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${matchPct}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #15803d)', transition: 'width 0.5s ease' }} />
        </div>
      </div>
    </div>
  );
}
