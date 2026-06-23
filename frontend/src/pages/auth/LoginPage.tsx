import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-900)' }}>
      <div style={{ width: 400, padding: 40, background: '#fff', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, background: 'var(--primary)', borderRadius: 12, marginBottom: 16 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" width="24" height="24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-900)' }}>MOC System</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>Management of Change</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 4 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 4 }}>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••" />
          </div>

          {error && <div className="toast toast-error" style={{ marginBottom: 16 }}>{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: 12, background: 'var(--gray-50)', borderRadius: 8, fontSize: 12, color: 'var(--gray-500)' }}>
          <strong style={{ color: 'var(--gray-700)' }}>Contas de teste:</strong>
          <div style={{ marginTop: 4, lineHeight: 1.8 }}>
            admin@moc.com / acceptor@moc.com / requester@moc.com<br />
            approver@moc.com / owner@moc.com / reviewer@moc.com<br />
            <strong>Senha:</strong> 123456
          </div>
        </div>
      </div>
    </div>
  );
}
