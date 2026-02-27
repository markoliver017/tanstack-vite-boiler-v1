import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { checkerAssignmentsColumns } from "@/features/movie-checker-theater-assignments/checker-assignments-columns";
import { CreateCheckerAssignmentForm } from "@/features/movie-checker-theater-assignments/CreateCheckerAssignmentForm";
import { checkerAssignmentsOptions } from "@/features/movie-checker-theater-assignments/use-checker-assignments";
import { checkerByIdOptions } from "@/features/checkers/use-checkers";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/checkers/$checkerId_/assignments",
)({
    loader: async ({ context: { queryClient }, params }) => {
        const checker = await queryClient.ensureQueryData(
            checkerByIdOptions(params.checkerId),
        );

        return {
            checker,
            breadcrumb: "Assignments",
        };
    },
    staticData: {
        title: "Checker Assignments",
        breadcrumb: "Checker Assignments",
    },
    component: CheckerAssignmentsPage,
});

function CheckerAssignmentsPage() {
    const { checkerId } = Route.useParams();
    const { checker } = Route.useLoaderData();

    const { data: assignments, isFetching } = useQuery({
        ...checkerAssignmentsOptions(checkerId),
        placeholderData: keepPreviousData,
    });

    return (
        <div className="space-y-6">
            <NavHeader
                title={`${checker.fullName} - Assignments`}
                description="Restrict checker to specific movies and theaters"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Assignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CreateCheckerAssignmentForm checkerId={Number(checkerId)} />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Current Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={checkerAssignmentsColumns}
                            data={assignments?.data || []}
                            isLoading={isFetching}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
