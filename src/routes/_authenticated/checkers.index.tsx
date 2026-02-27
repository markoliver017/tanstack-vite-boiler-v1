import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import { checkersColumns } from "@/features/checkers/checkers-columns";
import { checkersListOptions } from "@/features/checkers/use-checkers";
import { checkerSearchSchema } from "@/features/checkers/zCheckerSchema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { fetchList } from "@/lib/api.client";

export const Route = createFileRoute("/_authenticated/checkers/")({
    validateSearch: (search) => checkerSearchSchema.parse(search),
    staticData: {
        title: "Checkers",
        breadcrumb: "Checkers",
    },
    component: CheckersPage,
});

function CheckersPage() {
    const search = Route.useSearch();
    const { data: loaderData, isFetching } = useQuery({
        ...checkersListOptions(
            search.page,
            search.limit,
            search.q,
            search.agencyId,
        ),
        placeholderData: keepPreviousData,
    });

    const { data: agenciesData } = useQuery({
        queryKey: ["agencies", "all"],
        queryFn: () => fetchList("/agencies?_limit=1000"),
    });

    const agencies =
        (agenciesData?.data as Array<{ id: number; name: string }>) || [];

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

    const handleAgencyChange = (value: string) => {
        const agencyId = value === "all" ? undefined : parseInt(value);
        navigate({
            search: (prev) => ({
                ...prev,
                agencyId,
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
                title="Checkers"
                description="Manage checker HR profiles"
            />
            <DataTable
                columns={checkersColumns}
                data={items}
                searchValue={q}
                onSearchChange={handleSearch}
                searchPlaceholder="Search checker..."
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
                            value={search.agencyId?.toString() || "all"}
                            onValueChange={handleAgencyChange}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Agency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Agencies
                                </SelectItem>
                                {agencies.map((agency) => (
                                    <SelectItem
                                        key={agency.id}
                                        value={agency.id.toString()}
                                    >
                                        {agency.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="success" asChild>
                            <Link to="/checkers/create">
                                <Plus className="h-4 w-4 mr-2" />
                                New Checker
                            </Link>
                        </Button>
                    </div>
                }
            />
        </div>
    );
}
