import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../../api/audit';

export function AuditPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => auditApi.list().then((r) => r.data),
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Auditoria</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 2 }}>
            {logs?.length || 0} registro(s) de atividade
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="card">
          {[1,2,3,4,5].map((i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }} />)}
        </div>
      )}

      {logs?.length === 0 && (
        <div className="card empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="1.5" width="48" height="48"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <h3>Nenhum registro encontrado</h3>
        </div>
      )}

      {logs?.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Usuário</th>
                <th>Ação</th>
                <th>Entidade</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id}>
                  <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>{new Date(log.createdAt).toLocaleString('pt-BR')}</td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{log.user?.name}</span>
                  </td>
                  <td>
                    <span className="badge badge-active" style={{ fontSize: 11 }}>{log.action}</span>
                  </td>
                  <td style={{ color: 'var(--gray-600)' }}>{log.entityType}{log.entityId ? ` #${log.entityId}` : ''}</td>
                  <td style={{ color: 'var(--gray-500)', fontSize: 13, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.details || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
