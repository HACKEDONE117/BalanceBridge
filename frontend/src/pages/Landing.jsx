import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BridgeLogo from '../components/BridgeLogo';
import BridgeBackground from '../components/BridgeBackground';
import {
  Shield, Network, TrendingUp, ArrowRight,
  Send, CheckCircle2
} from 'lucide-react';

export default function Landing() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState('');
  const [demoRequested, setDemoRequested] = useState(false);

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setDemoRequested(true);
    setTimeout(() => {
      navigate('/login');
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0d1728 0%, #070d18 100%)',
      color: 'var(--text-main)',
      fontFamily: 'var(--font-family)',
      position: 'relative',
      padding: '1.5rem 1rem 3rem',
      overflowX: 'hidden'
    }}>
      {/* Background Architectural Blueprint Bridge Artwork */}
      <BridgeBackground />

      {/* Top Banner Tag */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1rem',
        position: 'relative',
        zIndex: 10
      }}>
        <span style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '2px',
          color: 'var(--gold-primary)',
          textTransform: 'uppercase'
        }}>
          BALANCE BRIDGE: <span style={{ color: '#ffffff', fontWeight: 500 }}>Autonomous Financial Reconciliation Platform</span>
        </span>
      </div>

      {/* MASTER GOLD-FRAME CANVAS CONTAINER */}
      <div className="gold-frame" style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '1.75rem 2.5rem 2.5rem',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* 1. TOP NAVIGATION BAR */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(200, 155, 60, 0.25)',
          paddingBottom: '1.25rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          {/* Logo Brand */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <BridgeLogo size={38} subtitle="Reconciliation Platform" />
          </Link>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            <a href="#home" style={{ color: '#ffffff', textDecoration: 'none', borderBottom: '2px solid var(--gold-primary)', paddingBottom: '4px' }}>
              Home
            </a>
            <a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#c89b3c'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
              Features
            </a>
            <a href="#how-it-works" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#c89b3c'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
              How It Works
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem' }}>
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/login" style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  padding: '0.55rem 1.1rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.2s'
                }}>
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.55rem 1.35rem' }}>
                  Request Demo
                </Link>
              </>
            )}
          </div>
        </header>

        {/* 2. HERO HEADLINE SECTION */}
        <section id="home" style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 3.5rem' }}>
          <h1 style={{
            fontSize: '2.75rem',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            lineHeight: 1.25,
            marginBottom: '1rem'
          }}>
            <span style={{ color: 'var(--gold-primary)' }}>Seamless Reconciliation. </span>
            <span style={{ color: '#ffffff' }}>Absolute Financial Clarity.</span>
          </h1>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto 2rem'
          }}>
            Connect disparate financial data sources into a single platform designed to catch errors before they impact your business.
          </p>

          <Link
            to={user ? "/dashboard" : "/register"}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 2rem',
              fontSize: '0.95rem',
              borderRadius: '8px'
            }}
          >
            Explore Platform
          </Link>
        </section>

        {/* 3. THREE GOLD-BORDERED FEATURE CARDS */}
        <section id="features" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem',
          marginBottom: '4.5rem'
        }}>
          {/* Card 1: Secure Matching */}
          <div style={{
            background: 'rgba(11, 20, 38, 0.7)',
            border: '1px solid rgba(200, 155, 60, 0.45)',
            borderRadius: '16px',
            padding: '2rem 1.75rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            transition: 'transform 0.2s ease, border-color 0.2s ease'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              border: '1px solid rgba(200, 155, 60, 0.4)',
              background: 'rgba(200, 155, 60, 0.08)',
              color: 'var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
              Secure Matching
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.55 }}>
              Deterministic rule-based reconciliations with exact amounts, date tolerance windows, and zero AI hallucination.
            </p>
          </div>

          {/* Card 2: Seamless Integration */}
          <div style={{
            background: 'rgba(11, 20, 38, 0.7)',
            border: '1px solid rgba(200, 155, 60, 0.45)',
            borderRadius: '16px',
            padding: '2rem 1.75rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            transition: 'transform 0.2s ease, border-color 0.2s ease'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              border: '1px solid rgba(200, 155, 60, 0.4)',
              background: 'rgba(200, 155, 60, 0.08)',
              color: 'var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Network size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
              Seamless Integration
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.55 }}>
              Multi-source integration across financial ledgers, Excel workbooks, and bank statement PDFs with password unlock.
            </p>
          </div>

          {/* Card 3: Detailed Analytics */}
          <div style={{
            background: 'rgba(11, 20, 38, 0.7)',
            border: '1px solid rgba(200, 155, 60, 0.45)',
            borderRadius: '16px',
            padding: '2rem 1.75rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            transition: 'transform 0.2s ease, border-color 0.2s ease'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              border: '1px solid rgba(200, 155, 60, 0.4)',
              background: 'rgba(200, 155, 60, 0.08)',
              color: 'var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
              Detailed Analytics
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.55 }}>
              Audit-ready analytics, real-time match rate metrics, mismatch breakdown, and automated executive export workbooks.
            </p>
          </div>
        </section>


        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" style={{ marginBottom: '4rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            How It <span style={{ color: 'var(--gold-primary)' }}>Works</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
            Four simple steps from upload to audit-ready report
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Upload Statements', desc: 'Upload bank statements (PDF/Excel) and accounting ledger exports seamlessly.' },
              { step: '02', title: 'Auto Matching', desc: 'Our engine applies deterministic rules — exact amounts, date windows, narration — to match every transaction.' },
              { step: '03', title: 'Review Mismatches', desc: 'Unmatched entries are surfaced in the workbench. Flag, adjust, or override with a full audit trail.' },
              { step: '04', title: 'Export Reports', desc: 'Generate audit-ready reconciliation statements, mismatch summaries, and executive Excel workbooks instantly.' }
            ].map(({ step, title, desc }) => (
              <div key={step} style={{
                background: 'rgba(11, 20, 38, 0.7)',
                border: '1px solid rgba(200, 155, 60, 0.35)',
                borderRadius: '14px',
                padding: '1.75rem 1.5rem',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'rgba(200, 155, 60, 0.18)',
                  lineHeight: 1,
                  marginBottom: '0.75rem',
                  letterSpacing: '-1px'
                }}>{step}</div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>{title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.55, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. INTERACTIVE LEAD CAPTURE BAR (REQUEST DEMO) */}
        <section style={{ maxWidth: '620px', margin: '0 auto 2.5rem' }}>
          <form onSubmit={handleDemoSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(15, 26, 48, 0.9)',
            border: '1.5px solid rgba(200, 155, 60, 0.4)',
            borderRadius: '10px',
            padding: '0.35rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
          }}>
            <input
              type="email"
              placeholder="Enter work email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                color: '#ffffff',
                padding: '0.65rem 1rem',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '7px',
                whiteSpace: 'nowrap'
              }}
            >
              {demoRequested ? <CheckCircle2 size={16} /> : 'Request Demo'}
            </button>
          </form>
        </section>

        {/* 6. SUB-FOOTER INSIDE CANVAS */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '1.5rem'
        }}>
          <span>© 2026 Balance-Bridge • </span>
          <a href="#privacy" style={{ color: 'var(--gold-primary)', textDecoration: 'none' }}>Privacy Policy</a>
        </div>

      </div>

      {/* OUTSIDE BOTTOM STRIP FOOTER */}
      <footer style={{
        maxWidth: '1240px',
        margin: '2rem auto 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        padding: '0 0.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BridgeLogo size={24} showText={false} />
          <span style={{ fontWeight: 700, color: 'var(--gold-primary)' }}>BALANCE BRIDGE:</span>
          <span>PLATFORM UI</span>
        </div>

        <div>
          <span>© 2026 Balance-Bridge • Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
}
