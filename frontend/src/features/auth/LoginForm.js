import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "./api/auth-api";
import { useAuthStore } from "../../app/providers/auth-store";
import { Button } from "../../shared/ui/button/Button";
import { Input } from "../../shared/ui/input/Input";
export const LoginForm = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const mutation = useMutation({
        mutationFn: login,
        onSuccess: ({ token, user }) => {
            setAuth(user, token);
            navigate("/");
        }
    });
    const onSubmit = handleSubmit((values) => {
        mutation.mutate(values);
    });
    return (_jsxs("form", { onSubmit: onSubmit, className: "auth-form", children: [_jsx("h2", { children: "\u0412\u0445\u043E\u0434" }), _jsxs("label", { children: ["Email", _jsx(Input, { type: "email", ...register("email", { required: "Укажите email" }) }), errors.email && _jsx("span", { className: "error", children: errors.email.message })] }), _jsxs("label", { children: ["\u041F\u0430\u0440\u043E\u043B\u044C", _jsx(Input, { type: "password", ...register("password", { required: "Укажите пароль" }) }), errors.password && _jsx("span", { className: "error", children: errors.password.message })] }), mutation.isError && _jsx("p", { className: "error", children: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0443\u0447\u0435\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435" }), _jsx(Button, { type: "submit", disabled: mutation.isPending, children: mutation.isPending ? "Загрузка..." : "Войти" })] }));
};
