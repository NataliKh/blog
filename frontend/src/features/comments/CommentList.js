import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../../entities/comment/api/comment-api";
export const CommentList = ({ articleId }) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["comments", articleId],
        queryFn: () => fetchComments(articleId)
    });
    if (isLoading) {
        return _jsx("p", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432..." });
    }
    if (isError) {
        return _jsx("p", { className: "error", children: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438" });
    }
    if (!data || data.length === 0) {
        return _jsx("p", { children: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442." });
    }
    return (_jsx("ul", { className: "comment-list", children: data.map((comment) => (_jsxs("li", { children: [_jsxs("div", { className: "comment-meta", children: [_jsx("strong", { children: comment.author?.name ?? "Аноним" }), _jsx("span", { children: new Date(comment.createdAt).toLocaleDateString() })] }), _jsx("p", { children: comment.content })] }, comment.id))) }));
};
