import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { DiscountResponse } from "./zDiscountSchema";

export const discountsListOptions = (page: number, limit: number) =>
    queryOptions({
        queryKey: ["discounts", { page, limit }],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(page),
                _limit: String(limit),
            });

            return fetchList<DiscountResponse[]>(`/discounts?${params}`);
        },
    });

export const discountByIdOptions = (id: number | string) =>
    queryOptions({
        queryKey: ["discounts", id],
        queryFn: () => apiRequest<DiscountResponse>(`/discounts/${id}`),
    });
