import { queryOptions } from "@tanstack/react-query";
import { fetchList } from "@/lib/api.client";
import type { ScheduleResponse } from "./zScheduleSchema";

export const schedulesByCompanyOptions = (companyId: string) =>
    queryOptions({
        queryKey: ["production-report-schedules", { companyId }],
        queryFn: () => {
            const params = new URLSearchParams({
                production_company_id: companyId,
            });
            return fetchList<ScheduleResponse[]>(
                `/production-report-schedules?${params}`,
            );
        },
        enabled: !!companyId,
    });
