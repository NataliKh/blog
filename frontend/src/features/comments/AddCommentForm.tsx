import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../entities/comment/api/comment-api";
import { useAuthStore } from "../../app/providers/auth-store";
import { Button } from "../../shared/ui/button/Button";
import { Input } from "../../shared/ui/input/Input";

interface Props {
  articleId: string;
}

interface FormValues {
  content: string;
}

export const AddCommentForm = ({ articleId }: Props) => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>();

  const mutation = useMutation({
    mutationFn: (values: FormValues) => createComment({ articleId, content: values.content }),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
    }
  });

  if (!user) {
    return <p>Авторизуйтесь, чтобы оставить комментарий.</p>;
  }

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <form onSubmit={onSubmit} className="comment-form">
      <label>
        Комментарий
        <Input {...register("content", { required: "Введите текст комментария" })} />
        {errors.content && <span className="error">{errors.content.message}</span>}
      </label>
      {mutation.isError && <p className="error">Не удалось отправить комментарий</p>}
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Отправка..." : "Отправить"}
      </Button>
    </form>
  );
};
