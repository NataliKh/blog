import { Link } from "react-router-dom";
import { ArticleSummary } from "../../entities/article/model/types";

interface Props {
  articles: ArticleSummary[];
}

export const ArticleList = ({ articles }: Props) => {
  if (articles.length === 0) {
    return <p>Публикаций пока нет.</p>;
  }

  return (
    <div className="article-list">
      {articles.map((article) => (
        <article key={article.id} className="article-card">
          <h3>
            <Link to={`/articles/${article.slug}`}>{article.title}</Link>
          </h3>
          {article.excerpt && <p className="excerpt">{article.excerpt}</p>}
          <div className="meta">
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            {article.tags?.length ? <span>{article.tags.join(", ")}</span> : null}
          </div>
        </article>
      ))}
    </div>
  );
};
