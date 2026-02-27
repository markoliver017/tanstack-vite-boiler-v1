import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type { ScheduleFormValues } from "./zScheduleSchema";

export function useCreateSchedule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ScheduleFormValues) => {
            return apiRequest("/production-report-schedules", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "production-report-schedules",
                    { companyId: String(variables.production_company_id) },
                ],
            });
        },
    });
}

export function useUpdateSchedule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number;
            data: Partial<ScheduleFormValues>;
        }) => {
            return apiRequest(`/production-report-schedules/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["production-report-schedules"],
            });
        },
    });
}

export function useDeleteSchedule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return apiRequest(`/production-report-schedules/${id}`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["production-report-schedules"],
            });
        },
    });
}
