import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchArticle } from "../../entities/article/api/article-api";
import { CommentSection } from "../../widgets/comment-section/CommentSection";

export const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle(slug ?? ""),
    enabled: Boolean(slug)
  });

  const articleId = useMemo(() => {
    if (!data) {
      return "";
    }
    return (data as unknown as { id?: string; _id?: string }).id ?? (data as unknown as { _id?: string })._id ?? "";
  }, [data]);

  if (!slug) {
    return <p className="error">Статья не найдена</p>;
  }

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (isError || !data) {
    return <p className="error">Не удалось загрузить статью</p>;
  }

  return (
    <article className="page">
      <h1>{data.title}</h1>
      {data.publishedAt && (
        <p className="meta">Опубликовано: {new Date(data.publishedAt).toLocaleDateString()}</p>
      )}
      <div className="content" style={{ whiteSpace: "pre-line" }}>
        {data.content}
      </div>
      {articleId && <CommentSection articleId={articleId} />}
    </article>
  );
};
