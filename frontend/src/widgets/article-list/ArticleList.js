import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
export const ArticleList = ({ articles }) => {
    if (articles.length === 0) {
        return _jsx("p", { children: "\u041F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0439 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442." });
    }
    return (_jsx("div", { className: "article-list", children: articles.map((article) => (_jsxs("article", { className: "article-card", children: [_jsx("h3", { children: _jsx(Link, { to: `/articles/${article.slug}`, children: article.title }) }), article.excerpt && _jsx("p", { className: "excerpt", children: article.excerpt }), _jsxs("div", { className: "meta", children: [_jsx("span", { children: new Date(article.createdAt).toLocaleDateString() }), article.tags?.length ? _jsx("span", { children: article.tags.join(", ") }) : null] })] }, article.id))) }));
};
