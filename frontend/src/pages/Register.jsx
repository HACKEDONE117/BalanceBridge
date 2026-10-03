import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FileCheck, UserPlus, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

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
        setError("Unable to connect to backend. Render free backend may be waking up (takes 30-50s). Please wait 30 seconds and try again, or verify VITE_API_URL on Vercel.");
      } else {
        setError('Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '450px' }}>
        
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

        <div className="card" style={{ width: '100%', padding: '2.5rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>Create New Account</h3>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg ? (
          <div style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', padding: '1.25rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', textAlign: 'center' }}>
            <CheckCircle size={32} style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Registration Submitted</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{successMsg}</p>
            <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', justifyContent: 'center', width: '100%' }}>
              Proceed to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@company.com" />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>

            <div className="form-group">
              <label>Account Role *</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="USER">Standard Accountant User (Requires Admin Approval)</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            {role === 'USER' && (
              <div className="form-group">
                <label>System Administrator's Name or Email *</label>
                <input
                  type="text"
                  value={adminInput}
                  onChange={(e) => setAdminInput(e.target.value)}
                  required
                  placeholder="e.g. System Admin or admin@balancebridge.com"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  Enter the Name or Email of the Administrator managing your organization.
                </span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={loading}>
              <UserPlus size={18} />
              {loading ? 'Submitting...' : 'Register Account'}
            </button>
          </form>
        )}

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  </div>
  );
}
