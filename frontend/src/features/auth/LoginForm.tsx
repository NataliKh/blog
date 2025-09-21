import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "./api/auth-api";
import { useAuthStore } from "../../app/providers/auth-store";
import { Button } from "../../shared/ui/button/Button";
import { Input } from "../../shared/ui/input/Input";

interface FormValues {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>();

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

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <h2>Вход</h2>
      <label>
        Email
        <Input type="email" {...register("email", { required: "Укажите email" })} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </label>
      <label>
        Пароль
        <Input type="password" {...register("password", { required: "Укажите пароль" })} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </label>
      {mutation.isError && <p className="error">Неверные учетные данные</p>}
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Загрузка..." : "Войти"}
      </Button>
    </form>
  );
};
