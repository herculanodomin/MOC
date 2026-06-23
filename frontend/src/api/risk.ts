import api from './client';

export const riskApi = {
  list: (mocId: number) => api.get(`/mocs/${mocId}/risks`),
  create: (mocId: number, data: any) => api.post(`/mocs/${mocId}/risks`, data),
  remove: (mocId: number, id: number) => api.delete(`/mocs/${mocId}/risks/${id}`),
};
