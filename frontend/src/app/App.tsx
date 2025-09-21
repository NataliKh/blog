import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '../widgets/header/Header';
import { HomePage } from '../pages/home/HomePage';
import { ArticlePage } from '../pages/article/ArticlePage';
import { ArticleCreatePage } from '../pages/article/ArticleCreatePage';
import { ArticleEditPage } from '../pages/article/ArticleEditPage';
import { AdminPage } from '../pages/admin/AdminPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { useAuthStore } from './providers/auth-store';
import { fetchProfile } from '../entities/user/api/user-api';

const ProfileLoader = () => {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const { data, error } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: Boolean(token),
    retry: false
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, logout]);

  return null;
};

export const App = () => {
  return (
    <BrowserRouter>
      <ProfileLoader />
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles/new" element={<ArticleCreatePage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/articles/:slug/edit" element={<ArticleEditPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};
