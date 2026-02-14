import BackButton from "@/components/shared/BackButton";
import LoadingComponent from "@/components/shared/LoadingComponent";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import { Badge } from "@/components/shadcn-ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import { Separator } from "@/components/shadcn-ui/separator";
import { auditTrailDetailOptions } from "@/features/audit-trails/hook";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/audit-trails/$auditTrailId",
)({
    loader: async ({ params, context: { queryClient } }) => {
        const trail = await queryClient.ensureQueryData(
            auditTrailDetailOptions(Number(params.auditTrailId)),
        );
        return {
            trail,
            breadcrumb: `Audit #${trail.id}`,
        };
    },
    staticData: {
        title: "Audit Trails",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: AuditTrailDetailPage,
});

function AuditTrailDetailPage() {
    const { auditTrailId } = Route.useParams();
    const { data: trail } = useSuspenseQuery(
        auditTrailDetailOptions(Number(auditTrailId)),
    );

    const createdDate = new Date(trail.createdAt);

    return (
        <div className="p-4 space-y-4 max-w-3xl mx-auto">
            <BackButton />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Audit Trail #{trail.id}</CardTitle>
                    {trail.isError ? (
                        <Badge variant="destructive">Error</Badge>
                    ) : (
                        <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                        >
                            Success
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Module</p>
                            <p className="font-medium capitalize">
                                {trail.controller}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Action</p>
                            <p className="font-medium capitalize">
                                {trail.action}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">User ID</p>
                            <p className="font-mono text-xs">{trail.userId}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Timestamp</p>
                            <p className="font-medium">
                                {createdDate.toLocaleDateString()}{" "}
                                {createdDate.toLocaleTimeString()}
                            </p>
                        </div>
                        {trail.ipAddress && (
                            <div>
                                <p className="text-muted-foreground">
                                    IP Address
                                </p>
                                <p className="font-mono text-xs">
                                    {trail.ipAddress}
                                </p>
                            </div>
                        )}
                        {trail.userAgent && (
                            <div className="col-span-2">
                                <p className="text-muted-foreground">
                                    User Agent
                                </p>
                                <p className="font-mono text-xs break-all">
                                    {trail.userAgent}
                                </p>
                            </div>
                        )}
                    </div>

                    {trail.details && (
                        <>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">
                                    Details
                                </p>
                                <p className="text-sm">{trail.details}</p>
                            </div>
                        </>
                    )}

                    {trail.stackTrace && (
                        <>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">
                                    Stack Trace
                                </p>
                                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                                    {trail.stackTrace}
                                </pre>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
