import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type {
    CreateTheaterGroup,
    UpdateTheaterGroup,
    TheaterGroup,
} from "./zTheaterGroupSchema";

export function useCreateTheaterGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTheaterGroup) =>
            apiRequest<TheaterGroup>("/theater-groups", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theater-groups"] });
        },
    });
}

export function useUpdateTheaterGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTheaterGroup }) =>
            apiRequest<TheaterGroup>(`/theater-groups/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theater-groups"] });
        },
    });
}

export function useDeleteTheaterGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<TheaterGroup>(`/theater-groups/${id}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theater-groups"] });
        },
    });
}
