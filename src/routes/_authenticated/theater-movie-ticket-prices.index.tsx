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
import { theaterMovieTicketPricesColumns } from "@/features/theater-movie-ticket-prices/theater-movie-ticket-prices-columns";
import { theaterMovieTicketPricesListOptions } from "@/features/theater-movie-ticket-prices/use-theater-movie-ticket-prices";
import { theaterMovieTicketPriceSearchSchema } from "@/features/theater-movie-ticket-prices/zTheaterMovieTicketPriceSchema";
import { fetchList } from "@/lib/api.client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute(
    "/_authenticated/theater-movie-ticket-prices/",
)({
    validateSearch: (search) =>
        theaterMovieTicketPriceSearchSchema.parse(search),
    staticData: {
        title: "Theater Movie Ticket Prices",
        breadcrumb: "Theater Ticket Prices",
    },
    component: TheaterMovieTicketPricesPage,
});

function TheaterMovieTicketPricesPage() {
    const search = Route.useSearch();

    const { data: loaderData, isFetching } = useQuery({
        ...theaterMovieTicketPricesListOptions(
            search.page,
            search.limit,
            search.theaterId,
            search.movieId,
        ),
        placeholderData: keepPreviousData,
    });

    const { data: theatersData } = useQuery({
        queryKey: ["theaters", "all"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>("/theaters?_limit=1000"),
    });

    const { data: moviesData } = useQuery({
        queryKey: ["movies", "all"],
        queryFn: () =>
            fetchList<{ id: number; title: string }[]>("/movies?_limit=1000"),
    });

    const theaters = theatersData?.data || [];
    const movies = moviesData?.data || [];
    const items = loaderData?.data || [];
    const totalCount = loaderData?.total || 0;

    const navigate = useNavigate({ from: Route.fullPath });
    const page = search.page;
    const limit = search.limit;
    const pageCount = Math.ceil(totalCount / limit);

    const handleTheaterChange = (value: string) => {
        const theaterId = value === "all" ? undefined : Number(value);

        navigate({
            search: (prev) => ({
                ...prev,
                theaterId,
                page: 1,
            }),
        });
    };

    const handleMovieChange = (value: string) => {
        const movieId = value === "all" ? undefined : Number(value);

        navigate({
            search: (prev) => ({
                ...prev,
                movieId,
                page: 1,
            }),
        });
    };

    return (
        <div>
            <NavHeader
                title="Theater Movie Ticket Prices"
                description="Configure dynamic ticket pricing by theater, movie, and format"
            />
            <DataTable
                columns={theaterMovieTicketPricesColumns}
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
                            value={search.theaterId?.toString() || "all"}
                            onValueChange={handleTheaterChange}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Theater" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Theaters
                                </SelectItem>
                                {theaters.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={String(item.id)}
                                    >
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={search.movieId?.toString() || "all"}
                            onValueChange={handleMovieChange}
                        >
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Movie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Movies</SelectItem>
                                {movies.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={String(item.id)}
                                    >
                                        {item.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="success" asChild>
                            <Link to="/theater-movie-ticket-prices/create">
                                <Plus className="h-4 w-4 mr-2" />
                                New Price
                            </Link>
                        </Button>
                    </div>
                }
            />
        </div>
    );
}
