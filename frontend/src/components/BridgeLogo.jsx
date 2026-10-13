import React from 'react';

/**
 * Custom BalanceBridge Golden Suspension Bridge Cable Logo
 * Exact geometric match to the arch cable emblem in reference images
 */
export default function BridgeLogo({ size = 36, color = '#c89b3c', showText = true, subtitle = "Automated Financial Reconciliation", textLayout = "vertical" }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
      {/* Golden Suspension Bridge Cable Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="goldBridgeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a3792c" />
            <stop offset="50%" stopColor="#d8a84e" />
            <stop offset="100%" stopColor="#f5cf7a" />
          </linearGradient>
        </defs>
        {/* Left ascending arch cables */}
        <path
          d="M6 38 C 12 28, 16 18, 22 8 C 22.5 7.2, 23.5 7.2, 24 8 C 24.5 7.2, 25.5 7.2, 26 8 C 32 18, 36 28, 42 38"
          stroke="url(#goldBridgeGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M10 38 C 15 30, 18 22, 23 13"
          stroke="url(#goldBridgeGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M38 38 C 33 30, 30 22, 25 13"
          stroke="url(#goldBridgeGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14 38 C 18 32, 20 26, 23.5 19"
          stroke="url(#goldBridgeGrad)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M34 38 C 30 32, 28 26, 24.5 19"
          stroke="url(#goldBridgeGrad)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M18 38 C 21 34, 22.5 30, 24 25"
          stroke="url(#goldBridgeGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M30 38 C 27 34, 25.5 30, 24 25"
          stroke="url(#goldBridgeGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Base foundation line */}
        <line
          x1="4"
          y1="40"
          x2="44"
          y2="40"
          stroke="url(#goldBridgeGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: textLayout === 'center' ? 'center' : 'left' }}>
          <span style={{
            fontSize: size >= 40 ? '1.35rem' : '1.15rem',
            fontWeight: 800,
            letterSpacing: '1px',
            color: '#c89b3c',
            lineHeight: 1.1,
            textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif"
          }}>
            BALANCE BRIDGE
          </span>
          {subtitle && (
            <span style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              letterSpacing: '0.5px',
              marginTop: '2px',
              fontWeight: 500
            }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
