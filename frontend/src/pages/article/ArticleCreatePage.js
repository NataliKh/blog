import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArticleEditor } from "../../features/article/ArticleEditor";
import { useAuthStore } from "../../app/providers/auth-store";
export const ArticleCreatePage = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    useEffect(() => {
        if (!user) {
            navigate("/auth/login");
        }
    }, [navigate, user]);
    if (!user) {
        return null;
    }
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { children: "\u041D\u043E\u0432\u0430\u044F \u0441\u0442\u0430\u0442\u044C\u044F" }), _jsx(ArticleEditor, { onSuccess: (slug) => {
                    navigate(`/articles/${slug}`);
                } })] }));
};
