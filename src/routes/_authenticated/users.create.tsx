import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import { CreateUserForm } from "@/features/users/CreateUserForm";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/users/create")({
    staticData: {
        title: "Users Management",
        breadcrumb: "New User",
    },
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New User</CardTitle>
            </CardHeader>
            <CardContent>
                <CreateUserForm onSuccess={() => navigate({ to: "/users" })} />
            </CardContent>
        </Card>
    );
}
