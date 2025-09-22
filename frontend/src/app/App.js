import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(BrowserRouter, { children: [_jsx(ProfileLoader, {}), _jsx(Header, {}), _jsx("main", { className: "main", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/articles/new", element: _jsx(ArticleCreatePage, {}) }), _jsx(Route, { path: "/articles/:slug", element: _jsx(ArticlePage, {}) }), _jsx(Route, { path: "/articles/:slug/edit", element: _jsx(ArticleEditPage, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminPage, {}) }), _jsx(Route, { path: "/auth/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/auth/register", element: _jsx(RegisterPage, {}) })] }) })] }));
};
