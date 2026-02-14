import { queryOptions } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api.client";
import type { AuditTrailResponse, AuditTrailSearch } from "./zAuditTrailSchema";

// ==========================================
//  QUERY KEYS
// ==========================================

export const auditTrailKeys = {
    all: ["audit-trails"] as const,
    list: (params: AuditTrailSearch) =>
        [...auditTrailKeys.all, "list", params] as const,
    detail: (id: number) => [...auditTrailKeys.all, "detail", id] as const,
};

// ==========================================
//  PAGINATED LIST (backend handles pagination, returns array)
// ==========================================

export const auditTrailListOptions = ({
    page = 1,
    limit = 20,
    controller,
    action,
    isError,
    sortBy,
    sortOrder,
}: AuditTrailSearch) =>
    queryOptions({
        queryKey: auditTrailKeys.list({
            page,
            limit,
            controller,
            action,
            isError,
            sortBy,
            sortOrder,
        }),
        queryFn: async () => {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
            });
            if (controller) params.set("controller", controller);
            if (action) params.set("action", action);
            if (typeof isError === "boolean")
                params.set("isError", String(isError));
            if (sortBy) params.set("sortBy", sortBy);
            if (sortOrder) params.set("sortOrder", sortOrder);

            const data = await apiRequest<AuditTrailResponse[]>(
                `/audittrail?${params}`,
            );
            return data;
        },
    });

// ==========================================
//  SINGLE DETAIL
// ==========================================

export const auditTrailDetailOptions = (id: number) =>
    queryOptions({
        queryKey: auditTrailKeys.detail(id),
        queryFn: () => apiRequest<AuditTrailResponse>(`/audittrail/${id}`),
    });
