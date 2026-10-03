import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  FileCheck, ShieldCheck, TrendingUp, Layers, Coins, PieChart,
  CheckCircle2, ArrowRight, Lock, Download, Zap, RefreshCw,
  FileSpreadsheet, Sun, Moon, Sparkles, Check, ChevronRight
} from 'lucide-react';

export default function Landing() {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [hoveredCard, setHoveredCard] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main)',
      color: 'var(--text-main)',
      fontFamily: 'var(--font-family)',
      overflowX: 'hidden'
    }}>
      
      {/* 1. TOP NAVIGATION BAR */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--topbar-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2.5rem',
          flexWrap: 'wrap'
        }}>
          {/* Left Group: Logo + Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
              <div className="logo-badge" style={{ width: '42px', height: '42px', borderRadius: '12px' }}>
                <FileCheck size={26} style={{ transform: 'translateX(1px)', flexShrink: 0 }} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                <span style={{ color: 'var(--logo-balance)' }}>Balance</span>
                <span style={{ color: 'var(--primary)' }}>Bridge</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="#features" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Features</a>
              <a href="#how-it-works" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>How it Works</a>
              <a href="#security" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Security & Audit</a>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: isDark ? '#facc15' : '#ea580c',
                padding: '0.45rem 0.85rem',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {user ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}>
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.875rem' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}>
                  Get Started Free <Sparkles size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH INTERACTIVE 3D FINANCIAL SHOWCASE */}
      <section style={{
        padding: '5rem 2rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '3.5rem',
        alignItems: 'center'
      }}>
        
        {/* Left Hero Content */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <Zap size={15} /> Rule-Based Financial Reconciliation Engine
          </div>

          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 900,
            lineHeight: '1.15',
            letterSpacing: '-1px',
            marginBottom: '1.25rem'
          }}>
            Automated Ledger & <br />
            <span style={{ color: 'var(--logo-balance)' }}>Bank Statement </span>
            <span style={{ color: 'var(--primary)' }}>Reconciliation</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: '1.65',
            marginBottom: '2.25rem',
            maxWidth: '520px'
          }}>
            Eliminate hours of manual Excel matching. Upload Tally, Busy, Zoho, or PDF/CSV bank statements and get instant 100% deterministic matched pair reports.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', borderRadius: '14px' }}>
              Start Free Reconciliation <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem', fontSize: '1rem', borderRadius: '14px' }}>
              Explore Live Demo
            </Link>
          </div>

          {/* Quick Metrics Badges */}
          <div style={{ display: 'flex', gap: '1.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>99.8%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deterministic Precision</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--yellow)' }}>&lt; 3 Sec</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Matching Execution</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>100%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Audit Compliance</div>
            </div>
          </div>
        </div>

        {/* Right 3D Interactive Showcase Graphic */}
        <div style={{ perspective: '1200px', display: 'flex', justifyContent: 'center' }}>
          <div
            onMouseEnter={() => setHoveredCard(true)}
            onMouseLeave={() => setHoveredCard(false)}
            style={{
              width: '100%',
              maxWidth: '480px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: 'var(--shadow), 0 0 40px rgba(239, 68, 68, 0.15)',
              transform: hoveredCard
                ? 'rotateY(-2deg) rotateX(2deg) scale(1.02)'
                : 'rotateY(-8deg) rotateX(6deg)',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
              position: 'relative'
            }}
          >
            {/* 3D Engine Status Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Reconciliation Engine</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={13} /> Multi-Level Rule Matching Active
                </span>
              </div>
            </div>

            {/* Live 3D Financial Balance Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', background: 'var(--bg-main)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <span>Accounting Ledger Debits</span>
                  <strong style={{ color: 'var(--primary)' }}>₹12,450,800</strong>
                </div>
                <div style={{ height: '10px', background: 'var(--bg-card)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--primary-hover))', borderRadius: '6px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <span>Bank Statement Credits</span>
                  <strong style={{ color: 'var(--yellow)' }}>₹12,450,800</strong>
                </div>
                <div style={{ height: '10px', background: 'var(--bg-card)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, var(--yellow), var(--yellow-hover))', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Net Variance Discrepancy</span>
                <span className="badge badge-matched" style={{ fontSize: '0.75rem' }}>₹0.00 Balanced</span>
              </div>
            </div>

            {/* Feature Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-matched" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                <Layers size={13} /> Password PDF Support
              </span>
              <span className="badge badge-possible" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                <PieChart size={13} /> Discrepancy Alerts
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* 3. FEATURES GRID SECTION */}
      <section id="features" style={{
        padding: '5rem 2rem',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Built for Accountants, Built for Scale
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need to automate bank statement reconciliations with complete mathematical accuracy.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Multi-Level Deterministic Engine</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Matches transactions by reference numbers, exact amounts, date tolerance windows, and description keywords with zero AI hallucination.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(250, 204, 21, 0.12)', color: 'var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Lock size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Encrypted PDF & Excel Support</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Seamlessly decrypt and parse password-protected bank PDF statements, Tally/Busy Excel exports, and raw CSV feeds.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.12)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Download size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>1-Click Executive PDF & Excel Reports</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Download audit-ready PDF reports with BalanceBridge headers or formatted Excel workbooks split by matched, unmatched, and mismatch items.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS WORKFLOW */}
      <section id="how-it-works" style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            3 Steps to Total Balance Verification
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Simple, automated, and secure end-to-end reconciliation workflow.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              1
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Upload Statement Files</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Upload your accounting exports and bank statements in PDF, Excel (.xlsx/.xls), or CSV formats.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--yellow)', color: '#000', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              2
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Automated Match Engine</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Engine automatically detects exact matches, amount mismatches, duplicates, and missing transactions.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--success)', color: '#fff', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              3
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Inspect & Export Audit Reports</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Inspect side-by-side transaction pairs, confirm manual matches, and download branded PDF/Excel reports.
            </p>
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION & FOOTER */}
      <section style={{
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(250, 204, 21, 0.1) 100%)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Streamline Your Bank Reconciliations?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Join accountants and finance teams using BalanceBridge for mathematical precision.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', borderRadius: '14px' }}>
            Create Your Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer style={{ padding: '2.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>© 2026 BalanceBridge. Financial & Bank Reconciliation System. All rights reserved.</p>
      </footer>

    </div>
  );
}
