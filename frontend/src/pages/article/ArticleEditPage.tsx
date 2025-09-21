import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchArticle } from "../../entities/article/api/article-api";
import { ArticleEditor } from "../../features/article/ArticleEditor";
import { useAuthStore } from "../../app/providers/auth-store";

export const ArticleEditPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [navigate, user]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle(slug ?? ""),
    enabled: Boolean(slug && user)
  });

  if (!slug || !user) {
    return null;
  }

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (isError || !data) {
    return <p className="error">Не удалось загрузить статью</p>;
  }

  return (
    <div className="page">
      <h1>Редактировать статью</h1>
      <ArticleEditor
        article={data as unknown as any}
        onSuccess={(slugValue) => navigate(`/articles/${slugValue}`)}
      />
    </div>
  );
};
