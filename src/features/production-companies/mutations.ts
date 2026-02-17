import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type { CreateProductionCompanyValues } from "./zProductionCompanySchema";

export function useCreateProductionCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateProductionCompanyValues) => {
            return apiRequest("/production-companies", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["production-companies"],
            });
        },
    });
}

export function useUpdateProductionCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number;
            data: CreateProductionCompanyValues;
        }) => {
            return apiRequest(`/production-companies/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["production-companies"],
            });
        },
    });
}

export function useDeleteProductionCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return apiRequest(`/production-companies/${id}`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["production-companies"],
            });
        },
    });
}
