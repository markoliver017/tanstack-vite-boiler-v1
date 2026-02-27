import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import { ticketTypesColumns } from "@/features/ticket-types/ticket-types-columns";
import { ticketTypesListOptions } from "@/features/ticket-types/use-ticket-types";
import { ticketTypeSearchSchema } from "@/features/ticket-types/zTicketTypeSchema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ticket-types/")({
    validateSearch: (search) => ticketTypeSearchSchema.parse(search),
    staticData: {
        title: "Ticket Types",
        breadcrumb: "Ticket Types",
    },
    component: TicketTypesPage,
});

function TicketTypesPage() {
    const search = Route.useSearch();
    const { data: loaderData, isFetching } = useQuery({
        ...ticketTypesListOptions(search.page, search.limit, search.q, search.theaterId),
        placeholderData: keepPreviousData,
    });

    const items = loaderData?.data || [];
    const totalCount = loaderData?.total || 0;

    const navigate = useNavigate({ from: Route.fullPath });
    const page = search.page;
    const limit = search.limit;
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

    return (
        <div>
            <NavHeader
                title="Ticket Types"
                description="Manage global or theater-specific ticket types"
            />
            <DataTable
                columns={ticketTypesColumns}
                data={items}
                searchValue={q}
                onSearchChange={handleSearch}
                searchPlaceholder="Search ticket types..."
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
                        <Link to="/ticket-types/create">
                            <Plus className="h-4 w-4 mr-2" />
                            New Ticket Type
                        </Link>
                    </Button>
                }
            />
        </div>
    );
}
