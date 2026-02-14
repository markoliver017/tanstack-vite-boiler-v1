import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiRequest, fetchList } from "@/lib/api.client";
import type { UserResponse, UserSearch } from "./zUsersSchema";

// ==========================================
//  QUERY KEYS
// ==========================================

export const userKeys = {
    all: ["users"] as const,
    list: (params: UserSearch) => [...userKeys.all, "list", params] as const,
    detail: (id: string) => [...userKeys.all, "detail", id] as const,
    byEmail: (email: string) => [...userKeys.all, "email", email] as const,
};

// ==========================================
//  PAGINATED LIST (for DataTable)
// ==========================================

export const userListOptions = ({ q = "", page = 1, limit = 10 }: UserSearch) =>
    queryOptions({
        queryKey: userKeys.list({ q, page, limit }),
        queryFn: async () => {
            const searchParam = q ? `q=${q}&` : "";
            const paginationParams = `_page=${page}&_limit=${limit}`;
            return fetchList<UserResponse[]>(
                `/users?${searchParam}${paginationParams}`,
            );
        },
    });

// ==========================================
//  SINGLE USER DETAIL
// ==========================================

export const userDetailOptions = (id: string) =>
    queryOptions({
        queryKey: userKeys.detail(id),
        queryFn: () => apiRequest<UserResponse>(`/users/${id}`),
    });

// ==========================================
//  BY EMAIL (for auth lookups)
// ==========================================

export const userByEmailOptions = (email: string) =>
    queryOptions({
        queryKey: userKeys.byEmail(email),
        queryFn: () => apiRequest<UserResponse>(`/users/email/${email}`),
    });

// ==========================================
//  SIMPLE LIST (for dropdowns)
// ==========================================

export const usersListOptions = queryOptions({
    queryKey: [...userKeys.all, "list-all"],
    queryFn: () => apiRequest<UserResponse[]>("/users"),
});

export const useUsers = () => useQuery(usersListOptions);
