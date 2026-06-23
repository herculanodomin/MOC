import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pssrApi } from '../api/pssr';

export function PssrSection({ mocId, canEdit }: { mocId: number; canEdit: boolean }) {
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState('');

  const { data: items } = useQuery({
    queryKey: ['pssr', mocId],
    queryFn: () => pssrApi.list(mocId).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () => pssrApi.create(mocId, newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pssr', mocId] });
      setNewItem('');
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => pssrApi.complete(mocId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pssr', mocId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => pssrApi.remove(mocId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pssr', mocId] }),
  });

  const allComplete = items?.length > 0 && items.every((i: any) => i.isCompleted);

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' }}>
          PSSR — Pre-Startup Safety Review
        </h3>
        {allComplete && (
          <span className="badge badge-success">Completo</span>
        )}
      </div>

      {items?.length === 0 && (
        <p style={{ color: 'var(--gray-400)', marginBottom: 16 }}>Nenhum item cadastrado.</p>
      )}

      <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items?.map((item: any) => (
          <div
            key={item.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px',
              background: item.isCompleted ? 'var(--success-light)' : '#fff',
              border: `1px solid ${item.isCompleted ? '#bbf7d0' : 'var(--gray-200)'}`,
              borderRadius: 'var(--radius)',
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: 4, flexShrink: 0,
              background: item.isCompleted ? 'var(--success)' : '#fff',
              border: `2px solid ${item.isCompleted ? 'var(--success)' : 'var(--gray-300)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {item.isCompleted && (
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" width="12" height="12">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              )}
            </div>
            <span style={{
              flex: 1, fontSize: 14,
              textDecoration: item.isCompleted ? 'line-through' : 'none',
              color: item.isCompleted ? 'var(--gray-500)' : 'var(--gray-700)',
            }}>
              {item.description}
            </span>
            {!item.isCompleted && canEdit && (
              <button className="btn btn-success btn-sm" onClick={() => completeMutation.mutate(item.id)}>
                Concluir
              </button>
            )}
            {canEdit && (
              <button className="btn btn-danger btn-sm" onClick={() => deleteMutation.mutate(item.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {!allComplete && items?.length > 0 && (
        <p style={{ color: 'var(--warning)', fontSize: 13, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          Complete todos os itens para liberar o PSSR.
        </p>
      )}

      {canEdit && (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Novo item do checklist..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && newItem && createMutation.mutate()}
          />
          <button className="btn btn-primary" onClick={() => createMutation.mutate()} disabled={!newItem}>
            + Adicionar
          </button>
        </div>
      )}
    </div>
  );
}
