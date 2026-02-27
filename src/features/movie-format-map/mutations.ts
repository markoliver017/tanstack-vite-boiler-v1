import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type {
    MovieFormatMapResponse,
    MovieFormatMapValues,
} from "./zMovieFormatMapSchema";

export function useCreateMovieFormatMap() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: MovieFormatMapValues) =>
            apiRequest<MovieFormatMapResponse>("/movie-format-map", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["movie-format-map", { movieId: variables.movieId }],
            });

            Swal.fire({
                icon: "success",
                title: "Format assigned",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useUpdateMovieFormatMap() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<MovieFormatMapValues>;
        }) =>
            apiRequest<MovieFormatMapResponse>(`/movie-format-map/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movie-format-map"] });
        },
    });
}

export function useDeleteMovieFormatMap() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<MovieFormatMapResponse>(`/movie-format-map/${id}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movie-format-map"] });
            Swal.fire({
                icon: "success",
                title: "Format removed",
                timer: 1200,
                showConfirmButton: false,
            });
        },
    });
}
