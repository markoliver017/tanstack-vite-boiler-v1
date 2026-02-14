import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import {
    Check,
    Command,
    Eye,
    MoreHorizontal,
    Pencil,
    Shield,
    ShieldOff,
    Trash,
    UserCog,
} from "lucide-react";
import Swal from "sweetalert2";
import type { UserResponse } from "./zUsersSchema";

const columnHelper = createColumnHelper<UserResponse>();

export const userColumns = (
    deleteMutation: {
        mutate: (id: string, opts?: Record<string, unknown>) => void;
    },
    banMutation: {
        mutate: (
            args: { userId: string; banReason?: string },
            opts?: Record<string, unknown>,
        ) => void;
    },
    unbanMutation: {
        mutate: (userId: string, opts?: Record<string, unknown>) => void;
    },
    setRoleMutation: {
        mutate: (
            args: { userId: string; role: string },
            opts?: Record<string, unknown>,
        ) => void;
    },
    verifyMutation: {
        mutate: (userId: string, opts?: Record<string, unknown>) => void;
    },
) => [
    columnHelper.accessor("name", {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("email", {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: (info) => (
            <span className="text-muted-foreground">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => {
            const role = info.getValue() ?? "user";
            const variant =
                role === "super_admin" || role === "admin"
                    ? "default"
                    : "secondary";
            return <Badge variant={variant}>{role}</Badge>;
        },
    }),
    columnHelper.accessor("banned", {
        header: "Status",
        cell: (info) => {
            const banned = info.getValue();
            return banned ? (
                <Badge variant="destructive">Banned</Badge>
            ) : (
                <Badge variant="outline">Active</Badge>
            );
        },
    }),
    columnHelper.accessor("emailVerified", {
        header: "Verified",
        cell: (info) =>
            info.getValue() ? (
                <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                >
                    Verified
                </Badge>
            ) : (
                <Badge variant="secondary">Unverified</Badge>
            ),
    }),
    columnHelper.accessor("id", {
        id: "actions",
        header: "Actions",
        cell: (info) => {
            const row = info.row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="flex items-center space-x-2">
                            <Command className="w-3 h-3" />
                            <span>Actions</span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* View */}
                        <Link
                            to="/users/$userId"
                            params={{ userId: info.getValue() }}
                            search={{ page: 1, limit: 10 }}
                        >
                            <DropdownMenuItem className="flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                            </DropdownMenuItem>
                        </Link>

                        {/* Edit */}
                        <Link
                            to="/users/$userId/edit"
                            params={{ userId: info.getValue() }}
                        >
                            <DropdownMenuItem className="flex items-center space-x-2">
                                <Pencil className="w-4 h-4" />
                                <span>Edit User</span>
                            </DropdownMenuItem>
                        </Link>

                        {/* Change Role */}
                        <DropdownMenuItem
                            className="flex items-center space-x-2"
                            onClick={() => {
                                Swal.fire({
                                    title: "Change Role",
                                    input: "select",
                                    inputOptions: {
                                        user: "User",
                                        admin: "Admin",
                                        super_admin: "Super Admin",
                                        patient: "Patient",
                                    },
                                    inputValue: row.role ?? "user",
                                    showCancelButton: true,
                                    confirmButtonText: "Update Role",
                                }).then((result) => {
                                    if (result.isConfirmed && result.value) {
                                        setRoleMutation.mutate(
                                            {
                                                userId: row.id,
                                                role: result.value as string,
                                            },
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
                                                        text:
                                                            error.message ||
                                                            "Failed to update role",
                                                        icon: "error",
                                                    });
                                                },
                                            },
                                        );
                                    }
                                });
                            }}
                        >
                            <UserCog className="w-4 h-4" />
                            <span>Change Role</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Ban / Unban */}
                        {row.banned ? (
                            <DropdownMenuItem
                                className="flex items-center space-x-2"
                                onClick={() => {
                                    Swal.fire({
                                        title: "Unban User?",
                                        text: `Unban ${row.name}?`,
                                        icon: "question",
                                        showCancelButton: true,
                                        confirmButtonText: "Yes, unban",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            unbanMutation.mutate(row.id, {
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
                                                        text:
                                                            error.message ||
                                                            "Failed to unban user",
                                                        icon: "error",
                                                    });
                                                },
                                            });
                                        }
                                    });
                                }}
                            >
                                <ShieldOff className="w-4 h-4" />
                                <span>Unban</span>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                className="flex items-center space-x-2 text-orange-600"
                                onClick={() => {
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
                                                    userId: row.id,
                                                    banReason:
                                                        result.value ||
                                                        undefined,
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
                                                            text:
                                                                error.message ||
                                                                "Failed to ban user",
                                                            icon: "error",
                                                        });
                                                    },
                                                },
                                            );
                                        }
                                    });
                                }}
                            >
                                <Shield className="w-4 h-4" />
                                <span>Ban</span>
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        {/* Verify Email */}
                        {!row.emailVerified && (
                            <>
                                <DropdownMenuItem
                                    className="flex items-center space-x-2 text-green-600"
                                    onClick={() => {
                                        Swal.fire({
                                            title: "Verify Email?",
                                            text: `Manually verify email for ${row.name}?`,
                                            icon: "question",
                                            showCancelButton: true,
                                            confirmButtonText: "Yes, verify",
                                            confirmButtonColor: "#16a34a",
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                verifyMutation.mutate(row.id, {
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
                                                });
                                            }
                                        });
                                    }}
                                >
                                    <Check className="w-4 h-4" />
                                    <span>Verify Email</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}

                        {/* Delete */}
                        <DropdownMenuItem
                            className="flex items-center space-x-2 text-destructive"
                            onClick={() => {
                                Swal.fire({
                                    title: "Delete User?",
                                    text: `This will permanently delete ${row.name}. This action cannot be undone.`,
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#d33",
                                    confirmButtonText: "Yes, delete",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        deleteMutation.mutate(row.id, {
                                            onSuccess: () => {
                                                Swal.fire({
                                                    title: "Deleted",
                                                    text: "User has been deleted.",
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
                                                        "Failed to delete user",
                                                    icon: "error",
                                                });
                                            },
                                        });
                                    }
                                });
                            }}
                        >
                            <Trash className="w-4 h-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
];
