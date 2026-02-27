import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { CinemaTicketsTemplateResponse } from "./zCinemaTicketsTemplateSchema";

export const cinemaTicketsTemplateListOptions = (
    page: number,
    limit: number,
    cinemaId?: number,
    ticketTypeId?: number,
) =>
    queryOptions({
        queryKey: ["cinema-tickets-template", { page, limit, cinemaId, ticketTypeId }],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(page),
                _limit: String(limit),
                ...(cinemaId ? { cinema_id: String(cinemaId) } : {}),
                ...(ticketTypeId ? { ticket_type_id: String(ticketTypeId) } : {}),
            });

            return fetchList<CinemaTicketsTemplateResponse[]>(`/cinema-tickets-template?${params}`);
        },
    });

export const cinemaTicketsTemplateByIdOptions = (id: number | string) =>
    queryOptions({
        queryKey: ["cinema-tickets-template", id],
        queryFn: () =>
            apiRequest<CinemaTicketsTemplateResponse>(`/cinema-tickets-template/${id}`),
    });
