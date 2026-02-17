import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import { Plus } from "lucide-react";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { cinemaFormatsListOptions } from "@/features/cinema-formats/use-cinema-formats";
import { cinemaFormatsColumns } from "@/features/cinema-formats/cinema-formats-columns";
import { cinemaFormatSearchSchema } from "@/features/cinema-formats/zCinemaFormatSchema";

export const Route = createFileRoute("/_authenticated/cinema-formats/")({
    validateSearch: (search) => cinemaFormatSearchSchema.parse(search),
    staticData: {
        title: "Cinema Formats",
        breadcrumb: "Cinema Formats",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: LoadingComponent,
    component: CinemaFormatsPage,
});

function CinemaFormatsPage() {
    const search = Route.useSearch();
    const { data: loaderData, isFetching } = useQuery({
        ...cinemaFormatsListOptions(search),
        placeholderData: keepPreviousData,
    });

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
                title="Cinema Formats"
                description="Manage cinema formats"
            />
            <DataTable
                columns={cinemaFormatsColumns}
                data={items}
                searchValue={q}
                onSearchChange={handleSearch}
                searchPlaceholder="Search formats..."
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
                        <Link to="/cinema-formats/create">
                            <Plus className="mr-2 h-4 w-4" /> New Format
                        </Link>
                    </Button>
                }
            />
        </div>
    );
}
