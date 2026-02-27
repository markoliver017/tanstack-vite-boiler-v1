import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { AuthorizationResponse } from "./zAuthorizationSchema";

export const checkerAuthorizationsOptions = (checkerId: number) =>
    queryOptions({
        queryKey: ["checker-production-companies", { checkerId }],
        queryFn: () =>
            fetchList<AuthorizationResponse[]>(
                `/checker-production-companies?checker_id=${checkerId}`,
            ),
    });

export const authorizationByIdOptions = (id: number) =>
    queryOptions({
        queryKey: ["checker-production-companies", id],
        queryFn: () =>
            apiRequest<AuthorizationResponse>(
                `/checker-production-companies/${id}`,
            ),
    });
