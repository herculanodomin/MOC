import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mocApi } from '../api/moc';

export function ClosureSection({ mocId, canClose, status }: { mocId: number; canClose: boolean; status: string }) {
  const queryClient = useQueryClient();
  const [result, setResult] = useState('');
  const [issuesFound, setIssuesFound] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');

  const closeMutation = useMutation({
    mutationFn: () => mocApi.close(mocId, { result, issuesFound, lessonsLearned }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moc', mocId] });
      setResult(''); setIssuesFound(''); setLessonsLearned('');
    },
  });

  if (status !== 'IMPLEMENTED') return null;

  return (
    <div style={{ padding: 16, background: '#e8f5e9', borderRadius: 8, marginBottom: 16 }}>
      <h3 style={{ marginBottom: 12 }}>Encerramento da MOC</h3>

      {canClose ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea
            placeholder="Resultado obtido"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            rows={2}
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
          />
          <textarea
            placeholder="Problemas encontrados"
            value={issuesFound}
            onChange={(e) => setIssuesFound(e.target.value)}
            rows={2}
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
          />
          <textarea
            placeholder="Lições aprendidas"
            value={lessonsLearned}
            onChange={(e) => setLessonsLearned(e.target.value)}
            rows={2}
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
          />
          <button onClick={() => closeMutation.mutate()} style={btnPrimary}>
            Encerrar MOC
          </button>
        </div>
      ) : (
        <p style={{ color: '#666', fontSize: 14 }}>
          Esta MOC está implementada e aguardando encerramento pelo Change Owner.
        </p>
      )}
    </div>
  );
}

const btnPrimary: React.CSSProperties = { padding: '10px 24px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', alignSelf: 'flex-start' };
