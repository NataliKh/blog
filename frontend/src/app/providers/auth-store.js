import { create } from 'zustand';
import { getToken, removeToken, setToken } from '../../shared/lib/auth-storage';
export const useAuthStore = create((set) => ({
    user: null,
    token: getToken(),
    setAuth: (user, token) => {
        set({ user, token });
        setToken(token);
    },
    setUser: (user) => set({ user }),
    logout: () => {
        removeToken();
        set({ user: null, token: null });
    }
}));
