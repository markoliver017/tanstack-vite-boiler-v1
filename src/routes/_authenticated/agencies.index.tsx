import { NavHeader } from "@/components/layouts/NavHeader";
import { Button } from "@/components/shadcn-ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { agenciesQueryOptions } from "@/features/agencies/use-agencies";
import { agenciesColumns } from "@/features/agencies/agencies-columns";
import { agencySearchSchema } from "@/features/agencies/zAgencySchema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/agencies/")({
    validateSearch: (search) => agencySearchSchema.parse(search),
    staticData: {
        title: "Agencies Management",
        breadcrumb: "Agencies",
    },
    component: AgenciesPage,
});

function AgenciesPage() {
    const search = Route.useSearch();
    const { data: loaderData, isFetching } = useQuery({
        ...agenciesQueryOptions(search),
        placeholderData: keepPreviousData,
    });

    const agencies = loaderData?.data || [];
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
        <div className="flex flex-col gap-6">
            <NavHeader
                title="Agencies"
                description="Manage agencies and their cinema locations"
            />

            <DataTable
                columns={agenciesColumns}
                data={agencies}
                searchValue={q}
                onSearchChange={handleSearch}
                searchPlaceholder="Search agencies..."
                isLoading={isFetching}
                sideComponent={
                    <Button variant="default" asChild>
                        <Link to="/agencies/create">
                            <PlusIcon className="mr-2 h-4 w-4" /> Add Agency
                        </Link>
                    </Button>
                }
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
            />
        </div>
    );
}
