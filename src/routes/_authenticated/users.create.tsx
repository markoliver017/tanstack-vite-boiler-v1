import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import LoadingComponent from "@/components/shared/LoadingComponent";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import { CreateUserForm } from "@/features/users/CreateUserForm";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/users/create")({
    staticData: {
        title: "Users Management",
        breadcrumb: "New User",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Create New User</CardTitle>
                </CardHeader>
                <CardContent>
                    <CreateUserForm
                        onSuccess={() =>
                            navigate({
                                to: "/users",
                                search: { page: 1, limit: 10 },
                            })
                        }
                    />
                </CardContent>
            </Card>
        </div>
    );
}
