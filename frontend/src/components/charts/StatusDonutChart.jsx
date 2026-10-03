import React from 'react';

export default function StatusDonutChart({ matched = 0, possible = 0, unmatched = 0, duplicate = 0, mismatch = 0 }) {
  const total = matched + possible + unmatched + duplicate + mismatch;

  const data = [
    { label: 'Matched', count: matched, color: '#22c55e' },
    { label: 'Possible Match', count: possible, color: '#f59e0b' },
    { label: 'Unmatched', count: unmatched, color: '#dc2626' },
    { label: 'Duplicate', count: duplicate, color: '#a855f7' },
    { label: 'Amount Mismatch', count: mismatch, color: '#ec4899' },
  ].filter(item => item.count > 0);

  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        No transaction distribution data available.
      </div>
    );
  }

  // Calculate SVG stroke DashOffset for Donut segments
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      {/* SVG Donut */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Donut Segments Group (Rotated -90 deg around center 90,90) */}
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {data.map((item, index) => {
              const percent = item.count / total;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += percent;

              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'all 0.5s ease-in-out', cursor: 'pointer' }}
                />
              );
            })}
          </g>

          {/* Mathematically Centered SVG Text (Unrotated) */}
          <text
            x={size / 2}
            y={size / 2 - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--text-main)"
            fontSize="26"
            fontWeight="700"
          >
            {total}
          </text>
          <text
            x={size / 2}
            y={size / 2 + 16}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--text-muted)"
            fontSize="12"
            fontWeight="500"
          >
            Transactions
          </text>
        </svg>
      </div>

      {/* Legend & Percentages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, minWidth: '180px' }}>
        {data.map((item, idx) => {
          const pct = Math.round((item.count / total) * 100);
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{item.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.count}</span>
                <span style={{ fontWeight: 700, color: item.color, minWidth: '35px', textAlign: 'right' }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
