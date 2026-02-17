import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type { AgencyFormData, Agency } from "./zAgencySchema";
import Swal from "sweetalert2";

// ==========================================
//  CREATE AGENCY MUTATION
// ==========================================

export function useCreateAgency() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AgencyFormData) =>
            apiRequest<Agency>("/agencies", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agencies"] });
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Agency created successfully",
                timer: 2000,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Failed to create agency",
            });
        },
    });
}

// ==========================================
//  UPDATE AGENCY MUTATION
// ==========================================

export function useUpdateAgency() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<AgencyFormData>;
        }) =>
            apiRequest<Agency>(`/agencies/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agencies"] });
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Agency updated successfully",
                timer: 2000,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Failed to update agency",
            });
        },
    });
}

// ==========================================
//  DELETE AGENCY MUTATION
// ==========================================

export function useDeleteAgency() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<Agency>(`/agencies/${id}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agencies"] });
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Agency deleted successfully",
                timer: 2000,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Failed to delete agency",
            });
        },
    });
}
