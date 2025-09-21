import { CommentList } from "../../features/comments/CommentList";
import { AddCommentForm } from "../../features/comments/AddCommentForm";

interface Props {
  articleId: string;
}

export const CommentSection = ({ articleId }: Props) => {
  return (
    <section className="comment-section">
      <h3>Комментарии</h3>
      <AddCommentForm articleId={articleId} />
      <CommentList articleId={articleId} />
    </section>
  );
};
