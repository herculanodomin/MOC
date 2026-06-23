import api from './client';

export const dashboardApi = {
  kpis: () => api.get('/dashboard/kpis'),
  byArea: () => api.get('/dashboard/by-area'),
  byType: () => api.get('/dashboard/by-type'),
  byRisk: () => api.get('/dashboard/by-risk'),
  byStatus: () => api.get('/dashboard/by-status'),
};
