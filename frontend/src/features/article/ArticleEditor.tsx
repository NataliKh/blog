import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createArticle, updateArticle } from "../../entities/article/api/article-api";
import { Article, ArticleStatus } from "../../entities/article/model/types";
import { Button } from "../../shared/ui/button/Button";
import { Input } from "../../shared/ui/input/Input";

interface Props {
  article?: Article;
  onSuccess?: (slug: string) => void;
}

interface FormValues {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string;
  status: ArticleStatus;
}

export const ArticleEditor = ({ article, onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      title: article?.title ?? "",
      content: article?.content ?? "",
      excerpt: article?.excerpt ?? "",
      tags: article?.tags.join(", ") ?? "",
      status: article?.status ?? "draft"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
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

  return (
    <form onSubmit={onSubmit} className="editor-form">
      <label>
        Заголовок
        <Input {...register("title", { required: "Укажите заголовок" })} />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </label>
      <label>
        Краткое описание
        <Input {...register("excerpt")} />
      </label>
      <label>
        Содержимое
        <textarea
          className="textarea"
          {...register("content", { required: "Добавьте содержимое", minLength: { value: 20, message: "Минимум 20 символов" } })}
        />
        {errors.content && <span className="error">{errors.content.message}</span>}
      </label>
      <label>
        Теги (через запятую)
        <Input {...register("tags")} />
      </label>
      <label>
        Статус
        <select {...register("status")}>
          <option value="draft">Черновик</option>
          <option value="published">Опубликовано</option>
          <option value="archived">Архив</option>
        </select>
      </label>
      {mutation.isError && <p className="error">Не удалось сохранить статью</p>}
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Сохранение..." : article ? "Обновить" : "Создать"}
      </Button>
    </form>
  );
};
