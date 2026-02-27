import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import { authorizationsColumns } from "@/features/checker-production-companies/authorizations-columns";
import { CreateAuthorizationForm } from "@/features/checker-production-companies/CreateAuthorizationForm";
import { checkerAuthorizationsOptions } from "@/features/checker-production-companies/use-authorizations";
import { checkerByIdOptions } from "@/features/checkers/use-checkers";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/checkers/$checkerId_/authorizations",
)({
    loader: async ({ context: { queryClient }, params }) => {
        const checker = await queryClient.ensureQueryData(
            checkerByIdOptions(params.checkerId),
        );

        return {
            checker,
            breadcrumb: "Authorizations",
        };
    },
    staticData: {
        title: "Checker Authorizations",
        breadcrumb: "Checker Authorizations",
    },
    component: CheckerAuthorizationsPage,
});

function CheckerAuthorizationsPage() {
    const { checkerId } = Route.useParams();
    const { checker } = Route.useLoaderData();

    const { data: authorizations, isFetching } = useQuery({
        ...checkerAuthorizationsOptions(Number(checkerId)),
        placeholderData: keepPreviousData,
    });

    return (
        <div className="space-y-6">
            <NavHeader
                title={`${checker.fullName} - Authorizations`}
                description="Authorize checker for production companies"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Authorization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CreateAuthorizationForm
                            checkerId={Number(checkerId)}
                        />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Current Authorizations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={authorizationsColumns}
                            data={authorizations?.data || []}
                            isLoading={isFetching}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
