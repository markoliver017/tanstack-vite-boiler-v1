import ResetPasswordPage from "@/features/auth/ResetPassword";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/(auth)/_centered/reset-password")({
    component: RouteComponent,
    validateSearch: z.object({
        token: z.string(),
    }),
});

function RouteComponent() {
    const { token } = Route.useSearch();
    return <ResetPasswordPage token={token} />;
}
