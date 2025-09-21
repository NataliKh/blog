import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../../entities/comment/api/comment-api";

interface Props {
  articleId: string;
}

export const CommentList = ({ articleId }: Props) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => fetchComments(articleId)
  });

  if (isLoading) {
    return <p>Загрузка комментариев...</p>;
  }

  if (isError) {
    return <p className="error">Не удалось загрузить комментарии</p>;
  }

  if (!data || data.length === 0) {
    return <p>Комментариев пока нет.</p>;
  }

  return (
    <ul className="comment-list">
      {data.map((comment) => (
        <li key={comment.id}>
          <div className="comment-meta">
            <strong>{comment.author?.name ?? "Аноним"}</strong>
            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p>{comment.content}</p>
        </li>
      ))}
    </ul>
  );
};
