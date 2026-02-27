import { queryOptions } from "@tanstack/react-query";
import { fetchList } from "@/lib/api.client";
import type { ScreeningTicketEntryResponse } from "./zScreeningTicketEntrySchema";

export const screeningTicketEntriesOptions = (
    screeningId: number,
    page: number = 1,
    pageSize: number = 50,
) =>
    queryOptions({
        queryKey: ["screening-ticket-entries", { screeningId, page, pageSize }],
        queryFn: () => {
            const params = new URLSearchParams({
                screening_id: String(screeningId),
                _page: String(page),
                _limit: String(pageSize),
            });
            return fetchList<ScreeningTicketEntryResponse[]>(
                `/screening-ticket-entries?${params}`,
            );
        },
    });
