import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "./api/auth-api";
import { useAuthStore } from "../../app/providers/auth-store";
import { Button } from "../../shared/ui/button/Button";
import { Input } from "../../shared/ui/input/Input";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export const RegisterForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>();

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

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <h2>Регистрация</h2>
      <label>
        Имя
        <Input {...register("name", { required: "Укажите имя" })} />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </label>
      <label>
        Email
        <Input type="email" {...register("email", { required: "Укажите email" })} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </label>
      <label>
        Пароль
        <Input
          type="password"
          {...register("password", { required: "Укажите пароль", minLength: { value: 6, message: "Минимум 6 символов" } })}
        />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </label>
      {mutation.isError && <p className="error">Не удалось создать аккаунт</p>}
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Загрузка..." : "Зарегистрироваться"}
      </Button>
    </form>
  );
};
