import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        mutationFn: (payload) => updateUser(payload.id, { role: payload.role }),
        onSuccess: () => {
            refetch();
        }
    });
    const content = useMemo(() => {
        if (!isAdmin) {
            return _jsx("p", { children: "\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u043F\u0440\u0430\u0432 \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B." });
        }
        if (isLoading) {
            return _jsx("p", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439..." });
        }
        if (!data || data.length === 0) {
            return _jsx("p", { children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B." });
        }
        return (_jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u0418\u043C\u044F" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "\u0420\u043E\u043B\u044C" })] }) }), _jsx("tbody", { children: data.map((item) => (_jsxs("tr", { children: [_jsx("td", { children: item.name }), _jsx("td", { children: item.email }), _jsx("td", { children: _jsx("select", { value: item.role, onChange: (event) => mutation.mutate({
                                        id: item.id,
                                        role: event.target.value
                                    }), disabled: mutation.isPending, children: ROLE_OPTIONS.map((role) => (_jsx("option", { value: role, children: role }, role))) }) })] }, item.id))) })] }));
    }, [data, isAdmin, isLoading, mutation]);
    return (_jsxs("div", { className: "page", children: [_jsx("h1", { children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C\u0438" }), content, mutation.isError && _jsx("p", { className: "error", children: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0440\u043E\u043B\u044C" }), mutation.isSuccess && _jsx("p", { className: "success", children: "\u0420\u043E\u043B\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430" })] }));
};
