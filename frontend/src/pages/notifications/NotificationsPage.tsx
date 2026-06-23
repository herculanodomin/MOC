import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../../api/notification';

export function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list().then((r) => r.data),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unread = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notificações</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 2 }}>
            {unread} não lida(s) de {notifications?.length || 0} total
          </p>
        </div>
        {unread > 0 && (
          <button className="btn btn-outline btn-lg" onClick={() => markAllMutation.mutate()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M9 5l7 7-7 7"/>
            </svg>
            Marcar todas como lidas
          </button>
        )}
      </div>

      {isLoading && (
        <div className="card">
          {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 8 }} />)}
        </div>
      )}

      {notifications?.length === 0 && (
        <div className="card empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="1.5" width="48" height="48">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <h3>Nenhuma notificação</h3>
          <p>Você receberá notificações sobre mudanças de status nas MOCs.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifications?.map((n: any) => (
          <div
            key={n.id}
            onClick={() => !n.isRead && markReadMutation.mutate(n.id)}
            style={{
              padding: 16, borderRadius: 'var(--radius)',
              background: n.isRead ? '#fff' : 'var(--primary-light)',
              cursor: n.isRead ? 'default' : 'pointer',
              border: `1px solid ${n.isRead ? 'var(--gray-200)' : 'var(--primary)'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: n.isRead ? 'var(--gray-300)' : 'var(--primary)',
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontWeight: n.isRead ? 400 : 600, fontSize: 14, color: 'var(--gray-800)' }}>{n.title}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{n.message}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)', whiteSpace: 'nowrap', marginLeft: 16 }}>
              {new Date(n.createdAt).toLocaleString('pt-BR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
