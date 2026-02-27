import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { TheaterMovieTicketPriceResponse } from "./zTheaterMovieTicketPriceSchema";

export const theaterMovieTicketPricesListOptions = (
    page: number,
    limit: number,
    theaterId?: number,
    movieId?: number,
) =>
    queryOptions({
        queryKey: [
            "theater-movie-ticket-prices",
            { page, limit, theaterId, movieId },
        ],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(page),
                _limit: String(limit),
                ...(theaterId ? { theater_id: String(theaterId) } : {}),
                ...(movieId ? { movie_id: String(movieId) } : {}),
            });

            return fetchList<TheaterMovieTicketPriceResponse[]>(
                `/theater-movie-ticket-prices?${params}`,
            );
        },
    });

export const theaterMovieTicketPriceByIdOptions = (id: number | string) =>
    queryOptions({
        queryKey: ["theater-movie-ticket-prices", id],
        queryFn: () =>
            apiRequest<TheaterMovieTicketPriceResponse>(
                `/theater-movie-ticket-prices/${id}`,
            ),
    });
