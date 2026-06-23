import api from './client';

export interface CreateMocData {
  title: string;
  description: string;
  changeType: string;
  location?: string;
  responsibleArea?: string;
  justification: string;
}

export const mocApi = {
  list: (status?: string) => api.get('/mocs', { params: { status } }),
  getById: (id: number) => api.get(`/mocs/${id}`),
  create: (data: CreateMocData) => api.post('/mocs', data),
  update: (id: number, data: Partial<CreateMocData>) => api.patch(`/mocs/${id}`, data),
  updateStatus: (id: number, status: string) => api.patch(`/mocs/${id}/status`, { status }),
  submitForAcceptance: (id: number, data: { acceptorId: number; ownerId?: number }) =>
    api.post(`/mocs/${id}/submit`, data),
  accept: (id: number, data: { accepted: boolean; rejectionReason?: string }) =>
    api.post(`/mocs/${id}/accept`, data),
  advance: (id: number) => api.post(`/mocs/${id}/advance`),
  setRiskLevel: (id: number, riskLevel: string) =>
    api.post(`/mocs/${id}/risk-level`, { riskLevel }),
  close: (id: number, data: { result: string; issuesFound?: string; lessonsLearned?: string }) =>
    api.post(`/mocs/${id}/close`, data),
};
