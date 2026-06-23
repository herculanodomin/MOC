import api from './client';

export const approvalApi = {
  list: (mocId: number) => api.get(`/mocs/${mocId}/approvals`),
  approve: (mocId: number, data: { isApproved: boolean; comments?: string }) =>
    api.post(`/mocs/${mocId}/approvals`, data),
};
