import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type { CreateTaxRuleValues, TaxRuleResponse } from "./zTaxRuleSchema";

export function useCreateTaxRule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateTaxRuleValues) => {
            return apiRequest<TaxRuleResponse>("/tax-rules", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tax-rules"] });
        },
    });
}

export function useUpdateTaxRule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number | string;
            data: Partial<CreateTaxRuleValues>;
        }) => {
            return apiRequest<TaxRuleResponse>(`/tax-rules/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tax-rules"] });
        },
    });
}

export function useDeleteTaxRule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            return apiRequest<{ message: string; deletedId: number | string }>(
                `/tax-rules/${id}`,
                {
                    method: "DELETE",
                },
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tax-rules"] });
        },
    });
}
