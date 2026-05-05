// src/components/Layout.jsx
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#4F46E5' }}>
            📅 Agenda
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <NavLink to="/" end style={({ isActive }) => navStyle(isActive)}>
              Calendário
            </NavLink>
            {isAdmin && (
              <>
                <NavLink to="/admin" style={({ isActive }) => navStyle(isActive)}>
                  Gerenciar Eventos
                </NavLink>
                <NavLink to="/users" style={({ isActive }) => navStyle(isActive)}>
                  Usuários
                </NavLink>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>
            {user?.name}
          </span>
          <span className={`badge badge-${user?.role?.toLowerCase()}`}>
            {user?.role === 'ADMIN' ? '👑 Admin' : '👤 Usuário'}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </nav>
      <main style={{ flex: 1, padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}

function navStyle(isActive) {
  return {
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: isActive ? '#4F46E5' : '#374151',
    background: isActive ? '#EEF2FF' : 'transparent',
    textDecoration: 'none',
    transition: 'all .15s',
  };
}