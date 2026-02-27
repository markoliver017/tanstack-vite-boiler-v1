import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";

import { discountsColumns } from "@/features/discounts/discounts-columns";
import { discountsListOptions } from "@/features/discounts/use-discounts";
import { discountSearchSchema } from "@/features/discounts/zDiscountSchema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/discounts/")({
    validateSearch: (search) => discountSearchSchema.parse(search),
    staticData: {
        title: "Discounts",
        breadcrumb: "Discounts",
    },
    component: DiscountsPage,
});

function DiscountsPage() {
    const search = Route.useSearch();

    const { data: loaderData, isFetching } = useQuery({
        ...discountsListOptions(search.page, search.limit),
        placeholderData: keepPreviousData,
    });

    const items = loaderData?.data || [];
    const totalCount = loaderData?.total || 0;

    const navigate = useNavigate({ from: Route.fullPath });
    const page = search.page;
    const limit = search.limit;
    const pageCount = Math.ceil(totalCount / limit);

    return (
        <div>
            <NavHeader
                title="Discounts"
                description="Manage date-bound discounts per ticket type"
            />
            <DataTable
                columns={discountsColumns}
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
                        <Button variant="success" asChild>
                            <Link to="/discounts/create">
                                <Plus className="h-4 w-4 mr-2" />
                                New Discount
                            </Link>
                        </Button>
                    </div>
                }
            />
        </div>
    );
}
