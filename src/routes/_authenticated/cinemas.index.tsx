import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import { Plus } from "lucide-react";
import { cinemasQueryOptions } from "@/features/cinemas/use-cinemas";
import { cinemasColumns } from "@/features/cinemas/cinemas-columns";
import { cinemaSearchSchema } from "@/features/cinemas/zCinemaSchema";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { fetchList } from "@/lib/api.client";

export const Route = createFileRoute("/_authenticated/cinemas/")({
    validateSearch: (search) => cinemaSearchSchema.parse(search),
    staticData: {
        title: "Cinemas",
        breadcrumb: "List of Cinemas",
    },
    component: CinemasPage,
});

function CinemasPage() {
    const search = Route.useSearch();
    const { data: loaderData, isFetching } = useQuery({
        ...cinemasQueryOptions(search),
        placeholderData: keepPreviousData,
    });

    const { data: theatersData } = useQuery({
        queryKey: ["theaters", "all"],
        queryFn: () => fetchList("/theaters?_limit=1000"),
    });

    const theaters =
        (theatersData?.data as Array<{ id: number; name: string }>) || [];

    const items = loaderData?.data || [];
    const totalCount = loaderData?.total || 0;

    const navigate = useNavigate({ from: Route.fullPath });
    const page = search.page || 1;
    const limit = search.limit || 10;
    const { q } = search;

    const pageCount = Math.ceil(totalCount / limit);

    const handleSearch = (value: string) => {
        navigate({
            search: (prev) => ({
                ...prev,
                q: value || undefined,
                page: 1,
            }),
        });
    };

    const handleTheaterChange = (value: string) => {
        const theaterId = value === "all" ? undefined : parseInt(value);
        navigate({
            search: (prev) => ({
                ...prev,
                theater_id: theaterId,
                page: 1,
            }),
        });
    };

    // Show loading state only on initial load (no data yet)
    if (!loaderData && isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full" />
            </div>
        );
    }

    return (
        <div>
            <NavHeader
                title="Cinemas"
                description="Manage cinema locations and configurations"
            />
            <DataTable
                columns={cinemasColumns}
                data={items}
                searchValue={q}
                onSearchChange={handleSearch}
                searchPlaceholder="Search cinemas..."
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
                    <div className="flex gap-2">
                        <Select
                            value={search.theater_id?.toString() || "all"}
                            onValueChange={handleTheaterChange}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by Theater" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Theaters
                                </SelectItem>
                                {theaters.map((theater) => (
                                    <SelectItem
                                        key={theater.id}
                                        value={theater.id.toString()}
                                    >
                                        {theater.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="success" asChild>
                            <Link to="/cinemas/create">
                                <Plus className="mr-2 h-4 w-4" /> New Cinema
                            </Link>
                        </Button>
                    </div>
                }
            />
        </div>
    );
}
