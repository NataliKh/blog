import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../app/providers/auth-store";
import { Button } from "../../shared/ui/button/Button";
export const Header = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    return (_jsxs("header", { className: "header", children: [_jsx(Link, { to: "/", className: "logo", children: "\u0411\u043B\u043E\u0433" }), _jsxs("nav", { className: "nav", children: [_jsx(NavLink, { to: "/", end: true, children: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" }), user && (_jsx(NavLink, { to: "/articles/new", children: "\u041D\u043E\u0432\u0430\u044F \u0441\u0442\u0430\u0442\u044C\u044F" })), user?.role === "admin" && (_jsx(NavLink, { to: "/admin", children: "\u0410\u0434\u043C\u0438\u043D\u043A\u0430" }))] }), _jsx("div", { className: "header-actions", children: user ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "user-name", children: user.name }), _jsx(Button, { variant: "ghost", onClick: handleLogout, children: "\u0412\u044B\u0439\u0442\u0438" })] })) : (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", onClick: () => navigate("/auth/login"), children: "\u0412\u043E\u0439\u0442\u0438" }), _jsx(Button, { onClick: () => navigate("/auth/register"), children: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F" })] })) })] }));
};
