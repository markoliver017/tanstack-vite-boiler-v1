import { apiRequest } from "@/lib/api.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type {
    AuthorizationResponse,
    CreateAuthorizationValues,
} from "./zAuthorizationSchema";

export function useCreateAuthorization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAuthorizationValues) =>
            apiRequest<AuthorizationResponse>("/checker-production-companies", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "checker-production-companies",
                    { checkerId: variables.checkerId },
                ],
            });
            Swal.fire({
                icon: "success",
                title: "Authorization created",
                timer: 1300,
                showConfirmButton: false,
            });
        },
        onError: (error: Error) => {
            Swal.fire({ icon: "error", title: "Failed", text: error.message });
        },
    });
}

export function useUpdateAuthorization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<CreateAuthorizationValues>;
        }) =>
            apiRequest<AuthorizationResponse>(`/checker-production-companies/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["checker-production-companies"],
            });
        },
    });
}

export function useDeleteAuthorization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            apiRequest<AuthorizationResponse>(`/checker-production-companies/${id}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["checker-production-companies"],
            });
            Swal.fire({
                icon: "success",
                title: "Authorization revoked",
                timer: 1200,
                showConfirmButton: false,
            });
        },
    });
}
