import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mocApi } from '../../api/moc';
import { useAuth } from '../../contexts/AuthContext';
import { RiskAssessmentSection } from '../../components/RiskAssessmentSection';
import { ActionsPlanSection } from '../../components/ActionsPlanSection';
import { PssrSection } from '../../components/PssrSection';
import { ApprovalSection } from '../../components/ApprovalSection';

const statusLabels: Record<string, string> = {
  DRAFT: 'Rascunho', PENDING_ACCEPTANCE: 'Aguarda Aceitação',
  UNDER_REVIEW: 'Em Análise', RISK_ASSESSMENT: 'Avaliação de Risco',
  IMPLEMENTATION_PLANNING: 'Plano de Ação', PENDING_APPROVAL: 'Aguarda Aprovação',
  APPROVED: 'Aprovado', IN_IMPLEMENTATION: 'Em Implementação',
  PSSR_PENDING: 'PSSR Pendente', IMPLEMENTED: 'Implementado',
  CLOSED: 'Encerrado', REJECTED: 'Rejeitado', CANCELLED: 'Cancelado',
};

const statusBadge: Record<string, string> = {
  DRAFT: 'badge-draft', PENDING_ACCEPTANCE: 'badge-pending',
  RISK_ASSESSMENT: 'badge-active', IMPLEMENTATION_PLANNING: 'badge-active',
  PENDING_APPROVAL: 'badge-pending', APPROVED: 'badge-success',
  IN_IMPLEMENTATION: 'badge-active', PSSR_PENDING: 'badge-pending',
  IMPLEMENTED: 'badge-success', CLOSED: 'badge-success',
  REJECTED: 'badge-danger', CANCELLED: 'badge-danger',
};

type Tab = 'detalhes' | 'riscos' | 'acoes' | 'pssr' | 'aprovacoes' | 'auditoria';

