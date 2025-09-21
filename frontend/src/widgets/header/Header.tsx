import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../app/providers/auth-store";
import { Button } from "../../shared/ui/button/Button";

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        Блог
      </Link>
      <nav className="nav">
        <NavLink to="/" end>
          Главная
        </NavLink>
        {user && (
          <NavLink to="/articles/new">
            Новая статья
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/admin">
            Админка
          </NavLink>
        )}
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            <span className="user-name">{user.name}</span>
            <Button variant="ghost" onClick={handleLogout}>
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => navigate("/auth/login")}>
              Войти
            </Button>
            <Button onClick={() => navigate("/auth/register")}>Регистрация</Button>
          </>
        )}
      </div>
    </header>
  );
};
