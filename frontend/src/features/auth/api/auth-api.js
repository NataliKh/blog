import { api } from '../../../shared/api/base';
export const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    return data;
};
export const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
};
