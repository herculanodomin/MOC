import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mocApi } from '../../api/moc';

export function MocFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '', description: '', changeType: '',
    location: '', responsibleArea: '', justification: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: existing } = useQuery({
    queryKey: ['moc', Number(id)],
    queryFn: () => mocApi.getById(Number(id)).then((r) => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        description: existing.description,
        changeType: existing.changeType,
        location: existing.location || '',
        responsibleArea: existing.responsibleArea || '',
        justification: existing.justification,
      });
    }
  }, [existing]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await mocApi.update(Number(id), form);
        navigate(`/mocs/${id}`);
      } else {
        const { data } = await mocApi.create(form);
        navigate(`/mocs/${data.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Erro ao ${isEdit ? 'atualizar' : 'criar'} MOC`);
    } finally {
      setLoading(false);
    }
  }

  const update = (field: string) => (e: any) => setForm({ ...form, [field]: e.target.value });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Editar MOC' : 'Nova MOC'}</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 2 }}>
            {isEdit ? `Editando MOC #${id}` : 'Preencha os dados da solicitação de mudança'}
          </p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate(isEdit ? `/mocs/${id}` : '/mocs')}>
          &larr; Voltar
        </button>
      </div>

      {error && <div className="toast toast-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div>
              <label style={label}>Título da Mudança</label>
              <input value={form.title} onChange={update('title')} required placeholder="Ex: Substituição da Bomba B-101" />
            </div>
            <div>
              <label style={label}>Tipo de Mudança</label>
              <select value={form.changeType} onChange={update('changeType')} required>
                <option value="">Selecione...</option>
                <option value="PROCEDIMENTAL">Procedimental</option>
                <option value="EQUIPAMENTO">Equipamento</option>
                <option value="PESSOAL">Pessoal</option>
                <option value="PROCESSO">Processo</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Descrição</label>
              <textarea value={form.description} onChange={update('description')} required rows={3} placeholder="Descreva detalhadamente a mudança proposta..." />
            </div>
            <div>
              <label style={label}>Localização</label>
              <input value={form.location} onChange={update('location')} placeholder="Ex: Área de utilidades, Setor A" />
            </div>
            <div>
              <label style={label}>Área Responsável</label>
              <input value={form.responsibleArea} onChange={update('responsibleArea')} placeholder="Ex: Manutenção, Operações" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Justificativa</label>
              <textarea value={form.justification} onChange={update('justification')} required rows={3} placeholder="Por que esta mudança é necessária?" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate(isEdit ? `/mocs/${id}` : '/mocs')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar MOC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const label: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600,
  color: 'var(--gray-700)', marginBottom: 4,
};
