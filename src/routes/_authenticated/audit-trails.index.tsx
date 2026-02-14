import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import LoadingComponent from "@/components/shared/LoadingComponent";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import { auditTrailListOptions } from "@/features/audit-trails/hook";
import { auditTrailColumns } from "@/features/audit-trails/tbl-columns";
import { auditTrailSearchSchema } from "@/features/audit-trails/zAuditTrailSchema";
import type { AuditTrailResponse } from "@/features/audit-trails/zAuditTrailSchema";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/audit-trails/")({
    validateSearch: (search) => auditTrailSearchSchema.parse(search),
    loaderDeps: ({ search }) => ({ ...search }),
    loader: ({ context: { queryClient }, deps }) => {
        return queryClient.ensureQueryData(auditTrailListOptions(deps));
    },
    staticData: {
        title: "Audit Trails",
        breadcrumb: "Audit Trails",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: AuditTrailsPage,
});

function AuditTrailsPage() {
    const search = Route.useSearch();
    const { data: auditTrails } = useSuspenseQuery(
        auditTrailListOptions(search),
    );

    const navigate = useNavigate({ from: Route.fullPath });
    const page = search.page || 1;
    const limit = search.limit || 20;

    // Backend returns array directly (not { data, total }) — we estimate pagination
    const data: AuditTrailResponse[] = Array.isArray(auditTrails)
        ? auditTrails
        : [];
    // If the returned data length equals the limit, there might be more pages
    const hasMore = data.length === limit;
    const pageCount = hasMore ? page + 1 : page;

    return (
        <>
            <NavHeader
                title="Audit Trails"
                description="View system activity and audit logs."
            />
            <div className="md:p-2">
                <DataTable
                    columns={auditTrailColumns}
                    data={data}
                    searchPlaceholder="Filter audit trails..."
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
        </>
    );
}
