import api from './client';

export const auditApi = {
  list: (params?: { entityType?: string; userId?: number }) =>
    api.get('/audit', { params }),
  findByMoc: (mocId: number) => api.get(`/audit/moc/${mocId}`),
};
