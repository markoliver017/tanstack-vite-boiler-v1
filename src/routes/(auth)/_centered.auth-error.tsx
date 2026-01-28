import { Button } from "@/components/shadcn-ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/(auth)/_centered/auth-error")({
    validateSearch: z.object({
        error: z.string(),
    }),
    component: RouteComponent,
});

function RouteComponent() {
    const { error } = Route.useSearch();

    const ERROR_MESSAGES: Record<string, string> = {
        signup_disabled:
            "Your account is not authorized to sign up. Please contact support.",
        "Network error":
            "Network error. Please check your internet connection and try again.",
        default: "An unexpected error occurred. Please try again.",
    };

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader className="text-center ">
                <CardTitle className="text-2xl font-bold">
                    Authentication Error
                </CardTitle>
            </CardHeader>
            <CardContent className="border-t">
                <div className="text-center ">
                    <p className="text-sm text-muted-foreground">
                        An error occurred during the authentication process.
                    </p>
                    <p className="mt-4 text-red-600">
                        {ERROR_MESSAGES[error] || ERROR_MESSAGES.default}
                    </p>
                    <div className="mt-6">
                        <Button
                            variant="link"
                            // onClick={() => (window.location.href = "/sign-in")}
                            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
                            asChild
                        >
                            <Link to="/sign-in">Return to Sign In</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
