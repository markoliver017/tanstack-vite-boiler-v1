import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type { CreateMovieValues, MovieResponse } from "./zMovieSchema";

export function useCreateMovie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMovieValues) =>
            apiRequest<MovieResponse>("/movies", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            Swal.fire({
                icon: "success",
                title: "Movie created",
                timer: 1400,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error.message,
            });
        },
    });
}

export function useUpdateMovie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<CreateMovieValues>;
        }) =>
            apiRequest<MovieResponse>(`/movies/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            Swal.fire({
                icon: "success",
                title: "Movie updated",
                timer: 1400,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error.message,
            });
        },
    });
}

export function useDeleteMovie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<MovieResponse>(`/movies/${id}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            Swal.fire({
                icon: "success",
                title: "Movie deleted",
                timer: 1400,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error.message,
            });
        },
    });
}
