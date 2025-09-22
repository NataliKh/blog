import { STORAGE_KEY } from '../config/env';
export const getToken = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    return window.localStorage.getItem(STORAGE_KEY);
};
export const setToken = (token) => {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.setItem(STORAGE_KEY, token);
};
export const removeToken = () => {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.removeItem(STORAGE_KEY);
};