export function MocDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('detalhes');
  const [submitOpen, setSubmitOpen] = useState(false);
  const [selectedAcceptor, setSelectedAcceptor] = useState(0);
  const [closureResult, setClosureResult] = useState('');
  const [closureIssues, setClosureIssues] = useState('');
  const [closureLessons, setClosureLessons] = useState('');
  const [error, setError] = useState('');

  const { data: moc, isLoading } = useQuery({
    queryKey: ['moc', Number(id)],
    queryFn: () => mocApi.getById(Number(id)).then((r) => r.data),
    enabled: !!id,
  });

  const { data: usersList } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/v1/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('@moc:token')}` },
    }).then((r) => r.json()),
    enabled: submitOpen,
  });

  const advanceMutation = useMutation({
    mutationFn: () => mocApi.advance(Number(id)),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['moc', Number(id)] }); setError(''); },
    onError: (err: any) => setError(err.response?.data?.message || 'Erro ao avançar'),
  });

  const submitMutation = useMutation({
    mutationFn: () => mocApi.submitForAcceptance(Number(id), { acceptorId: selectedAcceptor }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['moc', Number(id)] }); setSubmitOpen(false); setError(''); },
    onError: (err: any) => setError(err.response?.data?.message || 'Erro ao submeter'),
  });

  const closeMutation = useMutation({
    mutationFn: () => mocApi.close(Number(id), { result: closureResult, issuesFound: closureIssues, lessonsLearned: closureLessons }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['moc', Number(id)] }); setError(''); },
    onError: (err: any) => setError(err.response?.data?.message || 'Erro ao encerrar'),
  });

  if (isLoading) return <div className="card">{' '}<div className="skeleton" style={{ height: 100 }} /></div>;
  if (!moc) return <div className="card empty-state"><h3>MOC não encontrada</h3></div>;

  const isRequester = user?.id === moc.requesterId;
  const isAcceptor = user?.id === moc.acceptorId;
  const isOwner = user?.id === moc.ownerId;
  const isAdmin = user?.role === 'ADMIN';
  const isApprover = user?.role === 'CHANGE_APPROVER' || isAdmin;
  const canEdit = isRequester || isOwner || isAdmin;

  function renderFlowActions() {
    switch (moc.status) {
      case 'DRAFT':
        if (!isRequester && !isAdmin) return null;
        return (
          <FlowCard title="Submeter para Aceitação">
            {!submitOpen ? (
              <button className="btn btn-primary btn-lg" onClick={() => setSubmitOpen(true)}>Submeter MOC</button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <select value={selectedAcceptor} onChange={(e) => setSelectedAcceptor(Number(e.target.value))}>
                  <option value={0}>Selecione o Acceptor...</option>
                  {(Array.isArray(usersList) ? usersList.filter((u: any) => u.role === 'CHANGE_ACCEPTOR' || u.role === 'ADMIN') : []).map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" onClick={() => submitMutation.mutate()} disabled={!selectedAcceptor}>Confirmar</button>
                  <button className="btn btn-outline" onClick={() => setSubmitOpen(false)}>Cancelar</button>
                </div>
              </div>
            )}
          </FlowCard>
        );

      case 'PENDING_ACCEPTANCE':
        return (
          <FlowCard title="Aceitação Pendente">
            <p style={{ marginBottom: 12, color: 'var(--gray-500)' }}>Aguardando aceitação de <strong>{moc.acceptor?.name}</strong></p>
            {(isAcceptor || isAdmin) && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-success btn-lg" onClick={() => mocApi.accept(Number(id), { accepted: true }).then(() => queryClient.invalidateQueries({ queryKey: ['moc', Number(id)] }))}>
                  Aceitar Mudança
                </button>
                <button className="btn btn-danger btn-lg" onClick={() => mocApi.accept(Number(id), { accepted: false }).then(() => queryClient.invalidateQueries({ queryKey: ['moc', Number(id)] }))}>
                  Rejeitar
                </button>
              </div>
            )}
          </FlowCard>
        );

      case 'RISK_ASSESSMENT':
        return (
          <FlowCard title="Avaliação de Riscos">
            <p style={{ marginBottom: 12, color: 'var(--gray-500)' }}>
              {moc.riskAssessments?.length > 0
                ? `${moc.riskAssessments.length} risco(s) cadastrado(s).`
                : 'Nenhum risco cadastrado ainda.'}
            </p>
            {(canEdit || isRequester) && (
              <button className="btn btn-primary" onClick={() => advanceMutation.mutate()} disabled={advanceMutation.isPending}>
                Avançar para Plano de Implementação
              </button>
            )}
          </FlowCard>
        );

      case 'IMPLEMENTATION_PLANNING':
        return (
          <FlowCard title="Plano de Implementação">
            <p style={{ marginBottom: 12, color: 'var(--gray-500)' }}>
              {moc.actions?.length > 0
                ? `${moc.actions.length} ação(ões) cadastrada(s).`
                : 'Nenhuma ação cadastrada.'}
            </p>
            {canEdit && (
              <button className="btn btn-primary" onClick={() => advanceMutation.mutate()} disabled={advanceMutation.isPending}>
                Solicitar Aprovação
              </button>
            )}
          </FlowCard>
        );

      case 'PENDING_APPROVAL':
        return (
          <FlowCard title="Aprovação Pendente">
            <p style={{ marginBottom: 12, color: 'var(--gray-500)' }}>
              {moc.approvals?.length > 0
                ? `${moc.approvals.length} aprovação(ões) registrada(s).`
                : 'Nenhuma aprovação ainda.'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--primary)' }}>Use a aba "Aprovações" para aprovar ou rejeitar.</p>
            {canEdit && (
              <div style={{ marginTop: 8 }}>
                <button className="btn btn-primary" onClick={() => advanceMutation.mutate()} disabled={advanceMutation.isPending}>
                  Avançar (se todas aprovações ok)
                </button>
              </div>
            )}
          </FlowCard>
        );

      case 'APPROVED':
        return (
          <FlowCard title="Implementação" color="var(--success-light)">
            <p style={{ marginBottom: 12, color: 'var(--gray-500)' }}>MOC aprovada. Iniciar implementação?</p>
            {canEdit && (
              <button className="btn btn-success btn-lg" onClick={() => advanceMutation.mutate()} disabled={advanceMutation.isPending}>
                Iniciar Implementação
              </button>
            )}
          </FlowCard>
        );

      case 'IN_IMPLEMENTATION':
        return (
          <FlowCard title="Em Implementação">
            <p style={{ marginBottom: 12, color: 'var(--gray-500)' }}>
              Implementação iniciada em {new Date(moc.startedAt).toLocaleString()}.
              Complete as ações e solicite o PSSR.
            </p>
            {canEdit && (
              <button className="btn btn-primary" onClick={() => advanceMutation.mutate()} disabled={advanceMutation.isPending}>
                Solicitar PSSR
              </button>
            )}
          </FlowCard>
        );

      case 'PSSR_PENDING':
        return (
          <FlowCard title="PSSR Pendente">
            <p style={{ marginBottom: 12, color: 'var(--gray-500)' }}>
              Complete todos os itens do checklist PSSR na aba correspondente.
            </p>
            {canEdit && (
              <button className="btn btn-success btn-lg" onClick={() => advanceMutation.mutate()} disabled={advanceMutation.isPending}>
                Concluir PSSR
              </button>
            )}
          </FlowCard>
        );

      case 'IMPLEMENTED':
        return (
          <FlowCard title="Encerramento" color="var(--success-light)">
            {!moc.closureInfo ? (
              <>
                <p style={{ marginBottom: 12, color: 'var(--gray-500)' }}>
                  MOC implementada. Preencha os dados de encerramento.
                </p>
                {(isOwner || isAdmin) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <textarea rows={2} placeholder="Resultado obtido" value={closureResult} onChange={(e) => setClosureResult(e.target.value)} />
                    <textarea rows={2} placeholder="Problemas encontrados" value={closureIssues} onChange={(e) => setClosureIssues(e.target.value)} />
                    <textarea rows={2} placeholder="Lições aprendidas" value={closureLessons} onChange={(e) => setClosureLessons(e.target.value)} />
                    <button className="btn btn-success btn-lg" onClick={() => closeMutation.mutate()} disabled={closeMutation.isPending || !closureResult}>
                      Encerrar MOC
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: 'var(--success)' }}>MOC encerrada em {new Date(moc.closureInfo.closedAt).toLocaleString()}</p>
            )}
          </FlowCard>
        );

      default:
        return null;
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'detalhes', label: 'Detalhes' },
    { key: 'riscos', label: 'Riscos' },
    { key: 'acoes', label: 'Ações' },
    { key: 'pssr', label: 'PSSR' },
    { key: 'aprovacoes', label: 'Aprovações' },
    { key: 'auditoria', label: 'Auditoria' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/mocs')}>&larr; Voltar</button>
            <span style={{ fontSize: 14, color: 'var(--gray-400)', fontWeight: 500 }}>MOC #{moc.id}</span>
          </div>
          <h1 className="page-title">{moc.title}</h1>
        </div>
        <span className={`badge ${statusBadge[moc.status] || 'badge-draft'}`}>
          <span className="badge-dot" />
          {statusLabels[moc.status]}
        </span>
      </div>

      {error && <div className="toast toast-error">{error}</div>}

      {renderFlowActions()}

      <div className="tabs">
        {tabs.map((t) => (
          <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'detalhes' && <DetailsTab moc={moc} />}
      {tab === 'riscos' && <RiskAssessmentSection mocId={moc.id} canEdit={canEdit || isRequester} />}
      {tab === 'acoes' && <ActionsPlanSection mocId={moc.id} canEdit={canEdit} />}
      {tab === 'pssr' && <PssrSection mocId={moc.id} canEdit={canEdit} />}
      {tab === 'aprovacoes' && <ApprovalSection mocId={moc.id} canApprove={isApprover} />}
      {tab === 'auditoria' && <AuditTab mocId={moc.id} />}
    </div>
  );
}

function FlowCard({ title, children, color }: { title: string; children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      padding: 16, marginBottom: 20, borderRadius: 'var(--radius)',
      background: color || 'var(--warning-light)',
      border: `1px solid ${color ? '#bbf7d0' : '#fde68a'}`,
    }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--gray-800)' }}>{title}</h3>
      {children}
    </div>
  );
}

function DetailsTab({ moc }: { moc: any }) {
  const info = [
    { label: 'Tipo', value: moc.changeType },
    { label: 'Localização', value: moc.location || '-' },
    { label: 'Área Responsável', value: moc.responsibleArea || '-' },
    { label: 'Solicitante', value: moc.requester?.name },
    { label: 'Acceptor', value: moc.acceptor?.name || '-' },
    { label: 'Change Owner', value: moc.owner?.name || '-' },
    { label: 'Data Solicitação', value: new Date(moc.requestedDate).toLocaleDateString('pt-BR') },
    { label: 'Nível de Risco', value: moc.riskLevel || 'Não avaliado' },
    { label: 'Criado em', value: new Date(moc.createdAt).toLocaleString('pt-BR') },
  ];
  return (
    <div>
      <div className="info-grid">
        {info.map((i) => (
          <div key={i.label} className="info-box">
            <div className="info-label">{i.label}</div>
            <div className="info-value">{i.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 8 }}>Descrição</h3>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.7 }}>{moc.description}</p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 8 }}>Justificativa</h3>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.7 }}>{moc.justification}</p>
      </div>

      {moc.closureInfo && (
        <div className="card" style={{ background: 'var(--success-light)', border: '1px solid #bbf7d0' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#166534', marginBottom: 8 }}>Encerramento</h3>
          <p style={{ fontSize: 14, color: '#166534' }}><strong>Resultado:</strong> {moc.closureInfo.result}</p>
          {moc.closureInfo.issuesFound && <p style={{ fontSize: 14, color: '#166534' }}><strong>Problemas:</strong> {moc.closureInfo.issuesFound}</p>}
          {moc.closureInfo.lessonsLearned && <p style={{ fontSize: 14, color: '#166534' }}><strong>Lições:</strong> {moc.closureInfo.lessonsLearned}</p>}
          <p style={{ fontSize: 14, color: '#166534' }}><strong>Data:</strong> {new Date(moc.closureInfo.closedAt).toLocaleString('pt-BR')}</p>
        </div>
      )}
    </div>
  );
}

function AuditTab({ mocId }: { mocId: number }) {
  const { data: logs } = useQuery({
    queryKey: ['audit', mocId],
    queryFn: () => fetch(`/api/v1/audit/moc/${mocId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('@moc:token')}` },
    }).then((r) => r.json()),
  });
  if (!logs?.length) return <div className="card empty-state"><h3>Nenhum registro de auditoria</h3></div>;
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Usuário</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log: any) => (
            <tr key={log.id}>
              <td style={{ color: 'var(--gray-500)' }}>{new Date(log.createdAt).toLocaleString('pt-BR')}</td>
              <td>{log.user?.name}</td>
              <td>{log.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
