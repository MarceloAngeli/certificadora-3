// src/pages/CalendarPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [year, month]);

  async function fetchEvents() {
    setLoading(true);
    try {
      const { data } = await api.get(`/events?year=${year}&month=${month + 1}`);
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function eventsForDay(day) {
    return events.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  }

  const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const isToday = (day) => `${year}-${month}-${day}` === todayStr;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Calendário de Eventos</h1>
          <p style={{ color: '#6B7280', fontSize: 14, marginTop: 2 }}>Confira os próximos eventos</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={prevMonth}>‹</button>
          <span style={{ fontWeight: 600, fontSize: 16, minWidth: 160, textAlign: 'center' }}>
            {MONTHS[month]} {year}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={nextMonth}>›</button>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Header dos dias da semana */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #E5E7EB' }}>
          {WEEKDAYS.map(d => (
            <div key={d} style={{ padding: '10px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#6B7280', background: '#F9FAFB' }}>
              {d}
            </div>
          ))}
        </div>
        {/* Grade do calendário */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {cells.map((day, i) => {
            const dayEvents = day ? eventsForDay(day) : [];
            return (
              <div key={i} style={{
                minHeight: 100,
                padding: '8px',
                borderRight: (i + 1) % 7 !== 0 ? '1px solid #F3F4F6' : 'none',
                borderBottom: '1px solid #F3F4F6',
                background: !day ? '#FAFAFA' : '#fff',
              }}>
                {day && (
                  <>
                    <div style={{
                      width: 28, height: 28,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: 13, fontWeight: isToday(day) ? 700 : 400,
                      background: isToday(day) ? '#4F46E5' : 'transparent',
                      color: isToday(day) ? '#fff' : '#374151',
                      marginBottom: 4,
                    }}>
                      {day}
                    </div>
                    {dayEvents.slice(0, 2).map(evt => (
                      <div
                        key={evt.id}
                        onClick={() => setSelected(evt)}
                        style={{
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 500,
                          marginBottom: 2,
                          cursor: 'pointer',
                          background: evt.color + '22',
                          color: evt.color,
                          borderLeft: `3px solid ${evt.color}`,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>
                        +{dayEvents.length - 2} mais
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de detalhe do evento */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="card"
            style={{ width: 440, padding: 28 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: selected.color, marginTop: 4, marginRight: 12, flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>{selected.title}</h2>
                <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>
                  {formatDate(selected.date)}
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <InfoRow icon="🕐" label="Horário">
                {formatTime(selected.date)}
                {selected.endDate && ` – ${formatTime(selected.endDate)}`}
              </InfoRow>
              {selected.location && (
                <InfoRow icon="📍" label="Local">{selected.location}</InfoRow>
              )}
              {selected.description && (
                <InfoRow icon="📝" label="Descrição">{selected.description}</InfoRow>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', marginTop: 24, color: '#6B7280' }}>Carregando...</div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: .5 }}>{label}</div>
        <div style={{ fontSize: 14, color: '#374151', marginTop: 2 }}>{children}</div>
      </div>
    </div>
  );
}