import { queryOptions } from "@tanstack/react-query";
import { fetchList, apiRequest } from "@/lib/api.client";
import type { ProductionCompanyResponse } from "./zProductionCompanySchema";

export const productionCompaniesListOptions = (
    page: number,
    limit: number,
    q?: string,
) =>
    queryOptions({
        queryKey: ["production-companies", { page, limit, q }],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(page),
                _limit: String(limit),
                ...(q ? { q } : {}),
            });
            return fetchList<ProductionCompanyResponse[]>(
                `/production-companies?${params}`,
            );
        },
    });

export const productionCompanyByIdOptions = (id: string) =>
    queryOptions({
        queryKey: ["production-companies", id],
        queryFn: () =>
            apiRequest<ProductionCompanyResponse>(
                `/production-companies/${id}`,
            ),
    });
