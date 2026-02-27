import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type {
    CinemaTicketsTemplateResponse,
    CreateCinemaTicketsTemplateValues,
} from "./zCinemaTicketsTemplateSchema";

export function useCreateCinemaTicketsTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCinemaTicketsTemplateValues) =>
            apiRequest<CinemaTicketsTemplateResponse>("/cinema-tickets-template", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cinema-tickets-template"] });
            Swal.fire({
                icon: "success",
                title: "Template mapping created",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useUpdateCinemaTicketsTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<CreateCinemaTicketsTemplateValues>;
        }) =>
            apiRequest<CinemaTicketsTemplateResponse>(`/cinema-tickets-template/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cinema-tickets-template"] });
            Swal.fire({
                icon: "success",
                title: "Template mapping updated",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useDeleteCinemaTicketsTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<CinemaTicketsTemplateResponse>(`/cinema-tickets-template/${id}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cinema-tickets-template"] });
            Swal.fire({
                icon: "success",
                title: "Template mapping deleted",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}
