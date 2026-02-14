import { Button } from "@/components/shadcn-ui/button";
import { Badge } from "@/components/shadcn-ui/badge";
import { LinkIcon, Unlink } from "lucide-react";
import { useLinkGoogle, useUnlinkGoogle } from "./mutations";
import Swal from "sweetalert2";
import { authClient } from "@/lib/auth/auth-client";
import { useQuery } from "@tanstack/react-query";

function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className}>
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

export function LinkedAccounts() {
    const linkMutation = useLinkGoogle();
    const unlinkMutation = useUnlinkGoogle();

    // Fetch linked accounts via better-auth session
    const { data: accounts, refetch } = useQuery({
        queryKey: ["linked-accounts"],
        queryFn: async () => {
            const res = await authClient.listAccounts();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (res as any)?.data || [];
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googleAccount = (accounts as any[])?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (a: any) => a.provider === "google" || a.providerId === "google",
    );

    const handleLink = () => {
        linkMutation.mutate(
            { callbackURL: window.location.href },
            {
                onError: (err) => {
                    Swal.fire({
                        title: "Linking Failed",
                        text: err.message,
                        icon: "error",
                    });
                },
            },
        );
    };

    const handleUnlink = () => {
        Swal.fire({
            title: "Unlink Google Account?",
            text: "You will no longer be able to sign in with Google.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, unlink",
            confirmButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                unlinkMutation.mutate(undefined, {
                    onSuccess: () => {
                        refetch();
                        Swal.fire({
                            title: "Account Unlinked",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                    onError: (err) => {
                        Swal.fire({
                            title: "Error",
                            text: err.message,
                            icon: "error",
                        });
                    },
                });
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                    <GoogleIcon className="h-6 w-6" />
                    <div>
                        <p className="font-medium">Google</p>
                        <p className="text-sm text-muted-foreground">
                            {googleAccount ? "Connected" : "Not connected"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {googleAccount ? (
                        <>
                            <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                            >
                                Linked
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleUnlink}
                                disabled={unlinkMutation.isPending}
                            >
                                <Unlink className="mr-1 h-4 w-4" />
                                Unlink
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLink}
                            disabled={linkMutation.isPending}
                        >
                            <LinkIcon className="mr-1 h-4 w-4" />
                            Link Account
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
