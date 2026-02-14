import BackButton from "@/components/shared/BackButton";
import LoadingComponent from "@/components/shared/LoadingComponent";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import { Separator } from "@/components/shadcn-ui/separator";
import { userDetailOptions } from "@/features/users/use-users";
import {
    useBanUser,
    useSetUserRole,
    useUnbanUser,
    useVerifyUserEmail,
} from "@/features/users/mutations";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Pencil, Shield, ShieldOff, UserCog } from "lucide-react";
import Swal from "sweetalert2";

export const Route = createFileRoute("/_authenticated/users/$userId")({
    loader: async ({ params, context: { queryClient } }) => {
        const user = await queryClient.ensureQueryData(
            userDetailOptions(params.userId),
        );
        return {
            user,
            breadcrumb: user.name,
        };
    },
    staticData: {
        title: "Users Management",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: UserDetailPage,
});

function UserDetailPage() {
    const { userId } = Route.useParams();
    const { data: user } = useSuspenseQuery(userDetailOptions(userId));

    const banMutation = useBanUser();
    const unbanMutation = useUnbanUser();
    const setRoleMutation = useSetUserRole();
    const verifyEmailMutation = useVerifyUserEmail();

    const handleChangeRole = () => {
        Swal.fire({
            title: "Change Role",
            input: "select",
            inputOptions: {
                user: "User",
                admin: "Admin",
                super_admin: "Super Admin",
                patient: "Patient",
            },
            inputValue: user.role ?? "user",
            showCancelButton: true,
            confirmButtonText: "Update Role",
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                setRoleMutation.mutate(
                    { userId: user.id, role: result.value as string },
                    {
                        onSuccess: () => {
                            Swal.fire({
                                title: "Role Updated",
                                icon: "success",
                                timer: 1500,
                                showConfirmButton: false,
                            });
                        },
                        onError: (error: Error) => {
                            Swal.fire({
                                title: "Error",
                                text: error.message || "Failed to update role",
                                icon: "error",
                            });
                        },
                    },
                );
            }
        });
    };

    const handleBanToggle = () => {
        if (user.banned) {
            Swal.fire({
                title: "Unban User?",
                text: `Are you sure you want to unban ${user.name}?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, unban",
            }).then((result) => {
                if (result.isConfirmed) {
                    unbanMutation.mutate(user.id, {
                        onSuccess: () => {
                            Swal.fire({
                                title: "User Unbanned",
                                icon: "success",
                                timer: 1500,
                                showConfirmButton: false,
                            });
                        },
                        onError: (error: Error) => {
                            Swal.fire({
                                title: "Error",
                                text: error.message || "Failed to unban user",
                                icon: "error",
                            });
                        },
                    });
                }
            });
        } else {
            Swal.fire({
                title: "Ban User?",
                input: "text",
                inputLabel: "Reason for ban (optional)",
                inputPlaceholder: "Enter reason...",
                showCancelButton: true,
                confirmButtonText: "Ban User",
                confirmButtonColor: "#d33",
            }).then((result) => {
                if (result.isConfirmed) {
                    banMutation.mutate(
                        {
                            userId: user.id,
                            banReason: result.value || undefined,
                        },
                        {
                            onSuccess: () => {
                                Swal.fire({
                                    title: "User Banned",
                                    icon: "success",
                                    timer: 1500,
                                    showConfirmButton: false,
                                });
                            },
                            onError: (error: Error) => {
                                Swal.fire({
                                    title: "Error",
                                    text: error.message || "Failed to ban user",
                                    icon: "error",
                                });
                            },
                        },
                    );
                }
            });
        }
    };

    return (
        <div className="p-4 space-y-4 max-w-3xl mx-auto">
            <BackButton />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                        {user.banned ? (
                            <Badge variant="destructive">Banned</Badge>
                        ) : (
                            <Badge variant="outline">Active</Badge>
                        )}
                        <Badge variant="secondary">{user.role ?? "user"}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">
                                Email Verified
                            </p>
                            <p className="font-medium">
                                {user.emailVerified ? "Yes" : "No"}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p className="font-medium">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Updated At</p>
                            <p className="font-medium">
                                {new Date(user.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                        {user.banReason && (
                            <div>
                                <p className="text-muted-foreground">
                                    Ban Reason
                                </p>
                                <p className="font-medium text-destructive">
                                    {user.banReason}
                                </p>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                        <Link
                            to="/users/$userId/edit"
                            params={{ userId: user.id }}
                        >
                            <Button variant="outline" size="sm">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleChangeRole}
                            disabled={setRoleMutation.isPending}
                        >
                            <UserCog className="mr-2 h-4 w-4" />
                            Change Role
                        </Button>
                        {!user.emailVerified && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                onClick={() => {
                                    Swal.fire({
                                        title: "Verify Email?",
                                        text: `Manually verify email for ${user.name}?`,
                                        icon: "question",
                                        showCancelButton: true,
                                        confirmButtonText: "Yes, verify",
                                        confirmButtonColor: "#16a34a",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            verifyEmailMutation.mutate(
                                                user.id,
                                                {
                                                    onSuccess: () => {
                                                        Swal.fire({
                                                            title: "Email Verified",
                                                            icon: "success",
                                                            timer: 1500,
                                                            showConfirmButton: false,
                                                        });
                                                    },
                                                    onError: (error: Error) => {
                                                        Swal.fire({
                                                            title: "Error",
                                                            text:
                                                                error.message ||
                                                                "Failed to verify email",
                                                            icon: "error",
                                                        });
                                                    },
                                                },
                                            );
                                        }
                                    });
                                }}
                                disabled={verifyEmailMutation.isPending}
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Verify Email
                            </Button>
                        )}
                        <Button
                            variant={user.banned ? "outline" : "destructive"}
                            size="sm"
                            onClick={handleBanToggle}
                            disabled={
                                banMutation.isPending || unbanMutation.isPending
                            }
                        >
                            {user.banned ? (
                                <>
                                    <ShieldOff className="mr-2 h-4 w-4" />
                                    Unban
                                </>
                            ) : (
                                <>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Ban User
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
