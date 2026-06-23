import api from './client';

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string | null;
  isActive: boolean;
}

export const userApi = {
  list: () => api.get<UserData[]>('/users'),
  getById: (id: number) => api.get<UserData>(`/users/${id}`),
  update: (id: number, data: Partial<UserData>) => api.patch(`/users/${id}`, data),
  remove: (id: number) => api.delete(`/users/${id}`),
};
