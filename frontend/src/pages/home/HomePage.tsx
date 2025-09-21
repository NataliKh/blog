import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "../../entities/article/api/article-api";
import { ArticleList } from "../../widgets/article-list/ArticleList";

export const HomePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles", { status: "published" }],
    queryFn: () => fetchArticles({ status: "published", limit: 20 })
  });

  if (isLoading) {
    return <p>Загрузка статей...</p>;
  }

  if (isError || !data) {
    return <p className="error">Не удалось загрузить статьи</p>;
  }

  return (
    <div className="page">
      <h1>Последние статьи</h1>
      <ArticleList articles={data.data} />
    </div>
  );
};
