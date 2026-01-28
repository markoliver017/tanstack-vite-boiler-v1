// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "@/components/shadcn-ui/card";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoginForm from "@/features/auth/LoginForm";
import { searchSchema } from "@/features/auth/zAuthSchema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/sign-in")({
    component: RouteComponent,
    validateSearch: (search: Record<string, unknown>) => {
        return searchSchema.parse(search);
    },
    errorComponent: ({ error }) => {
        return <PageErrorComponent error={error} />;
    },
});

function RouteComponent() {
    return (
        <div>
            <LoginForm />
        </div>
    );
}
