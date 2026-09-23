import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FileCheck, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

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
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
          <FileCheck size={36} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>BalanceBridge</h1>
        </div>

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
  );
}
