import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchArticle } from "../../entities/article/api/article-api";
import { CommentSection } from "../../widgets/comment-section/CommentSection";
export const ArticlePage = () => {
    const { slug } = useParams();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["article", slug],
        queryFn: () => fetchArticle(slug ?? ""),
        enabled: Boolean(slug)
    });
    const articleId = useMemo(() => {
        if (!data) {
            return "";
        }
        return data.id ?? data._id ?? "";
    }, [data]);
    if (!slug) {
        return _jsx("p", { className: "error", children: "\u0421\u0442\u0430\u0442\u044C\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" });
    }
    if (isLoading) {
        return _jsx("p", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    }
    if (isError || !data) {
        return _jsx("p", { className: "error", children: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u044C\u044E" });
    }
    return (_jsxs("article", { className: "page", children: [_jsx("h1", { children: data.title }), data.publishedAt && (_jsxs("p", { className: "meta", children: ["\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E: ", new Date(data.publishedAt).toLocaleDateString()] })), _jsx("div", { className: "content", style: { whiteSpace: "pre-line" }, children: data.content }), articleId && _jsx(CommentSection, { articleId: articleId })] }));
};
