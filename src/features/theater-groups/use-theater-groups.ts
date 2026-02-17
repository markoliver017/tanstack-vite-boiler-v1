import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiRequest, fetchList } from "@/lib/api.client";
import type { TheaterGroup } from "./zTheaterGroupSchema";
import type { TheaterGroupSearch } from "./zTheaterGroupSchema";

export const theaterGroupKeys = {
    all: ["theater-groups"] as const,
    list: (params: TheaterGroupSearch) =>
        [...theaterGroupKeys.all, "list", params] as const,
    detail: (id: number) => [...theaterGroupKeys.all, "detail", id] as const,
};

export const theaterGroupsQueryOptions = ({
    query = "",
    page = 1,
    limit = 10,
}: Partial<TheaterGroupSearch> = {}) =>
    queryOptions({
        queryKey: theaterGroupKeys.list({ query, page, limit }),
        queryFn: () => {
            const searchParam = query ? `q=${query}&` : "";
            // Backend expects _page and _limit as per Agencies module standard
            return fetchList<TheaterGroup[]>(
                `/theater-groups?${searchParam}_page=${page}&_limit=${limit}`,
            );
        },
    });

export const theaterGroupByIdOptions = (id: number) =>
    queryOptions({
        queryKey: theaterGroupKeys.detail(id),
        queryFn: () => apiRequest<TheaterGroup>(`/theater-groups/${id}`),
    });

export const useTheaterGroups = (query?: string, page = 1, limit = 10) =>
    useQuery(theaterGroupsQueryOptions({ query, page, limit }));

export const useTheaterGroup = (id: number) =>
    useQuery(theaterGroupByIdOptions(id));
