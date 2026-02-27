import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type {
    CreateScreeningTicketEntryValues,
    BulkCreateScreeningTicketEntryValues,
} from "./zScreeningTicketEntrySchema";

export function useCreateScreeningTicketEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateScreeningTicketEntryValues) => {
            return apiRequest("/screening-ticket-entries", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["screening-ticket-entries"],
            });
        },
    });
}

export function useUpdateScreeningTicketEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number;
            data: Partial<CreateScreeningTicketEntryValues>;
        }) => {
            return apiRequest(`/screening-ticket-entries/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["screening-ticket-entries"],
            });
        },
    });
}

export function useDeleteScreeningTicketEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return apiRequest(`/screening-ticket-entries/${id}`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["screening-ticket-entries"],
            });
        },
    });
}

export function useCreateBulkScreeningTicketEntries() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: BulkCreateScreeningTicketEntryValues) => {
            return apiRequest("/screening-ticket-entries/bulk", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["screening-ticket-entries"],
            });
        },
    });
}
