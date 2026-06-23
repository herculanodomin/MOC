import api from './client';

export const pssrApi = {
  list: (mocId: number) => api.get(`/mocs/${mocId}/pssr`),
  create: (mocId: number, description: string) =>
    api.post(`/mocs/${mocId}/pssr`, { description }),
  complete: (mocId: number, id: number) =>
    api.patch(`/mocs/${mocId}/pssr/${id}/complete`),
  remove: (mocId: number, id: number) =>
    api.delete(`/mocs/${mocId}/pssr/${id}`),
  check: (mocId: number) => api.get(`/mocs/${mocId}/pssr/check`),
};
