import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type {
    CreateTheaterMovieTicketPriceValues,
    TheaterMovieTicketPriceResponse,
} from "./zTheaterMovieTicketPriceSchema";

export function useCreateTheaterMovieTicketPrice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTheaterMovieTicketPriceValues) =>
            apiRequest<TheaterMovieTicketPriceResponse>(
                "/theater-movie-ticket-prices",
                {
                    method: "POST",
                    body: JSON.stringify(data),
                },
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["theater-movie-ticket-prices"],
            });
            Swal.fire({
                icon: "success",
                title: "Ticket price created",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useUpdateTheaterMovieTicketPrice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<CreateTheaterMovieTicketPriceValues>;
        }) =>
            apiRequest<TheaterMovieTicketPriceResponse>(
                `/theater-movie-ticket-prices/${id}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(data),
                },
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["theater-movie-ticket-prices"],
            });
            Swal.fire({
                icon: "success",
                title: "Ticket price updated",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useDeleteTheaterMovieTicketPrice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<TheaterMovieTicketPriceResponse>(
                `/theater-movie-ticket-prices/${id}`,
                {
                    method: "DELETE",
                },
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["theater-movie-ticket-prices"],
            });
            Swal.fire({
                icon: "success",
                title: "Ticket price deleted",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}
