import { queryOptions } from "@tanstack/react-query";
import { fetchList, apiRequest } from "@/lib/api.client";
import type { CinemaResponse, CinemaSearch } from "./zCinemaSchema";

// List with pagination and search
export const cinemasQueryOptions = (search: CinemaSearch) =>
    queryOptions({
        queryKey: ["cinemas", search],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(search.page || 1),
                _limit: String(search.limit || 10),
                ...(search.q ? { q: search.q } : {}),
                ...(search.theater_id
                    ? { theater_id: String(search.theater_id) }
                    : {}),
            });
            return fetchList<CinemaResponse[]>(`/cinemas?${params}`);
        },
    });

// Single cinema by ID
export const cinemaByIdOptions = (id: number) =>
    queryOptions({
        queryKey: ["cinemas", id],
        queryFn: () => apiRequest<CinemaResponse>(`/cinemas/${id}`),
    });
