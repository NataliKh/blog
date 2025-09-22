import { api } from '../../../shared/api/base';
export const fetchProfile = async () => {
    const { data } = await api.get('/auth/me');
    return data;
};
export const fetchUsers = async () => {
    const { data } = await api.get('/users');
    return data.data;
};
export const updateUser = async (id, payload) => {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
};
