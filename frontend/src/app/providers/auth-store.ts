import { create } from 'zustand';
import { User } from '../../entities/user/model/types';
import { getToken, removeToken, setToken } from '../../shared/lib/auth-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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
