import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notificationApi } from '../api/notification';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: unread } = useQuery({
    queryKey: ['unread-count'],
    queryFn: () => notificationApi.unreadCount().then((r) => r.data),
    refetchInterval: 30000,
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications-bell'],
    queryFn: () => notificationApi.list().then((r) => r.data),
    enabled: open,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-bell'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const count = typeof unread === 'number' ? unread : 0;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', position: 'relative', padding: '6px 8px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center' }}
        title="Notificações"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {count > 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2, background: 'var(--danger)',
            color: '#fff', borderRadius: '50%', width: 18, height: 18,
            fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', width: 340,
          background: '#fff', borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)', zIndex: 1000, maxHeight: 400,
          overflowY: 'auto', marginTop: 8,
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: 14, color: 'var(--gray-800)' }}>Notificações</strong>
            <button
              onClick={() => { navigate('/notifications'); setOpen(false); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            >
              Ver todas
            </button>
          </div>

          {notifications?.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--gray-400)', fontSize: 14 }}>Nenhuma notificação</div>
          )}

          {notifications?.slice(0, 10).map((n: any) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.isRead) markReadMutation.mutate(n.id);
              }}
              style={{
                padding: '12px 16px', borderBottom: '1px solid var(--gray-100)',
                background: n.isRead ? '#fff' : 'var(--primary-light)',
                cursor: 'pointer', transition: 'background 0.1s',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: n.isRead ? 400 : 600, color: 'var(--gray-800)' }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{n.message}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>
                {new Date(n.createdAt).toLocaleString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
