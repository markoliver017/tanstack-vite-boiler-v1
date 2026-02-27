import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { TaxRuleOverrideResponse } from "./zTaxRuleOverrideSchema";

export const taxRuleOverridesListOptions = (
    page: number,
    limit: number,
    theaterId?: number,
    productionCompanyId?: number,
) =>
    queryOptions({
        queryKey: [
            "theater-production-tax-rules",
            { page, limit, theaterId, productionCompanyId },
        ],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(page),
                _limit: String(limit),
                ...(theaterId ? { theater_id: String(theaterId) } : {}),
                ...(productionCompanyId
                    ? { production_company_id: String(productionCompanyId) }
                    : {}),
            });

            return fetchList<TaxRuleOverrideResponse[]>(
                `/theater-production-tax-rules?${params}`,
            );
        },
    });

export const taxRuleOverrideByIdOptions = (id: string | number) =>
    queryOptions({
        queryKey: ["theater-production-tax-rules", id],
        queryFn: () =>
            apiRequest<TaxRuleOverrideResponse>(`/theater-production-tax-rules/${id}`),
    });
