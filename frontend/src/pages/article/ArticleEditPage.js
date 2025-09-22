import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchArticle } from "../../entities/article/api/article-api";
import { ArticleEditor } from "../../features/article/ArticleEditor";
import { useAuthStore } from "../../app/providers/auth-store";
export const ArticleEditPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    useEffect(() => {
        if (!user) {
            navigate("/auth/login");
        }
    }, [navigate, user]);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["article", slug],
        queryFn: () => fetchArticle(slug ?? ""),
        enabled: Boolean(slug && user)
    });
    if (!slug || !user) {
        return null;
    }
    if (isLoading) {
        return _jsx("p", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    }
    if (isError || !data) {
        return _jsx("p", { className: "error", children: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u044C\u044E" });
    }
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0442\u0430\u0442\u044C\u044E" }), _jsx(ArticleEditor, { article: data, onSuccess: (slugValue) => navigate(`/articles/${slugValue}`) })] }));
};
