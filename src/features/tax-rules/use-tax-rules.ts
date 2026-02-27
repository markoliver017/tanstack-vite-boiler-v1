import { queryOptions } from "@tanstack/react-query";
import { fetchList, apiRequest } from "@/lib/api.client";
import type { TaxRuleResponse, TaxRuleSearch } from "./zTaxRuleSchema";

export const taxRulesListOptions = (search: Partial<TaxRuleSearch>) =>
    queryOptions({
        queryKey: ["tax-rules", search],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(search.page || 1),
                _limit: String(search.limit || 10),
                ...(search.q ? { q: search.q } : {}),
            });
            return fetchList<TaxRuleResponse[]>(`/tax-rules?${params}`);
        },
    });

export const taxRuleByIdOptions = (id: number | string) =>
    queryOptions({
        queryKey: ["tax-rules", id],
        queryFn: () => apiRequest<TaxRuleResponse>(`/tax-rules/${id}`),
    });
