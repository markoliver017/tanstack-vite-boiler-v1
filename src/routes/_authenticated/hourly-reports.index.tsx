import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { hourlyReportsColumns } from "@/features/hourly-reports/hourly-reports-columns";
import { hourlyReportsListOptions } from "@/features/hourly-reports/use-hourly-reports";
import { hourlyReportSearchSchema } from "@/features/hourly-reports/zHourlyReportSchema";
import { fetchList } from "@/lib/api.client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/hourly-reports/")({
    validateSearch: (search) => hourlyReportSearchSchema.parse(search),
    staticData: {
        title: "Hourly Reports",
        breadcrumb: "Hourly Reports",
    },
    component: HourlyReportsPage,
});

function HourlyReportsPage() {
    const search = Route.useSearch();

    const { data: loaderData, isFetching } = useQuery({
        ...hourlyReportsListOptions(
            search.page,
            search.limit,
            search.cinemaId,
            search.movieId,
            search.reportDate,
            search.reportTime,
            search.status,
        ),
        placeholderData: keepPreviousData,
    });

    const { data: cinemasData } = useQuery({
        queryKey: ["cinemas", "all"],
        queryFn: () => fetchList<{ id: number; name: string }[]>("/cinemas?_limit=1000"),
    });

    const { data: moviesData } = useQuery({
        queryKey: ["movies", "all"],
        queryFn: () => fetchList<{ id: number; title: string }[]>("/movies?_limit=1000"),
    });

    const cinemas = cinemasData?.data || [];
    const movies = moviesData?.data || [];

    const items = loaderData?.data || [];
    const totalCount = loaderData?.total || 0;

    const navigate = useNavigate({ from: Route.fullPath });
    const page = search.page;
    const limit = search.limit;
    const pageCount = Math.ceil(totalCount / limit);

    return (
        <div>
            <NavHeader
                title="Hourly Reports"
                description="Submit and review hourly report entries"
            />
            <DataTable
                columns={hourlyReportsColumns}
                data={items}
                isLoading={isFetching}
                manualPagination={true}
                pageCount={pageCount}
                pagination={{
                    pageIndex: page - 1,
                    pageSize: limit,
                }}
                onPaginationChange={(updater) => {
                    const nextState =
                        typeof updater === "function"
                            ? updater({
                                  pageIndex: page - 1,
                                  pageSize: limit,
                              })
                            : updater;

                    navigate({
                        search: (prev) => ({
                            ...prev,
                            page: nextState.pageIndex + 1,
                            limit: nextState.pageSize,
                        }),
                    });
                }}
                sideComponent={
                    <div className="flex items-center gap-2">
                        <Select
                            value={search.cinemaId?.toString() || "all"}
                            onValueChange={(value) =>
                                navigate({
                                    search: (prev) => ({
                                        ...prev,
                                        cinemaId: value === "all" ? undefined : Number(value),
                                        page: 1,
                                    }),
                                })
                            }
                        >
                            <SelectTrigger className="w-[170px]">
                                <SelectValue placeholder="Cinema" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Cinemas</SelectItem>
                                {cinemas.map((cinema) => (
                                    <SelectItem key={cinema.id} value={String(cinema.id)}>
                                        {cinema.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={search.movieId?.toString() || "all"}
                            onValueChange={(value) =>
                                navigate({
                                    search: (prev) => ({
                                        ...prev,
                                        movieId: value === "all" ? undefined : Number(value),
                                        page: 1,
                                    }),
                                })
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Movie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Movies</SelectItem>
                                {movies.map((movie) => (
                                    <SelectItem key={movie.id} value={String(movie.id)}>
                                        {movie.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={search.status || "all"}
                            onValueChange={(value) =>
                                navigate({
                                    search: (prev) => ({
                                        ...prev,
                                        status:
                                            value === "all"
                                                ? undefined
                                                : (value as "pending" | "approved" | "rejected"),
                                        page: 1,
                                    }),
                                })
                            }
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            type="date"
                            value={search.reportDate || ""}
                            onChange={(event) =>
                                navigate({
                                    search: (prev) => ({
                                        ...prev,
                                        reportDate: event.target.value || undefined,
                                        page: 1,
                                    }),
                                })
                            }
                            className="w-[150px]"
                        />

                        <Input
                            type="time"
                            value={search.reportTime || ""}
                            onChange={(event) =>
                                navigate({
                                    search: (prev) => ({
                                        ...prev,
                                        reportTime: event.target.value || undefined,
                                        page: 1,
                                    }),
                                })
                            }
                            className="w-[140px]"
                        />

                        <Button variant="success" asChild>
                            <Link to="/hourly-reports/create">
                                <Plus className="h-4 w-4 mr-2" />
                                New Report
                            </Link>
                        </Button>
                    </div>
                }
            />
        </div>
    );
}
