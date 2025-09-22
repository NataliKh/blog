import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CommentList } from "../../features/comments/CommentList";
import { AddCommentForm } from "../../features/comments/AddCommentForm";
export const CommentSection = ({ articleId }) => {
    return (_jsxs("section", { className: "comment-section", children: [_jsx("h3", { children: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438" }), _jsx(AddCommentForm, { articleId: articleId }), _jsx(CommentList, { articleId: articleId })] }));
};
