import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { CheckerAssignmentResponse } from "./zCheckerAssignmentSchema";

export const checkerAssignmentsOptions = (checkerId: string | number) =>
    queryOptions({
        queryKey: ["movie-checker-theater-assignments", { checkerId }],
        queryFn: () =>
            fetchList<CheckerAssignmentResponse[]>(
                `/movie-checker-theater-assignments?checker_id=${checkerId}`,
            ),
    });

export const movieAssignmentsOptions = (movieId: string | number) =>
    queryOptions({
        queryKey: ["movie-checker-theater-assignments", { movieId }],
        queryFn: () =>
            fetchList<CheckerAssignmentResponse[]>(
                `/movie-checker-theater-assignments?movie_id=${movieId}&_page=1&_limit=2000`,
            ),
    });

export const movieTheatersOptions = (movieId: number | string) =>
    queryOptions({
        queryKey: ["movie-theater-planning", "theaters", movieId],
        queryFn: () =>
            fetchList<
                {
                    theaterId: number;
                    theaterName: string;
                    totalSlots: number;
                    filledSlots: number;
                }[]
            >(`/movies/${movieId}/theaters?_page=1&_limit=500`),
    });

export const movieTheaterSlotsOptions = (
    movieId: number | string,
    theaterId: number | string,
) =>
    queryOptions({
        queryKey: ["movie-theater-planning", "slots", movieId, theaterId],
        queryFn: () =>
            fetchList<CheckerAssignmentResponse[]>(
                `/movies/${movieId}/theaters/${theaterId}/slots?_page=1&_limit=500`,
            ),
    });

export const checkerAssignmentByIdOptions = (id: number) =>
    queryOptions({
        queryKey: ["movie-checker-theater-assignments", id],
        queryFn: () =>
            apiRequest<CheckerAssignmentResponse>(
                `/movie-checker-theater-assignments/${id}`,
            ),
    });
