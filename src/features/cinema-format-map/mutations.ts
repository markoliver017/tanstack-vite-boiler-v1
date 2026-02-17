import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type { AssignFormatValues } from "./zCinemaFormatMapSchema";

export function useAssignFormat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AssignFormatValues) => {
            return apiRequest("/cinema-format-map", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: (_, { cinemaId }) => {
            queryClient.invalidateQueries({
                queryKey: ["cinema-format-map", { cinemaId }],
            });
        },
    });
}

export function useUpdateAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number;
            data: Partial<AssignFormatValues>;
        }) => {
            return apiRequest(`/cinema-format-map/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            // We might not have cinemaId available directly if we only pass ID, but usually we invalidating the list is safer if we know the parent ID.
            // For now, let's just invalidate all maps or require cinemaId in the mutation context if needed.
            // The list query key includes cinemaId.
            // For better granularity, we should pass cinemaId or invalidate all "cinema-format-map".
            queryClient.invalidateQueries({ queryKey: ["cinema-format-map"] });
        },
    });
}

export function useRemoveAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            return apiRequest(`/cinema-format-map/${id}`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cinema-format-map"] });
        },
    });
}
