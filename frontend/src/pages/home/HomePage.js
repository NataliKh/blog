import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "../../entities/article/api/article-api";
import { ArticleList } from "../../widgets/article-list/ArticleList";
export const HomePage = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["articles", { status: "published" }],
        queryFn: () => fetchArticles({ status: "published", limit: 20 })
    });
    if (isLoading) {
        return _jsx("p", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0441\u0442\u0430\u0442\u0435\u0439..." });
    }
    if (isError || !data) {
        return _jsx("p", { className: "error", children: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u044C\u0438" });
    }
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { children: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0441\u0442\u0430\u0442\u044C\u0438" }), _jsx(ArticleList, { articles: data.data })] }));
};
