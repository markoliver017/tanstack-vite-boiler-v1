import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type {
    CheckerAssignmentResponse,
    CreateCheckerAssignmentValues,
} from "./zCheckerAssignmentSchema";

export function useCreateCheckerAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCheckerAssignmentValues) =>
            apiRequest<CheckerAssignmentResponse>(
                "/movie-checker-theater-assignments",
                {
                    method: "POST",
                    body: JSON.stringify(data),
                },
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["movie-checker-theater-assignments"],
            });
            queryClient.invalidateQueries({
                queryKey: ["movie-theater-planning"],
            });
            Swal.fire({
                icon: "success",
                title: "Assignment created",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            alert(error.message);
        },
    });
}

export function useUpdateCheckerAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<CreateCheckerAssignmentValues>;
        }) =>
            apiRequest<CheckerAssignmentResponse>(
                `/movie-checker-theater-assignments/${id}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(data),
                },
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["movie-checker-theater-assignments"],
            });
            Swal.fire({
                icon: "success",
                title: "Assignment updated",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useUpdateMovieSlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            movieId,
            theaterId,
            slotId,
            data,
        }: {
            movieId: number;
            theaterId: number;
            slotId: number;
            data: Partial<CreateCheckerAssignmentValues>;
        }) =>
            apiRequest<CheckerAssignmentResponse>(
                `/movies/${movieId}/theaters/${theaterId}/slots/${slotId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(data),
                },
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["movie-checker-theater-assignments"],
            });
            queryClient.invalidateQueries({
                queryKey: ["movie-theater-planning"],
            });
            Swal.fire({
                icon: "success",
                title: "Slot updated",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useDeleteCheckerAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<CheckerAssignmentResponse>(
                `/movie-checker-theater-assignments/${id}`,
                {
                    method: "DELETE",
                },
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["movie-checker-theater-assignments"],
            });
            queryClient.invalidateQueries({
                queryKey: ["movie-theater-planning"],
            });
            Swal.fire({
                icon: "success",
                title: "Assignment removed",
                timer: 1200,
                showConfirmButton: false,
            });
        },
    });
}
