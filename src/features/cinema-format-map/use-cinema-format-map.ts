import { queryOptions } from "@tanstack/react-query";
import { fetchList } from "@/lib/api.client";
import type { CinemaFormatMapResponse } from "./zCinemaFormatMapSchema";

export const cinemaFormatMapListOptions = (cinemaId: number) =>
    queryOptions({
        queryKey: ["cinema-format-map", { cinemaId }],
        queryFn: () => {
            const params = new URLSearchParams({
                cinema_id: String(cinemaId),
            });
            return fetchList<CinemaFormatMapResponse[]>(
                `/cinema-format-map?${params}`,
            );
        },
    });
