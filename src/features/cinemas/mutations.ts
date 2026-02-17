import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type { CreateCinemaValues } from "./zCinemaSchema";

export function useCreateCinema() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateCinemaValues) => {
            return apiRequest("/cinemas", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cinemas"] });
        },
    });
}

export function useUpdateCinema() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number;
            data: CreateCinemaValues;
        }) => {
            return apiRequest(`/cinemas/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cinemas"] });
        },
    });
}

export function useDeleteCinema() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return apiRequest(`/cinemas/${id}`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cinemas"] });
        },
    });
}
