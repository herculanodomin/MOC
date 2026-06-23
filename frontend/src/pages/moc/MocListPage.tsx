import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mocApi } from '../../api/moc';

const statusConfig: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Rascunho', className: 'badge-draft' },
  PENDING_ACCEPTANCE: { label: 'Aguarda Aceitação', className: 'badge-pending' },
  RISK_ASSESSMENT: { label: 'Avaliação de Risco', className: 'badge-active' },
  IMPLEMENTATION_PLANNING: { label: 'Plano de Ação', className: 'badge-active' },
  PENDING_APPROVAL: { label: 'Aguarda Aprovação', className: 'badge-pending' },
  APPROVED: { label: 'Aprovado', className: 'badge-success' },
  IN_IMPLEMENTATION: { label: 'Em Implementação', className: 'badge-active' },
  PSSR_PENDING: { label: 'PSSR Pendente', className: 'badge-pending' },
  IMPLEMENTED: { label: 'Implementado', className: 'badge-success' },
  CLOSED: { label: 'Encerrado', className: 'badge-success' },
  REJECTED: { label: 'Rejeitado', className: 'badge-danger' },
  CANCELLED: { label: 'Cancelado', className: 'badge-danger' },
};

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'open', label: 'Abertas' },
  { key: 'PENDING_ACCEPTANCE', label: 'Aceitação' },
  { key: 'RISK_ASSESSMENT', label: 'Riscos' },
  { key: 'PENDING_APPROVAL', label: 'Aprovação' },
  { key: 'IN_IMPLEMENTATION', label: 'Implementação' },
  { key: 'CLOSED', label: 'Encerradas' },
];

const typeOptions = [
  { value: '', label: 'Todos os tipos' },
  { value: 'PROCEDIMENTAL', label: 'Procedimental' },
  { value: 'EQUIPAMENTO', label: 'Equipamento' },
  { value: 'PESSOAL', label: 'Pessoal' },
  { value: 'PROCESSO', label: 'Processo' },
  { value: 'OUTRO', label: 'Outro' },
];

export function MocListPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { data: mocs, isLoading } = useQuery({
    queryKey: ['mocs'],
    queryFn: () => mocApi.list().then((r) => r.data),
  });

  const filtered = useMemo(() => {
    if (!mocs) return [];
    return mocs.filter((m: any) => {
      if (filter === 'open') {
        if (m.status === 'CLOSED' || m.status === 'REJECTED' || m.status === 'CANCELLED') return false;
      } else if (filter !== 'all' && m.status !== filter) {
        return false;
      }
      if (typeFilter && m.changeType !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.justification.toLowerCase().includes(q) ||
          (m.requester?.name || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [mocs, filter, search, typeFilter]);

  const openCount = mocs?.filter((m: any) => !['CLOSED', 'REJECTED', 'CANCELLED'].includes(m.status)).length || 0;
  const closedCount = mocs?.filter((m: any) => m.status === 'CLOSED').length || 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">MOCs</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 2 }}>
            {mocs?.length || 0} total &middot; {openCount} abertas &middot; {closedCount} encerradas
          </p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/mocs/new')}>
          + Nova MOC
        </button>
      </div>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ width: 'auto', minWidth: 160, padding: '6px 12px', fontSize: 13 }}
        >
          {typeOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            placeholder="Buscar MOCs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="card">
          {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: 48, marginBottom: 8 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/></svg>
          <h3>Nenhuma MOC encontrada</h3>
          <p>Crie uma nova MOC ou ajuste os filtros.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Solicitante</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((moc: any) => {
                const cfg = statusConfig[moc.status] || { label: moc.status, className: 'badge-draft' };
                return (
                  <tr
                    key={moc.id}
                    onClick={() => navigate(`/mocs/${moc.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontWeight: 600, color: 'var(--gray-700)' }}>#{moc.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{moc.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {moc.description}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-draft" style={{ fontSize: 11 }}>
                        {moc.changeType}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${cfg.className}`}>
                        <span className="badge-dot" />
                        {cfg.label}
                      </span>
                    </td>
                    <td style={{ color: 'var(--gray-600)' }}>{moc.requester?.name}</td>
                    <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>
                      {new Date(moc.requestedDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={(e) => { e.stopPropagation(); navigate(`/mocs/${moc.id}`); }}
                      >
                        Abrir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
