import { apiRequest, fetchList } from "@/lib/api.client";
import { queryOptions } from "@tanstack/react-query";
import type { HourlyReportResponse } from "./zHourlyReportSchema";

export const hourlyReportsListOptions = (
    page: number,
    limit: number,
    cinemaId?: number,
    movieId?: number,
    reportDate?: string,
    reportTime?: string,
    status?: "pending" | "approved" | "rejected",
) =>
    queryOptions({
        queryKey: [
            "hourly-reports",
            { page, limit, cinemaId, movieId, reportDate, reportTime, status },
        ],
        queryFn: () => {
            const params = new URLSearchParams({
                _page: String(page),
                _limit: String(limit),
                ...(cinemaId ? { cinema_id: String(cinemaId) } : {}),
                ...(movieId ? { movie_id: String(movieId) } : {}),
                ...(reportDate ? { report_date: reportDate } : {}),
                ...(reportTime ? { report_time: reportTime } : {}),
                ...(status ? { status } : {}),
            });

            return fetchList<HourlyReportResponse[]>(`/hourly-reports?${params}`);
        },
    });

export const hourlyReportByIdOptions = (id: number | string) =>
    queryOptions({
        queryKey: ["hourly-reports", id],
        queryFn: () => apiRequest<HourlyReportResponse>(`/hourly-reports/${id}`),
    });
