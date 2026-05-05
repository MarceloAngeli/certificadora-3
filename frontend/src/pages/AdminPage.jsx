import React, { useState, useEffect } from 'react';
import api from '../services/api';

const COLORS = ['#4F46E5','#059669','#DC2626','#D97706','#7C3AED','#DB2777','#0891B2'];
const EMPTY = { title: '', description: '', date: '', endDate: '', location: '', color: '#4F46E5' };

function toInputDate(iso) {
  if (!iso) return '';
  return iso.slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setError('');
    setShowForm(true);
  }

  function openEdit(evt) {
    setEditing(evt.id);
    setForm({
      title: evt.title,
      description: evt.description || '',
      date: toInputDate(evt.date),
      endDate: toInputDate(evt.endDate),
      location: evt.location || '',
      color: evt.color,
    });
    setError('');
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await api.put(`/events/${editing}`, form);
      } else {
        await api.post('/events', form);
      }
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deseja remover este evento?')) return;
    await api.delete(`/events/${id}`);
    fetchEvents();
  }

  function formatDT(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Gerenciar Eventos</h1>
          <p style={{ color: '#6B7280', fontSize: 14, marginTop: 2 }}>Crie, edite e remova eventos da agenda</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Novo Evento</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#6B7280' }}>Carregando...</div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Evento','Data / Hora','Local',''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Nenhum evento cadastrado.</td></tr>
              )}
              {events.map(evt => (
                <tr key={evt.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: evt.color, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{evt.title}</div>
                        {evt.description && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{evt.description.slice(0, 60)}…</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>
                    {formatDT(evt.date)}
                    {evt.endDate && <div style={{ fontSize: 12, color: '#9CA3AF' }}>até {formatDT(evt.endDate)}</div>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{evt.location || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(evt)}>✏️ Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(evt.id)}>🗑️ Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de formulário */}
      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div onClick={e => e.stopPropagation()} className="card" style={{ width: 520, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
              {editing ? '✏️ Editar Evento' : '+ Novo Evento'}
            </h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input className="form-input" placeholder="Nome do evento" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Data/hora início *</label>
                  <input type="datetime-local" className="form-input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Data/hora fim</label>
                  <input type="datetime-local" className="form-input" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Local</label>
                <input className="form-input" placeholder="Ex: Sala de Reuniões A" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea className="form-input" rows={3} placeholder="Detalhes do evento..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Cor</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                      width: 32, height: 32, borderRadius: '50%', background: c, border: form.color === c ? '3px solid #111' : '2px solid transparent', cursor: 'pointer',
                    }} />
                  ))}
                </div>
              </div>
              {error && <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 13 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" /> : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}