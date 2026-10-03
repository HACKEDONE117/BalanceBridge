import React from 'react';

export default function MatchRateBarChart({ reconciliations = [] }) {
  if (!reconciliations || reconciliations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        No historical reconciliations to plot trend.
      </div>
    );
  }

  // Take last 6 reconciliations
  const items = reconciliations.slice(0, 6).reverse();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {items.map((r) => {
        const total = (r.summary?.totalAccountingCount || 0) + (r.summary?.totalBankCount || 0);
        const matched = r.summary?.matchedCount || 0;
        const matchPct = total > 0 ? Math.round((matched * 2 / total) * 100) : 0;

        return (
          <div key={r.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{r.name} ({r.companyName})</span>
              <span style={{ fontWeight: 700, color: matchPct > 80 ? 'var(--success)' : matchPct > 50 ? 'var(--warning)' : 'var(--danger)' }}>
                {matchPct}% Match Rate
              </span>
            </div>

            {/* Progress bar container */}
            <div style={{ height: '10px', width: '100%', background: 'var(--bg-main)', borderRadius: '6px', overflow: 'hidden', display: 'flex', border: '1px solid var(--border-color)' }}>
              <div
                style={{
                  width: `${matchPct}%`,
                  background: matchPct > 80 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : matchPct > 50 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                  borderRadius: '6px',
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
