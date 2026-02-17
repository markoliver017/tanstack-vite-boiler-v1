import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type { CreateCinemaFormatValues } from "./zCinemaFormatSchema";

export function useCreateCinemaFormat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateCinemaFormatValues) => {
            return apiRequest("/cinema-formats", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cinema-formats"] });
        },
    });
}

export function useUpdateCinemaFormat(id: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<CreateCinemaFormatValues>) => {
            return apiRequest(`/cinema-formats/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cinema-formats"] });
        },
    });
}

export function useDeleteCinemaFormat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return apiRequest(`/cinema-formats/${id}`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cinema-formats"] });
        },
    });
}
