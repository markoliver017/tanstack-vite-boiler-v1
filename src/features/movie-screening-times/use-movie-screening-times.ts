import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { MovieScreeningTimeResponse } from "./zMovieScreeningTimeSchema";

export const movieScreeningTimesOptions = (assignmentId: number) =>
    queryOptions({
        queryKey: ["movie-screening-times", assignmentId],
        queryFn: () =>
            fetchList<MovieScreeningTimeResponse[]>(
                `/movie-screening-times?assignment_id=${assignmentId}&_page=1&_limit=500`,
            ),
    });

export const movieScreeningTimeByIdOptions = (id: number) =>
    queryOptions({
        queryKey: ["movie-screening-times", id],
        queryFn: () => apiRequest<MovieScreeningTimeResponse>(`/movie-screening-times/${id}`),
    });
