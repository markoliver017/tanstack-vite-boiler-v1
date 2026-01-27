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

export const Route = createFileRoute("/sign-in")({
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
            {/* <Card>
                <CardHeader>
                    <CardTitle>
                        <h3>Welcome Back</h3>
                        <h5 className="h4 text-muted-foreground">
                            Sign in to your account
                        </h5>
                    </CardTitle>
                </CardHeader>
                <CardContent> */}
            <LoginForm />
            {/* </CardContent>
            </Card> */}
        </div>
    );
}
