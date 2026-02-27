import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { CulturalTaxResponse } from "./zCulturalTaxSchema";

export const culturalTaxesListOptions = (
    page: number,
    limit: number,
    q?: string,
    city?: string,
    province?: string,
) =>
    queryOptions({
        queryKey: ["cultural-taxes", { page, limit, q, city, province }],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(page),
                _limit: String(limit),
                ...(q ? { q } : {}),
                ...(city ? { city } : {}),
                ...(province ? { province } : {}),
            });

            return fetchList<CulturalTaxResponse[]>(
                `/cultural-taxes?${params}`,
            );
        },
    });

export const culturalTaxByIdOptions = (id: string | number) =>
    queryOptions({
        queryKey: ["cultural-taxes", id],
        queryFn: () => apiRequest<CulturalTaxResponse>(`/cultural-taxes/${id}`),
    });
