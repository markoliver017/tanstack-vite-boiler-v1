import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { TicketTypeResponse } from "./zTicketTypeSchema";

export const ticketTypesListOptions = (
    page: number,
    limit: number,
    q?: string,
    theaterId?: number,
) =>
    queryOptions({
        queryKey: ["ticket-types", { page, limit, q, theaterId }],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(page),
                _limit: String(limit),
                ...(q ? { q } : {}),
                ...(theaterId ? { theater_id: String(theaterId) } : {}),
            });

            return fetchList<TicketTypeResponse[]>(`/ticket-types?${params}`);
        },
    });

export const ticketTypeByIdOptions = (id: number | string) =>
    queryOptions({
        queryKey: ["ticket-types", id],
        queryFn: () => apiRequest<TicketTypeResponse>(`/ticket-types/${id}`),
    });
