import api from './client';

export const actionApi = {
  list: (mocId: number) => api.get(`/mocs/${mocId}/actions`),
  create: (mocId: number, data: any) => api.post(`/mocs/${mocId}/actions`, data),
  update: (mocId: number, id: number, data: any) => api.patch(`/mocs/${mocId}/actions/${id}`, data),
  remove: (mocId: number, id: number) => api.delete(`/mocs/${mocId}/actions/${id}`),
};
