import { NavHeader } from "@/components/layouts/NavHeader";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import { DataTable } from "@/components/shared/DataTable";
import LoadingComponent from "@/components/shared/LoadingComponent";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import { CreateScheduleForm } from "@/features/production-report-schedules/CreateScheduleForm";
import { schedulesColumns } from "@/features/production-report-schedules/schedules-columns";
import { schedulesByCompanyOptions } from "@/features/production-report-schedules/use-schedules";
import { apiRequest } from "@/lib/api.client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/production-companies/$companyId_/schedules",
)({
    loader: async ({ params }) => {
        // Fetch company name for breadcrumb/title
        const company = await apiRequest<{ name: string }>(
            `/production-companies/${params.companyId}`,
        );
        return {
            company,
            breadcrumb: "Schedules",
        };
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: ProductionCompanySchedulesPage,
});

function ProductionCompanySchedulesPage() {
    const { companyId } = Route.useParams();
    const { company } = Route.useLoaderData();

    const { data: loaderData, isFetching } = useQuery({
        ...schedulesByCompanyOptions(companyId),
        placeholderData: keepPreviousData,
    });

    const items = loaderData?.data || [];
    const totalCount = loaderData?.total ?? items.length;

    return (
        <div className="space-y-6">
            <NavHeader
                title={`${company.name} - Schedules`}
                description="Manage required reporting time slots"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Create Form */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Slot</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CreateScheduleForm
                                productionCompanyId={parseInt(companyId, 10)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: List */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Existing Slots</CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    {totalCount} slots found
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={schedulesColumns}
                                data={items}
                                isLoading={isFetching}
                                // Simple client-side pagination since list is short
                                manualPagination={false}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
