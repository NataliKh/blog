import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUsers, updateUser } from "../../entities/user/api/user-api";
import { useAuthStore } from "../../app/providers/auth-store";

const ROLE_OPTIONS = ["user", "editor", "admin"];

export const AdminPage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchUsers,
    enabled: isAdmin
  });

  const mutation = useMutation({
    mutationFn: (payload: { id: string; role: string }) => updateUser(payload.id, { role: payload.role }),
    onSuccess: () => {
      refetch();
    }
  });

  const content = useMemo(() => {
    if (!isAdmin) {
      return <p>Недостаточно прав для просмотра страницы.</p>;
    }

    if (isLoading) {
      return <p>Загрузка пользователей...</p>;
    }

    if (!data || data.length === 0) {
      return <p>Пользователи не найдены.</p>;
    }

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>
                <select
                  value={item.role}
                  onChange={(event) =>
                    mutation.mutate({
                      id: item.id,
                      role: event.target.value
                    })
                  }
                  disabled={mutation.isPending}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [data, isAdmin, isLoading, mutation]);

  return (
    <div className="page">
      <h1>Управление пользователями</h1>
      {content}
      {mutation.isError && <p className="error">Не удалось обновить роль</p>}
      {mutation.isSuccess && <p className="success">Роль обновлена</p>}
    </div>
  );
};
