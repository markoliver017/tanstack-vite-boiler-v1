import { NavHeader } from "@/components/layouts/NavHeader";
import { Button } from "@/components/shadcn-ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { useTheaterGroups } from "@/features/theater-groups/use-theater-groups";
import { theaterGroupsColumns } from "@/features/theater-groups/theater-groups-columns";
import { theaterGroupSearchSchema } from "@/features/theater-groups/zTheaterGroupSchema";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/theater-groups/")({
    validateSearch: (search) => theaterGroupSearchSchema.parse(search),
    component: TheaterGroupsPage,
});

function TheaterGroupsPage() {
    const search = Route.useSearch();
    const page = search.page || 1;
    const limit = search.limit || 10;
    const query = search.query;

    const { data: theaterGroups, isFetching } = useTheaterGroups(
        query,
        page,
        limit,
    );

    const navigate = useNavigate({ from: Route.fullPath });

    const handleSearch = (value: string) => {
        navigate({
            search: (prev) => ({
                ...prev,
                query: value || undefined,
                page: 1,
            }),
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <NavHeader
                title="Theater Groups"
                description="Manage theater groups (chains) and their configurations"
            />

            <div className="container mx-auto p-4 md:p-6 lg:p-8 pt-0">
                <DataTable
                    columns={theaterGroupsColumns}
                    data={theaterGroups?.data || []}
                    searchValue={query}
                    onSearchChange={handleSearch}
                    searchPlaceholder="Search theater groups..."
                    isLoading={isFetching}
                    sideComponent={
                        <Button variant="default" asChild>
                            <Link to="/theater-groups/create">
                                <PlusIcon className="mr-2 h-4 w-4" /> Add
                                Theater Group
                            </Link>
                        </Button>
                    }
                    manualPagination={true}
                    pageCount={Math.ceil((theaterGroups?.total || 0) / limit)}
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
        </div>
    );
}
