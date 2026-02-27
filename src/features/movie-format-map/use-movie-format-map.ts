import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { MovieFormatMapResponse } from "./zMovieFormatMapSchema";

export const movieFormatsByMovieOptions = (movieId: string | number) =>
    queryOptions({
        queryKey: ["movie-format-map", { movieId: Number(movieId) }],
        queryFn: () =>
            fetchList<MovieFormatMapResponse[]>(
                `/movie-format-map?movie_id=${movieId}`,
            ),
    });

export const movieFormatMapByIdOptions = (id: number) =>
    queryOptions({
        queryKey: ["movie-format-map", id],
        queryFn: () =>
            apiRequest<MovieFormatMapResponse>(`/movie-format-map/${id}`),
    });
