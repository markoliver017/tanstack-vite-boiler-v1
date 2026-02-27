import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type {
    CreateCulturalTaxValues,
    CulturalTaxResponse,
} from "./zCulturalTaxSchema";

export function useCreateCulturalTax() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCulturalTaxValues) =>
            apiRequest<CulturalTaxResponse>("/cultural-taxes", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cultural-taxes"] });
            Swal.fire({
                icon: "success",
                title: "Cultural tax created",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useUpdateCulturalTax() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<CreateCulturalTaxValues>;
        }) =>
            apiRequest<CulturalTaxResponse>(`/cultural-taxes/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cultural-taxes"] });
            Swal.fire({
                icon: "success",
                title: "Cultural tax updated",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useDeleteCulturalTax() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<CulturalTaxResponse>(`/cultural-taxes/${id}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cultural-taxes"] });
            Swal.fire({
                icon: "success",
                title: "Cultural tax deactivated",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}
