import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArticleEditor } from "../../features/article/ArticleEditor";
import { useAuthStore } from "../../app/providers/auth-store";

export const ArticleCreatePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [navigate, user]);

  if (!user) {
    return null;
  }

  return (
    <div className="page">
      <h1>Новая статья</h1>
      <ArticleEditor
        onSuccess={(slug) => {
          navigate(`/articles/${slug}`);
        }}
      />
    </div>
  );
};
