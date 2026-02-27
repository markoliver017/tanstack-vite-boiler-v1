import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type { CreateDiscountValues, DiscountResponse } from "./zDiscountSchema";

export function useCreateDiscount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateDiscountValues) =>
            apiRequest<DiscountResponse>("/discounts", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
            queryClient.invalidateQueries({ queryKey: ["ticket-types"] });
            Swal.fire({ icon: "success", title: "Discount created", timer: 1300, showConfirmButton: false });
        },
        onError: (error: Error) => Swal.fire({ icon: "error", title: "Failed", text: error.message }),
    });
}

export function useUpdateDiscount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateDiscountValues> }) =>
            apiRequest<DiscountResponse>(`/discounts/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
            queryClient.invalidateQueries({ queryKey: ["ticket-types"] });
            Swal.fire({ icon: "success", title: "Discount updated", timer: 1300, showConfirmButton: false });
        },
        onError: (error: Error) => Swal.fire({ icon: "error", title: "Failed", text: error.message }),
    });
}

export function useDeleteDiscount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<DiscountResponse>(`/discounts/${id}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
            queryClient.invalidateQueries({ queryKey: ["ticket-types"] });
            Swal.fire({ icon: "success", title: "Discount deleted", timer: 1300, showConfirmButton: false });
        },
        onError: (error: Error) => Swal.fire({ icon: "error", title: "Failed", text: error.message }),
    });
}
