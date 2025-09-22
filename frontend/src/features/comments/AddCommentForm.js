import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../entities/comment/api/comment-api";
import { useAuthStore } from "../../app/providers/auth-store";
import { Button } from "../../shared/ui/button/Button";
import { Input } from "../../shared/ui/input/Input";
export const AddCommentForm = ({ articleId }) => {
    const user = useAuthStore((state) => state.user);
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const mutation = useMutation({
        mutationFn: (values) => createComment({ articleId, content: values.content }),
        onSuccess: () => {
            reset();
            queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
        }
    });
    if (!user) {
        return _jsx("p", { children: "\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0443\u0439\u0442\u0435\u0441\u044C, \u0447\u0442\u043E\u0431\u044B \u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439." });
    }
    const onSubmit = handleSubmit((values) => mutation.mutate(values));
    return (_jsxs("form", { onSubmit: onSubmit, className: "comment-form", children: [_jsxs("label", { children: ["\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439", _jsx(Input, { ...register("content", { required: "Введите текст комментария" }) }), errors.content && _jsx("span", { className: "error", children: errors.content.message })] }), mutation.isError && _jsx("p", { className: "error", children: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439" }), _jsx(Button, { type: "submit", disabled: mutation.isPending, children: mutation.isPending ? "Отправка..." : "Отправить" })] }));
};
