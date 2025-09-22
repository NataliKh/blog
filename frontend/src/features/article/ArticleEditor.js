import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createArticle, updateArticle } from "../../entities/article/api/article-api";
import { Button } from "../../shared/ui/button/Button";
import { Input } from "../../shared/ui/input/Input";
export const ArticleEditor = ({ article, onSuccess }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: article?.title ?? "",
            content: article?.content ?? "",
            excerpt: article?.excerpt ?? "",
            tags: article?.tags.join(", ") ?? "",
            status: article?.status ?? "draft"
        }
    });
    const mutation = useMutation({
        mutationFn: (values) => {
            const payload = {
                title: values.title,
                content: values.content,
                excerpt: values.excerpt,
                tags: values.tags?.split(",").map((tag) => tag.trim()).filter(Boolean),
                status: values.status
            };
            return article ? updateArticle(article.id, payload) : createArticle(payload);
        },
        onSuccess: (result) => {
            onSuccess?.(result.slug);
        }
    });
    const onSubmit = handleSubmit((values) => mutation.mutate(values));
    return (_jsxs("form", { onSubmit: onSubmit, className: "editor-form", children: [_jsxs("label", { children: ["\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A", _jsx(Input, { ...register("title", { required: "Укажите заголовок" }) }), errors.title && _jsx("span", { className: "error", children: errors.title.message })] }), _jsxs("label", { children: ["\u041A\u0440\u0430\u0442\u043A\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435", _jsx(Input, { ...register("excerpt") })] }), _jsxs("label", { children: ["\u0421\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435", _jsx("textarea", { className: "textarea", ...register("content", { required: "Добавьте содержимое", minLength: { value: 20, message: "Минимум 20 символов" } }) }), errors.content && _jsx("span", { className: "error", children: errors.content.message })] }), _jsxs("label", { children: ["\u0422\u0435\u0433\u0438 (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E)", _jsx(Input, { ...register("tags") })] }), _jsxs("label", { children: ["\u0421\u0442\u0430\u0442\u0443\u0441", _jsxs("select", { ...register("status"), children: [_jsx("option", { value: "draft", children: "\u0427\u0435\u0440\u043D\u043E\u0432\u0438\u043A" }), _jsx("option", { value: "published", children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E" }), _jsx("option", { value: "archived", children: "\u0410\u0440\u0445\u0438\u0432" })] })] }), mutation.isError && _jsx("p", { className: "error", children: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u044C\u044E" }), _jsx(Button, { type: "submit", disabled: mutation.isPending, children: mutation.isPending ? "Сохранение..." : article ? "Обновить" : "Создать" })] }));
};
