import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { riskApi } from '../api/risk';

export function RiskAssessmentSection({ mocId, canEdit }: { mocId: number; canEdit: boolean }) {
  const queryClient = useQueryClient();
  const [hazard, setHazard] = useState('');
  const [consequence, setConsequence] = useState('');
  const [probability, setProbability] = useState(1);
  const [severity, setSeverity] = useState(1);
  const [mitigation, setMitigation] = useState('');

  const { data: risks } = useQuery({
    queryKey: ['risks', mocId],
    queryFn: () => riskApi.list(mocId).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      riskApi.create(mocId, { hazard, consequence, probability, severity, mitigation }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks', mocId] });
      queryClient.invalidateQueries({ queryKey: ['moc', mocId] });
      setHazard(''); setConsequence(''); setProbability(1); setSeverity(1); setMitigation('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => riskApi.remove(mocId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['risks', mocId] }),
  });

  return (
    <div className="card">
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 16 }}>Avaliação de Riscos</h3>

      {risks?.length > 0 && (
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table>
            <thead>
              <tr>
                <th>Perigo</th>
                <th>Consequência</th>
                <th>Prob</th>
                <th>Sev</th>
                <th>Score</th>
                <th>Nível</th>
                <th>Mitigação</th>
                {canEdit && <th></th>}
              </tr>
            </thead>
            <tbody>
              {risks.map((r: any) => {
                const color = r.riskLevel === 'HIGH' ? 'var(--danger)' : r.riskLevel === 'MEDIUM' ? 'var(--warning)' : 'var(--success)';
                return (
                  <tr key={r.id}>
                    <td>{r.hazard}</td>
                    <td>{r.consequence}</td>
                    <td style={{ textAlign: 'center' }}>{r.probability}</td>
                    <td style={{ textAlign: 'center' }}>{r.severity}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{r.riskScore}</td>
                    <td>
                      <span className="badge" style={{ background: `${color}20`, color }}>{r.riskLevel}</span>
                    </td>
                    <td>{r.mitigation}</td>
                    {canEdit && (
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteMutation.mutate(r.id)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {risks?.length === 0 && (
        <p style={{ color: 'var(--gray-400)', marginBottom: 16 }}>Nenhum risco cadastrado.</p>
      )}

      {canEdit && (
        <div className="grid-2">
          <input placeholder="Perigo" value={hazard} onChange={(e) => setHazard(e.target.value)} />
          <input placeholder="Consequência" value={consequence} onChange={(e) => setConsequence(e.target.value)} />
          <div>
            <label style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4, display: 'block' }}>
              Probabilidade: {probability}
            </label>
            <input type="range" min={1} max={5} value={probability} onChange={(e) => setProbability(Number(e.target.value))} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4, display: 'block' }}>
              Severidade: {severity}
            </label>
            <input type="range" min={1} max={5} value={severity} onChange={(e) => setSeverity(Number(e.target.value))} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="badge" style={{
              background: probability * severity <= 4 ? 'var(--success-light)' : probability * severity <= 12 ? 'var(--warning-light)' : 'var(--danger-light)',
              color: probability * severity <= 4 ? '#166534' : probability * severity <= 12 ? '#92400e' : '#991b1b',
              fontSize: 13, padding: '6px 14px',
            }}>
              Score: {probability * severity} —
              {probability * severity <= 4 ? ' BAIXO' : probability * severity <= 12 ? ' MÉDIO' : ' ALTO'}
            </div>
          </div>
          <input
            placeholder="Medidas mitigadoras"
            value={mitigation}
            onChange={(e) => setMitigation(e.target.value)}
            style={{ gridColumn: '1 / -1' }}
          />
          <button className="btn btn-primary" onClick={() => createMutation.mutate()} style={{ gridColumn: '1 / -1', justifySelf: 'start' }}>
            + Adicionar Risco
          </button>
        </div>
      )}
    </div>
  );
}
