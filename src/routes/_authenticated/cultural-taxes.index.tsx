import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import { culturalTaxesColumns } from "@/features/cultural-taxes/cultural-taxes-columns";
import { culturalTaxesListOptions } from "@/features/cultural-taxes/use-cultural-taxes";
import { culturalTaxSearchSchema } from "@/features/cultural-taxes/zCulturalTaxSchema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cultural-taxes/")({
    validateSearch: (search) => culturalTaxSearchSchema.parse(search),
    staticData: {
        title: "Cultural Taxes",
        breadcrumb: "Cultural Taxes",
    },
    component: CulturalTaxesPage,
});

function CulturalTaxesPage() {
    const search = Route.useSearch();
    const { data: loaderData, isFetching } = useQuery({
        ...culturalTaxesListOptions(search.page, search.limit, search.q),
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
                title="Cultural Taxes"
                description="Manage city and province ordinance deductions"
            />
            <DataTable
                columns={culturalTaxesColumns}
                data={items}
                searchValue={q}
                onSearchChange={handleSearch}
                searchPlaceholder="Search by city/province..."
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
                        <Link to="/cultural-taxes/create">
                            <Plus className="h-4 w-4 mr-2" />
                            New Cultural Tax
                        </Link>
                    </Button>
                }
            />
        </div>
    );
}
