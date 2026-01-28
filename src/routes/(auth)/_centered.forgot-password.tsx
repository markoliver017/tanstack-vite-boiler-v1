import { Card, CardContent } from "@/components/shadcn-ui/card";
import ForgotPasswordPage from "@/features/auth/ForgotPassword";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_centered/forgot-password")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Card>
            <CardContent>
                <ForgotPasswordPage />
            </CardContent>
        </Card>
    );
}
