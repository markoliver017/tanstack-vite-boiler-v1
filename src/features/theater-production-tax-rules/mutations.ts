import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type {
    CreateTaxRuleOverrideValues,
    TaxRuleOverrideResponse,
} from "./zTaxRuleOverrideSchema";

export function useCreateTaxRuleOverride() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTaxRuleOverrideValues) =>
            apiRequest<TaxRuleOverrideResponse>("/theater-production-tax-rules", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["theater-production-tax-rules"],
            });
            Swal.fire({
                icon: "success",
                title: "Override created",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useUpdateTaxRuleOverride() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<CreateTaxRuleOverrideValues>;
        }) =>
            apiRequest<TaxRuleOverrideResponse>(`/theater-production-tax-rules/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["theater-production-tax-rules"],
            });
            Swal.fire({
                icon: "success",
                title: "Override updated",
                timer: 1300,
                showConfirmButton: false,
            });
        },
    });
}

export function useDeleteTaxRuleOverride() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<TaxRuleOverrideResponse>(`/theater-production-tax-rules/${id}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["theater-production-tax-rules"],
            });
            Swal.fire({
                icon: "success",
                title: "Override removed",
                timer: 1200,
                showConfirmButton: false,
            });
        },
    });
}
