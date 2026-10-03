import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FileCheck, LogIn, AlertCircle, ShieldCheck, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (!err.response) {
        setError("Unable to connect to backend. Render free backend may be waking up (takes 30-50s). Please wait 30 seconds and try again, or verify VITE_API_URL on Vercel.");
      } else {
        setError('Login failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justify: 'center',
      background: 'var(--bg-main)',
      padding: '2rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        
        {/* Back to Home Button */}
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'color 0.2s'
          }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo-badge" style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            margin: '0 auto 1rem auto'
          }}>
            <FileCheck size={30} style={{ transform: 'translateX(1px)', flexShrink: 0 }} />
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            <span style={{ color: 'var(--logo-balance)' }}>Balance</span>
            <span style={{ color: 'var(--primary)' }}>Bridge</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Automated Financial Reconciliation System
          </p>
        </div>

        {/* Login Form Card */}
        <div className="card" style={{ padding: '2.25rem', boxShadow: 'var(--shadow)', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', textAlign: 'center' }}>
            Welcome Back
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.85rem' }}>
            Enter your account credentials to access dashboard
          </p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="user@company.com"
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                justify: 'center',
                marginTop: '1.25rem',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem'
              }}
              disabled={loading}
            >
              <LogIn size={18} />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--yellow)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Create Account <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Minimalist Trust Footer */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} style={{ color: 'var(--success)' }} /> 256-bit Security
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Lock size={14} style={{ color: 'var(--primary)' }} /> Password PDF Support
          </span>
        </div>

      </div>
    </div>
  );
}
