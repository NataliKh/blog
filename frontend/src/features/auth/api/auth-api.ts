import { api } from '../../../shared/api/base';
import { User } from '../../../entities/user/model/types';

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (payload: { email: string; password: string }): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
};

export const register = async (
  payload: { name: string; email: string; password: string }
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  return data;
};
