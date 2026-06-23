import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mocApi } from '../api/moc';

export function AcceptanceSection({
  mocId, canAccept, status,
}: {
  mocId: number; canAccept: boolean; status: string;
}) {
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: (accepted: boolean) => mocApi.accept(mocId, { accepted }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moc', mocId] });
    },
  });

  if (status !== 'PENDING_ACCEPTANCE') return null;

  return (
    <div style={{ padding: 16, background: '#fff3e0', borderRadius: 8, marginBottom: 16 }}>
      <h3 style={{ marginBottom: 8 }}>Avaliação da Mudança</h3>
      <p style={{ marginBottom: 12, color: '#666', fontSize: 14 }}>
        Esta MOC está aguardando sua aceitação para dar início à análise.
      </p>
      {canAccept && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => acceptMutation.mutate(true)} style={btnApprove}>
            Aprovar para Análise
          </button>
          <button onClick={() => acceptMutation.mutate(false)} style={btnReject}>
            Rejeitar
          </button>
        </div>
      )}
    </div>
  );
}

const btnApprove: React.CSSProperties = { padding: '8px 24px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' };
const btnReject: React.CSSProperties = { padding: '8px 24px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' };
