import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import { taxRuleOverridesColumns } from "@/features/theater-production-tax-rules/tax-rule-overrides-columns";
import { taxRuleOverridesListOptions } from "@/features/theater-production-tax-rules/use-tax-rule-overrides";
import { taxRuleOverrideSearchSchema } from "@/features/theater-production-tax-rules/zTaxRuleOverrideSchema";
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

export const Route = createFileRoute(
    "/_authenticated/theater-production-tax-rules/",
)({
    validateSearch: (search) => taxRuleOverrideSearchSchema.parse(search),
    staticData: {
        title: "Theater Tax Overrides",
        breadcrumb: "Theater Tax Overrides",
    },
    component: TheaterTaxOverridesPage,
});

function TheaterTaxOverridesPage() {
    const search = Route.useSearch();

    const { data: loaderData, isFetching } = useQuery({
        ...taxRuleOverridesListOptions(
            search.page,
            search.limit,
            search.theaterId,
            search.productionCompanyId,
        ),
        placeholderData: keepPreviousData,
    });

    const { data: theatersData } = useQuery({
        queryKey: ["theaters", "all"],
        queryFn: () => fetchList("/theaters?_limit=1000"),
    });

    const { data: productionCompaniesData } = useQuery({
        queryKey: ["production-companies", "all"],
        queryFn: () => fetchList("/production-companies?_limit=1000"),
    });

    const theaters =
        (theatersData?.data as Array<{ id: number; name: string }>) || [];
    const productionCompanies =
        (productionCompaniesData?.data as Array<{
            id: number;
            name: string;
        }>) || [];

    const items = loaderData?.data || [];
    const totalCount = loaderData?.total || 0;

    const navigate = useNavigate({ from: Route.fullPath });
    const page = search.page;
    const limit = search.limit;
    const pageCount = Math.ceil(totalCount / limit);

    const handleTheaterChange = (value: string) => {
        const theaterId = value === "all" ? undefined : parseInt(value);
        navigate({
            search: (prev) => ({
                ...prev,
                theaterId,
                page: 1,
            }),
        });
    };

    const handleProductionCompanyChange = (value: string) => {
        const productionCompanyId =
            value === "all" ? undefined : parseInt(value);
        navigate({
            search: (prev) => ({
                ...prev,
                productionCompanyId,
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
                title="Theater Production Tax Rules"
                description="Configure production-company specific tax rule overrides"
            />
            <DataTable
                columns={taxRuleOverridesColumns}
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
                                {theaters.map((theater) => (
                                    <SelectItem
                                        key={theater.id}
                                        value={theater.id.toString()}
                                    >
                                        {theater.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={
                                search.productionCompanyId?.toString() || "all"
                            }
                            onValueChange={handleProductionCompanyChange}
                        >
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Company" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Production Companies
                                </SelectItem>
                                {productionCompanies.map((company) => (
                                    <SelectItem
                                        key={company.id}
                                        value={company.id.toString()}
                                    >
                                        {company.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="success" asChild>
                            <Link to="/theater-production-tax-rules/create">
                                <Plus className="h-4 w-4 mr-2" />
                                New Override
                            </Link>
                        </Button>
                    </div>
                }
            />
        </div>
    );
}
