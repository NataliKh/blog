import { api } from '../../../shared/api/base';
import { User } from '../model/types';

export const fetchProfile = async (): Promise<User> => {
  const { data } = await api.get<User>('/auth/me');
  return data;
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get<{ data: User[] }>('/users');
  return data.data;
};

export const updateUser = async (id: string, payload: Partial<User>): Promise<User> => {
  const { data } = await api.patch<User>(`/users/${id}`, payload);
  return data;
};
