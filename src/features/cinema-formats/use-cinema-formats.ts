import { queryOptions } from "@tanstack/react-query";
import { fetchList, apiRequest } from "@/lib/api.client";
import type {
    CinemaFormatResponse,
    CinemaFormatSearch,
} from "./zCinemaFormatSchema";

export const cinemaFormatsListOptions = (search: CinemaFormatSearch) =>
    queryOptions({
        queryKey: ["cinema-formats", search],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(search.page || 1),
                _limit: String(search.limit || 10),
                ...(search.q ? { q: search.q } : {}),
            });
            return fetchList<CinemaFormatResponse[]>(
                `/cinema-formats?${params}`,
            );
        },
    });

export const cinemaFormatByIdOptions = (id: number) =>
    queryOptions({
        queryKey: ["cinema-formats", id],
        queryFn: () =>
            apiRequest<CinemaFormatResponse>(`/cinema-formats/${id}`),
    });
