import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "./api/auth-api";
import { useAuthStore } from "../../app/providers/auth-store";
import { Button } from "../../shared/ui/button/Button";
import { Input } from "../../shared/ui/input/Input";
export const RegisterForm = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: ({ token, user }) => {
            setAuth(user, token);
            navigate("/");
        }
    });
    const onSubmit = handleSubmit((values) => {
        mutation.mutate(values);
    });
    return (_jsxs("form", { onSubmit: onSubmit, className: "auth-form", children: [_jsx("h2", { children: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F" }), _jsxs("label", { children: ["\u0418\u043C\u044F", _jsx(Input, { ...register("name", { required: "Укажите имя" }) }), errors.name && _jsx("span", { className: "error", children: errors.name.message })] }), _jsxs("label", { children: ["Email", _jsx(Input, { type: "email", ...register("email", { required: "Укажите email" }) }), errors.email && _jsx("span", { className: "error", children: errors.email.message })] }), _jsxs("label", { children: ["\u041F\u0430\u0440\u043E\u043B\u044C", _jsx(Input, { type: "password", ...register("password", { required: "Укажите пароль", minLength: { value: 6, message: "Минимум 6 символов" } }) }), errors.password && _jsx("span", { className: "error", children: errors.password.message })] }), mutation.isError && _jsx("p", { className: "error", children: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442" }), _jsx(Button, { type: "submit", disabled: mutation.isPending, children: mutation.isPending ? "Загрузка..." : "Зарегистрироваться" })] }));
};
