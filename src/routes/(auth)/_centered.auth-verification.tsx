import { Button } from "@/components/shadcn-ui/button";
import PageErrorSearchComponent from "@/components/shared/PageErrorSearchComponent";
import ResendVerificationButton from "@/features/auth/ResendVerificationButton";
import { UserNotFound } from "@/features/auth/UserNotFound";
import { VerifiedUserComponent } from "@/features/auth/VerifiedUserComponent";
import { userByEmailOptions } from "@/features/users/use-users";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { Toaster } from "sonner";
import z from "zod";

export const Route = createFileRoute("/(auth)/_centered/auth-verification")({
    component: RouteComponent,
    validateSearch: z.object({
        email: z.email(),
    }),
    errorComponent: PageErrorSearchComponent,
});

function RouteComponent() {
    const { email } = Route.useSearch();

    const { data: user, isLoading } = useQuery({
        ...userByEmailOptions(email),
        enabled: !!email,
    });

    if (!user) {
        return <UserNotFound email={email} />;
    }

    // If the user is already verified
    if (user?.emailVerified) {
        return <VerifiedUserComponent email={email} />;
    }

    return (
        <div className="text-center">
            <Toaster />
            <h1 className="text-2xl font-bold">Check your email</h1>
            {isLoading ? (
                <p>Verifying status...</p>
            ) : (
                <>
                    <p className="mt-2 text-muted-foreground">
                        We've sent a verification link to{" "}
                        <strong>{email}</strong>.
                    </p>
                    <p className="mt-4">
                        Please check your inbox to complete the sign-up process.
                    </p>
                    <div className="mt-6">
                        <ResendVerificationButton email={email} />
                    </div>
                    <div className="mt-6">
                        <Button asChild>
                            <Link to="/sign-in">
                                <LogIn />
                                Proceed to Sign In
                            </Link>
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
