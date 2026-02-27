import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type {
    CreateTicketTypeValues,
    TicketTypeResponse,
} from "./zTicketTypeSchema";

export function useCreateTicketType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTicketTypeValues) =>
            apiRequest<TicketTypeResponse>("/ticket-types", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ticket-types"] });
            Swal.fire({
                icon: "success",
                title: "Ticket type created",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error) => {
            console.log("Error>>>>", error);
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useUpdateTicketType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<CreateTicketTypeValues>;
        }) =>
            apiRequest<TicketTypeResponse>(`/ticket-types/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ticket-types"] });
            Swal.fire({
                icon: "success",
                title: "Ticket type updated",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useDeleteTicketType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<TicketTypeResponse>(`/ticket-types/${id}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ticket-types"] });
            Swal.fire({
                icon: "success",
                title: "Ticket type deleted",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}
