import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BridgeLogo from '../components/BridgeLogo';
import BridgeBackground from '../components/BridgeBackground';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
        setError("Unable to connect to backend. Please ensure the backend is running at http://localhost:8080");
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
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #0d1728 0%, #070d18 100%)',
      padding: '2rem 1rem',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background Architectural Blueprint Bridge Artwork */}
      <BridgeBackground />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>
        
        {/* Back to Home Button */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* 2ND IMAGE: EXACT GOLD-BORDERED SIGN IN CARD */}
        <div className="gold-frame" style={{
          padding: '2.5rem 2.25rem',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(200, 155, 60, 0.12)'
        }}>
          
          {/* Brand Header with Arch Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <BridgeLogo size={52} subtitle="Autonomous Reconciliation Platform" textLayout="center" />
            </div>

            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--gold-primary)',
              letterSpacing: '-0.3px',
              marginTop: '1rem',
              marginBottom: 0
            }}>
              Sign In
            </h2>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.3)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Address */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email Address"
                  style={{
                    width: '100%',
                    paddingLeft: '2.75rem',
                    background: 'rgba(15, 26, 48, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.12)'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  style={{
                    width: '100%',
                    paddingLeft: '2.75rem',
                    background: 'rgba(15, 26, 48, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.12)'
                  }}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
              fontSize: '0.85rem'
            }}>
              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                marginBottom: 0
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--gold-primary)', width: 'auto', padding: 0 }}
                />
                <span>Remember Me</span>
              </label>

              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); alert("Please contact administrator to reset password."); }}
                style={{ color: 'var(--gold-primary)', textDecoration: 'none', fontWeight: 500 }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Solid Gold Sign In Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem 1rem',
                fontSize: '1rem',
                borderRadius: '8px'
              }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Toggle to Sign Up */}
          <div style={{
            marginTop: '1.75rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--gold-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign Up.
            </Link>
          </div>

          {/* Copyright Bottom Stamp */}
          <div style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'rgba(148, 163, 184, 0.6)',
            marginTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '1.25rem'
          }}>
            <span>© 2026 Balance-Bridge  Privacy Policy</span>
          </div>

        </div>

      </div>
    </div>
  );
}
