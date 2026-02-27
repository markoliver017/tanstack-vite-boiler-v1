import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type {
    CreateMovieScreeningTimeValues,
    MovieScreeningTimeResponse,
} from "./zMovieScreeningTimeSchema";

export function useCreateMovieScreeningTime() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateMovieScreeningTimeValues) =>
            apiRequest<MovieScreeningTimeResponse>("/movie-screening-times", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["movie-screening-times", variables.assignmentId],
            });
            Swal.fire({
                icon: "success",
                title: "Screening time created",
                timer: 1200,
                showConfirmButton: false,
            });
        },
    });
}

export function useUpdateMovieScreeningTime() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            assignmentId: number;
            data: Partial<CreateMovieScreeningTimeValues>;
        }) =>
            apiRequest<MovieScreeningTimeResponse>(`/movie-screening-times/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["movie-screening-times", variables.assignmentId],
            });
            Swal.fire({
                icon: "success",
                title: "Screening time updated",
                timer: 1200,
                showConfirmButton: false,
            });
        },
    });
}

export function useDeleteMovieScreeningTime() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
        }: {
            id: number;
            assignmentId: number;
        }) =>
            apiRequest(`/movie-screening-times/${id}`, {
                method: "DELETE",
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["movie-screening-times", variables.assignmentId],
            });
            Swal.fire({
                icon: "success",
                title: "Screening time deleted",
                timer: 1200,
                showConfirmButton: false,
            });
        },
    });
}
