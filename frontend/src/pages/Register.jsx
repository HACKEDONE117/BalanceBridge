import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BridgeLogo from '../components/BridgeLogo';
import BridgeBackground from '../components/BridgeBackground';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [adminInput, setAdminInput] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (role === 'USER' && !adminInput.trim()) {
      setError("Please enter your System Administrator's Name or Email.");
      return;
    }

    setLoading(true);
    try {
      const result = await register(name, email, password, role, adminInput.trim());
      if (result.token) {
        navigate('/dashboard');
      } else {
        setSuccessMsg(result.message || 'Registration request submitted! Please wait for your System Administrator to approve your account.');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (!err.response) {
        setError("Unable to connect to backend. Please ensure the backend is running at http://localhost:8080");
      } else {
        setError('Registration failed.');
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

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 10 }}>
        
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

        {/* GOLD-BORDERED REGISTER CARD */}
        <div className="gold-frame" style={{
          padding: '2.5rem 2.25rem',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(200, 155, 60, 0.12)'
        }}>
          
          {/* Brand Header with Arch Logo */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <BridgeLogo size={48} subtitle="Autonomous Reconciliation Platform" textLayout="center" />
            </div>

            <h2 style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: 'var(--gold-primary)',
              letterSpacing: '-0.3px',
              marginTop: '0.75rem',
              marginBottom: 0
            }}>
              Create Account
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

          {successMsg ? (
            <div style={{
              background: 'rgba(52,211,153,0.12)',
              color: '#34d399',
              border: '1px solid rgba(52,211,153,0.3)',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <CheckCircle size={36} style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>Registration Submitted</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {successMsg}
              </p>
              <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', justifyContent: 'center', width: '100%' }}>
                Proceed to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    style={{
                      width: '100%',
                      paddingLeft: '2.75rem',
                      background: 'rgba(15, 26, 48, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.12)'
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                  Email Address *
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
                    placeholder="john@company.com"
                    style={{
                      width: '100%',
                      paddingLeft: '2.75rem',
                      background: 'rgba(15, 26, 48, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.12)'
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                  Password *
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
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      paddingLeft: '2.75rem',
                      background: 'rgba(15, 26, 48, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.12)'
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                  Account Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 26, 48, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.12)'
                  }}
                >
                  <option value="USER">Standard Accountant (Requires Admin Approval)</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>

              {role === 'USER' && (
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                    System Administrator's Name or Email *
                  </label>
                  <input
                    type="text"
                    value={adminInput}
                    onChange={(e) => setAdminInput(e.target.value)}
                    required
                    placeholder="e.g. System Admin or admin@balancebridge.com"
                    style={{
                      width: '100%',
                      background: 'rgba(15, 26, 48, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.12)'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                    Enter the Name or Email of the Administrator managing your organization.
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '0.75rem',
                  padding: '0.85rem 1rem',
                  fontSize: '1rem',
                  borderRadius: '8px'
                }}
                disabled={loading}
              >
                <UserPlus size={18} />
                {loading ? 'Submitting...' : 'Register Account'}
              </button>
            </form>
          )}

          {/* Footer toggle to Sign In */}
          <div style={{
            marginTop: '1.75rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--gold-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In.
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
