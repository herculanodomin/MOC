import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { actionApi } from '../api/action';

export function ActionsPlanSection({ mocId, canEdit }: { mocId: number; canEdit: boolean }) {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('');
  const [responsibleId, setResponsibleId] = useState<number>(0);

  const { data: actions } = useQuery({
    queryKey: ['actions', mocId],
    queryFn: () => actionApi.list(mocId).then((r) => r.data),
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => import('../api/auth').then(() =>
      fetch('/api/v1/users', { headers: { Authorization: `Bearer ${localStorage.getItem('@moc:token')}` } }).then(r => r.json())
    ).catch(() => []),
    enabled: canEdit,
  });

  const createMutation = useMutation({
    mutationFn: () => actionApi.create(mocId, { description, responsibleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions', mocId] });
      setDescription(''); setResponsibleId(0);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      actionApi.update(mocId, id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['actions', mocId] }),
  });

  return (
    <div className="card">
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 16 }}>Plano de Implementação</h3>

      {actions?.length > 0 && (
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table>
            <thead>
              <tr>
                <th>Ação</th>
                <th>Responsável</th>
                <th>Status</th>
                {canEdit && <th></th>}
              </tr>
            </thead>
            <tbody>
              {actions.map((a: any) => (
                <tr key={a.id}>
                  <td>{a.description}</td>
                  <td>{a.responsible?.name || '-'}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) => statusMutation.mutate({ id: a.id, status: e.target.value })}
                      disabled={!canEdit}
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-300)', fontSize: 13 }}
                    >
                      <option value="PENDING">Pendente</option>
                      <option value="IN_PROGRESS">Em andamento</option>
                      <option value="COMPLETED">Concluído</option>
                    </select>
                  </td>
                  {canEdit && (
                    <td>
                      <span className={`badge ${a.status === 'COMPLETED' ? 'badge-success' : a.status === 'IN_PROGRESS' ? 'badge-active' : 'badge-draft'}`}>
                        {a.status === 'COMPLETED' ? 'Concluído' : a.status === 'IN_PROGRESS' ? 'Em andamento' : 'Pendente'}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {actions?.length === 0 && (
        <p style={{ color: 'var(--gray-400)', marginBottom: 16 }}>Nenhuma ação cadastrada.</p>
      )}

      {canEdit && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4, display: 'block' }}>Descrição da Ação</label>
            <input placeholder="Descreva a ação necessária" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div style={{ minWidth: 180 }}>
            <label style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4, display: 'block' }}>Responsável</label>
            <select value={responsibleId} onChange={(e) => setResponsibleId(Number(e.target.value))}>
              <option value={0}>Selecione...</option>
              {(Array.isArray(users) ? users : []).map((u: any) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => createMutation.mutate()} style={{ marginBottom: 1 }}>
            + Adicionar
          </button>
        </div>
      )}
    </div>
  );
}
