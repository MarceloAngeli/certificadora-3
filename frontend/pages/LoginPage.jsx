import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.ok) navigate('/');
    else setError(result.error);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F0FDF4 100%)',
    }}>
      <div className="card" style={{ width: 380, padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>Agenda Eletrônica</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Faça login para acessar</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 8,
              color: '#DC2626',
              fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ justifyContent: 'center', padding: '12px', marginTop: 4 }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Entrar'}
          </button>
        </form>

        <div style={{
          marginTop: 24,
          padding: '14px',
          background: '#F9FAFB',
          borderRadius: 8,
          fontSize: 12,
          color: '#6B7280',
        }}>
          <strong>Usuários de teste:</strong><br />
          Admin: admin@agenda.com / admin123<br />
          Usuário: user@agenda.com / user123
        </div>
      </div>
    </div>
  );
}