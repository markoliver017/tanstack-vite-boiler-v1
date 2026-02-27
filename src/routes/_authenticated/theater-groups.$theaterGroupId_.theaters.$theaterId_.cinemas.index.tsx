import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { cinemasQueryOptions } from "@/features/cinemas/use-cinemas";
import { cinemasColumns } from "@/features/cinemas/cinemas-columns";
import { cinemaSearchSchema } from "@/features/cinemas/zCinemaSchema";
import { theaterByIdOptions } from "@/features/theaters/use-theaters";

export const Route = createFileRoute(
    "/_authenticated/theater-groups/$theaterGroupId_/theaters/$theaterId_/cinemas/",
)({
    validateSearch: (search) => cinemaSearchSchema.parse(search),
    staticData: {
        title: "Cinemas",
        breadcrumb: "Cinemas",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: TheaterCinemasPage,
});

function TheaterCinemasPage() {
    const { theaterId } = Route.useParams();
    const theaterIdNumber = Number(theaterId);
    const search = Route.useSearch();

    const { data: loaderData, isFetching } = useQuery({
        ...cinemasQueryOptions({
            ...search,
            theater_id: theaterIdNumber,
        }),
        placeholderData: keepPreviousData,
    });

    const { data: theater } = useQuery(theaterByIdOptions(theaterId));

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
                title={`Cinemas · ${theater?.name || "Theater"}`}
                description="Manage cinemas under this theater"
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
                    <Button variant="success" asChild>
                        <Link
                            to="/cinemas/create"
                            search={{ theaterId: theaterIdNumber }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> New Cinema
                        </Link>
                    </Button>
                }
            />
        </div>
    );
}
