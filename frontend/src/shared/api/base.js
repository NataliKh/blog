import axios from 'axios';
import { API_URL } from '../config/env';
import { getToken, removeToken } from '../lib/auth-storage';
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        removeToken();
    }
    return Promise.reject(error);
});
