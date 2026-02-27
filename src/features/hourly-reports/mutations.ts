import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type {
    CreateHourlyReportValues,
    HourlyReportResponse,
    PreviewResponse,
} from "./zHourlyReportSchema";

export function useCreateHourlyReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateHourlyReportValues) =>
            apiRequest<HourlyReportResponse>("/hourly-reports", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hourly-reports"] });
            Swal.fire({
                icon: "success",
                title: "Hourly report submitted",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useUpdateHourlyReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<CreateHourlyReportValues>;
        }) =>
            apiRequest<HourlyReportResponse>(`/hourly-reports/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hourly-reports"] });
            Swal.fire({
                icon: "success",
                title: "Hourly report updated",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function usePreviewHourlyReport() {
    return useMutation({
        mutationFn: (data: CreateHourlyReportValues) =>
            apiRequest<PreviewResponse>("/hourly-reports/preview", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    });
}
