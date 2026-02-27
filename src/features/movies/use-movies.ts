import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { MovieResponse } from "./zMovieSchema";

export const moviesListOptions = (
    page: number,
    limit: number,
    q?: string,
    productionCompanyId?: number,
    agencyId?: number,
) =>
    queryOptions({
        queryKey: [
            "movies",
            { page, limit, q, productionCompanyId, agencyId },
        ],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(page),
                _limit: String(limit),
                ...(q ? { q } : {}),
                ...(productionCompanyId
                    ? { production_company_id: String(productionCompanyId) }
                    : {}),
                ...(agencyId ? { agency_id: String(agencyId) } : {}),
            });
            return fetchList<MovieResponse[]>(`/movies?${params}`);
        },
    });

export const movieByIdOptions = (id: string | number) =>
    queryOptions({
        queryKey: ["movies", id],
        queryFn: () => apiRequest<MovieResponse>(`/movies/${id}`),
    });
