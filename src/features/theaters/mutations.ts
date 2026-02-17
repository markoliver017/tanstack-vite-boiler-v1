import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type { CreateTheaterValues } from "./zTheatersSchema";

export function useCreateTheater() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateTheaterValues) => {
            return apiRequest("/theaters", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theaters"] });
        },
    });
}

export function useUpdateTheater() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<CreateTheaterValues>;
        }) => {
            return apiRequest(`/theaters/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["theaters"] });
            queryClient.invalidateQueries({ queryKey: ["theaters", id] });
        },
    });
}

export function useDeleteTheater() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return apiRequest(`/theaters/${id}`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theaters"] });
        },
    });
}
