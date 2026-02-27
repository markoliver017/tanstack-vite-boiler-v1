import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type { CheckerResponse, CreateCheckerValues } from "./zCheckerSchema";

export function useCreateChecker() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCheckerValues) =>
            apiRequest<CheckerResponse>("/checkers", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checkers"] });
            Swal.fire({
                icon: "success",
                title: "Checker created",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useUpdateChecker() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<CreateCheckerValues>;
        }) =>
            apiRequest<CheckerResponse>(`/checkers/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checkers"] });
            Swal.fire({
                icon: "success",
                title: "Checker updated",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useDeleteChecker() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<CheckerResponse>(`/checkers/${id}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checkers"] });
            Swal.fire({
                icon: "success",
                title: "Checker deactivated",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}
