import { queryOptions } from "@tanstack/react-query";
import { fetchList, apiRequest } from "@/lib/api.client";
import type { TheaterResponse } from "./zTheatersSchema";

export const theatersListOptions = (
    page: number,
    pageSize: number,
    search?: string,
    theaterGroupId?: number,
) =>
    queryOptions({
        queryKey: ["theaters", { page, pageSize, search, theaterGroupId }],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(page),
                _limit: String(pageSize),
                ...(search ? { q: search } : {}),
                ...(theaterGroupId
                    ? { theaterGroupId: String(theaterGroupId) }
                    : {}),
            });
            return fetchList<TheaterResponse[]>(`/theaters?${params}`);
        },
    });

export const theaterByIdOptions = (id: string) =>
    queryOptions({
        queryKey: ["theaters", id],
        queryFn: () => apiRequest<TheaterResponse>(`/theaters/${id}`),
    });
