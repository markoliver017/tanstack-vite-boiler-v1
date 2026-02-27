import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { CheckerResponse } from "./zCheckerSchema";

export const checkersListOptions = (
    page: number,
    limit: number,
    q?: string,
    agencyId?: number,
) =>
    queryOptions({
        queryKey: ["checkers", { page, limit, q, agencyId }],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(page),
                _limit: String(limit),
                ...(q ? { q } : {}),
                ...(agencyId ? { agency_id: String(agencyId) } : {}),
            });

            return fetchList<CheckerResponse[]>(`/checkers?${params}`);
        },
    });

export const checkerByIdOptions = (id: string | number) =>
    queryOptions({
        queryKey: ["checkers", id],
        queryFn: () => apiRequest<CheckerResponse>(`/checkers/${id}`),
    });
