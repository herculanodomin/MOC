import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboard';

const statusLabels: Record<string, string> = {
  DRAFT: 'Rascunho', PENDING_ACCEPTANCE: 'Aguarda Aceitação',
  UNDER_REVIEW: 'Em Análise', RISK_ASSESSMENT: 'Avaliação de Risco',
  IMPLEMENTATION_PLANNING: 'Plano de Ação', PENDING_APPROVAL: 'Aguarda Aprovação',
  APPROVED: 'Aprovado', IN_IMPLEMENTATION: 'Em Implementação',
  PSSR_PENDING: 'PSSR Pendente', IMPLEMENTED: 'Implementado',
  CLOSED: 'Encerrado', REJECTED: 'Rejeitado', CANCELLED: 'Cancelado',
};

export function DashboardPage() {
  const navigate = useNavigate();

  const { data: kpis } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: () => dashboardApi.kpis().then((r) => r.data),
  });

  const charts = {
    status: useQuery({ queryKey: ['dashboard-status'], queryFn: () => dashboardApi.byStatus().then((r) => r.data) }),
    type: useQuery({ queryKey: ['dashboard-type'], queryFn: () => dashboardApi.byType().then((r) => r.data) }),
    risk: useQuery({ queryKey: ['dashboard-risk'], queryFn: () => dashboardApi.byRisk().then((r) => r.data) }),
    area: useQuery({ queryKey: ['dashboard-area'], queryFn: () => dashboardApi.byArea().then((r) => r.data) }),
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 2 }}>Visão geral do sistema MOC</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/mocs/new')}>
          + Nova MOC
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        <KpiCard label="Total de MOCs" value={kpis?.total ?? '-'} color="#dbeafe" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <KpiCard label="MOCs Abertas" value={kpis?.open ?? '-'} color="#fef3c7" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        <KpiCard label="MOCs Fechadas" value={kpis?.closed ?? '-'} color="#dcfce7" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <KpiCard label="Em Andamento" value={kpis?.overdue ?? '-'} color="#fce4ec" icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </div>

      <div className="grid-2">
        <ChartCard title="Por Status">
          {charts.status.data?.map((s: any) => (
            <Bar key={s.status} label={statusLabels[s.status] || s.status} value={s._count.id} max={kpis?.total || 1} />
          ))}
        </ChartCard>
        <ChartCard title="Por Tipo">
          {charts.type.data?.map((t: any) => (
            <Bar key={t.changeType} label={t.changeType} value={t._count.id} max={kpis?.total || 1} />
          ))}
        </ChartCard>
        <ChartCard title="Por Nível de Risco">
          {charts.risk.data?.map((r: any) => (
            <Bar
              key={r.riskLevel || 'N/A'}
              label={r.riskLevel || 'Não avaliado'}
              value={r._count.id}
              max={kpis?.total || 1}
              color={r.riskLevel === 'HIGH' ? '#dc2626' : r.riskLevel === 'MEDIUM' ? '#f59e0b' : '#16a34a'}
            />
          ))}
        </ChartCard>
        <ChartCard title="Por Área">
          {charts.area.data?.map((a: any) => (
            <Bar key={a.responsibleArea || 'N/A'} label={a.responsibleArea || 'Não definida'} value={a._count.id} max={kpis?.total || 1} />
          ))}
        </ChartCard>
      </div>
    </div>
  );
}

function KpiCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: 'var(--shadow)', border: '1px solid var(--gray-200)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--gray-700)" strokeWidth="2" width="20" height="20">
            <path d={icon} />
          </svg>
        </div>
        <span style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--gray-900)' }}>{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: 'var(--shadow)', border: '1px solid var(--gray-200)' }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 16 }}>{title}</h3>
      {children}
    </div>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
        <span style={{ color: 'var(--gray-600)' }}>{label}</span>
        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{value}</span>
      </div>
      <div style={{ background: 'var(--gray-100)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
        <div style={{ background: color || 'var(--primary)', width: `${Math.min(pct, 100)}%`, height: '100%', borderRadius: 4, transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}
