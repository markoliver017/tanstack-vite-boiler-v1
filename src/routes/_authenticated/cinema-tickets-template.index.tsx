import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { cinemaTicketsTemplateColumns } from "@/features/cinema-tickets-template/cinema-tickets-template-columns";
import { cinemaTicketsTemplateListOptions } from "@/features/cinema-tickets-template/use-cinema-tickets-template";
import { cinemaTicketsTemplateSearchSchema } from "@/features/cinema-tickets-template/zCinemaTicketsTemplateSchema";
import { fetchList } from "@/lib/api.client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cinema-tickets-template/")({
    validateSearch: (search) => cinemaTicketsTemplateSearchSchema.parse(search),
    staticData: {
        title: "Cinema Ticket Templates",
        breadcrumb: "Cinema Ticket Templates",
    },
    component: CinemaTicketsTemplatePage,
});

function CinemaTicketsTemplatePage() {
    const search = Route.useSearch();
    const { data: loaderData, isFetching } = useQuery({
        ...cinemaTicketsTemplateListOptions(
            search.page,
            search.limit,
            search.cinemaId,
            search.ticketTypeId,
        ),
        placeholderData: keepPreviousData,
    });

    const { data: cinemasData } = useQuery({
        queryKey: ["cinemas", "all"],
        queryFn: () => fetchList<{ id: number; name: string }[]>("/cinemas?_limit=1000"),
    });

    const cinemas = cinemasData?.data || [];
    const items = loaderData?.data || [];
    const totalCount = loaderData?.total || 0;

    const navigate = useNavigate({ from: Route.fullPath });
    const page = search.page;
    const limit = search.limit;
    const pageCount = Math.ceil(totalCount / limit);

    const handleCinemaChange = (value: string) => {
        const cinemaId = value === "all" ? undefined : Number(value);
        navigate({
            search: (prev) => ({
                ...prev,
                cinemaId,
                page: 1,
            }),
        });
    };

    return (
        <div>
            <NavHeader
                title="Cinema Ticket Templates"
                description="Map which ticket types are available per cinema"
            />
            <DataTable
                columns={cinemaTicketsTemplateColumns}
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
                    <div className="flex gap-2">
                        <Select
                            value={search.cinemaId?.toString() || "all"}
                            onValueChange={handleCinemaChange}
                        >
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Cinema" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Cinemas</SelectItem>
                                {cinemas.map((cinema) => (
                                    <SelectItem
                                        key={cinema.id}
                                        value={cinema.id.toString()}
                                    >
                                        {cinema.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="success" asChild>
                            <Link to="/cinema-tickets-template/create">
                                <Plus className="h-4 w-4 mr-2" />
                                New Mapping
                            </Link>
                        </Button>
                    </div>
                }
            />
        </div>
    );
}
