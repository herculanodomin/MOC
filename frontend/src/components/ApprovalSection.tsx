import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalApi } from '../api/approval';

export function ApprovalSection({ mocId, canApprove }: { mocId: number; canApprove: boolean }) {
  const queryClient = useQueryClient();
  const [comments, setComments] = useState('');

  const { data: approvals } = useQuery({
    queryKey: ['approvals', mocId],
    queryFn: () => approvalApi.list(mocId).then((r) => r.data),
  });

  const approveMutation = useMutation({
    mutationFn: (isApproved: boolean) =>
      approvalApi.approve(mocId, { isApproved, comments }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals', mocId] });
      queryClient.invalidateQueries({ queryKey: ['moc', mocId] });
      setComments('');
    },
  });

  const allApproved = approvals?.length > 0 && approvals.every((a: any) => a.isApproved);

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' }}>Aprovações</h3>
        {allApproved && <span className="badge badge-success">Todas aprovadas</span>}
      </div>

      {approvals?.length > 0 && (
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table>
            <thead>
              <tr>
                <th>Aprovador</th>
                <th>Decisão</th>
                <th>Comentários</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((a: any) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{a.approver?.name}</td>
                  <td>
                    <span className={`badge ${a.isApproved ? 'badge-success' : 'badge-danger'}`}>
                      {a.isApproved ? 'Aprovado' : 'Rejeitado'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--gray-500)' }}>{a.comments || '-'}</td>
                  <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>
                    {new Date(a.approvedAt).toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {approvals?.length === 0 && (
        <p style={{ color: 'var(--gray-400)', marginBottom: 16 }}>Nenhuma aprovação registrada.</p>
      )}

      {canApprove && (
        <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 16 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 8 }}>Registrar Aprovação</h4>
          <textarea
            placeholder="Comentários (opcional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={2}
            style={{ marginBottom: 8 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-success" onClick={() => approveMutation.mutate(true)} disabled={approveMutation.isPending}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M5 13l4 4L19 7"/></svg>
              Aprovar
            </button>
            <button className="btn btn-danger" onClick={() => approveMutation.mutate(false)} disabled={approveMutation.isPending}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M6 18L18 6M6 6l12 12"/></svg>
              Rejeitar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
