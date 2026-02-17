import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiRequest, fetchList } from "@/lib/api.client";
import type { Agency } from "./zAgencySchema";
import type { AgencySearch } from "./zAgencySchema";

export const agencyKeys = {
    all: ["agencies"] as const,
    list: (params: AgencySearch) =>
        [...agencyKeys.all, "list", params] as const,
    detail: (id: number) => [...agencyKeys.all, "detail", id] as const,
};

export const agenciesQueryOptions = ({
    q = "",
    page = 1,
    limit = 10,
}: Partial<AgencySearch> = {}) =>
    queryOptions({
        queryKey: agencyKeys.list({ q, page, limit }),
        queryFn: () => {
            const searchParam = q ? `q=${q}&` : "";
            const paginationParams = `_page=${page}&_limit=${limit}`;
            return fetchList<Agency[]>(
                `/agencies?${searchParam}${paginationParams}`,
            );
        },
    });

export const agencyByIdOptions = (id: number) =>
    queryOptions({
        queryKey: agencyKeys.detail(id),
        queryFn: () => apiRequest<Agency>(`/agencies/${id}`),
    });

export const useAgencies = (search: AgencySearch) =>
    useQuery(agenciesQueryOptions(search));
export const useAgency = (id: number) => useQuery(agencyByIdOptions(id));
