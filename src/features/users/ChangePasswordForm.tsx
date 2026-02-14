import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shadcn-ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import {
    changePasswordSchema,
    adminChangePasswordSchema,
    type ChangePasswordValues,
    type AdminChangePasswordValues,
} from "./zUsersSchema";
import { useChangePassword, useAdminSetPassword } from "./mutations";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ChangePasswordFormProps {
    /** If provided, uses admin mode (no current password needed) */
    targetUserId?: string;
}

export function ChangePasswordForm({ targetUserId }: ChangePasswordFormProps) {
    const isAdmin = !!targetUserId;
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);

    const changePasswordMutation = useChangePassword();
    const adminSetPasswordMutation = useAdminSetPassword();

    // Self mode form
    const selfForm = useForm<ChangePasswordValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    // Admin mode form
    const adminForm = useForm<AdminChangePasswordValues>({
        resolver: zodResolver(adminChangePasswordSchema),
        defaultValues: { newPassword: "", confirmPassword: "" },
    });

    const handleSelfSubmit = (data: ChangePasswordValues) => {
        changePasswordMutation.mutate(
            {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            },
            {
                onSuccess: () => {
                    Swal.fire({
                        title: "Password Changed",
                        text: "Your password has been updated successfully.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    selfForm.reset();
                },
                onError: (err) => {
                    Swal.fire({
                        title: "Error",
                        text: err.message || "Failed to change password",
                        icon: "error",
                    });
                },
            },
        );
    };

    const handleAdminSubmit = (data: AdminChangePasswordValues) => {
        if (!targetUserId) return;
        adminSetPasswordMutation.mutate(
            {
                userId: targetUserId,
                newPassword: data.newPassword,
            },
            {
                onSuccess: () => {
                    Swal.fire({
                        title: "Password Set",
                        text: "The user's password has been updated.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    adminForm.reset();
                },
                onError: (err) => {
                    Swal.fire({
                        title: "Error",
                        text: err.message || "Failed to set password",
                        icon: "error",
                    });
                },
            },
        );
    };

    if (isAdmin) {
        return (
            <Form {...adminForm}>
                <form
                    onSubmit={adminForm.handleSubmit(handleAdminSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={adminForm.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showNew ? "text" : "password"}
                                            placeholder="Enter new password"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                            onClick={() => setShowNew(!showNew)}
                                        >
                                            {showNew ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={adminForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showConfirm
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Confirm new password"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                            onClick={() =>
                                                setShowConfirm(!showConfirm)
                                            }
                                        >
                                            {showConfirm ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={adminSetPasswordMutation.isPending}
                    >
                        {adminSetPasswordMutation.isPending
                            ? "Setting..."
                            : "Set Password"}
                    </Button>
                </form>
            </Form>
        );
    }

    return (
        <Form {...selfForm}>
            <form
                onSubmit={selfForm.handleSubmit(handleSelfSubmit)}
                className="space-y-4"
            >
                <FormField
                    control={selfForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showCurrent ? "text" : "password"}
                                        placeholder="Enter current password"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                        onClick={() =>
                                            setShowCurrent(!showCurrent)
                                        }
                                    >
                                        {showCurrent ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={selfForm.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showNew ? "text" : "password"}
                                        placeholder="Enter new password"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                        onClick={() => setShowNew(!showNew)}
                                    >
                                        {showNew ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={selfForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                        onClick={() =>
                                            setShowConfirm(!showConfirm)
                                        }
                                    >
                                        {showConfirm ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                >
                    {changePasswordMutation.isPending
                        ? "Changing..."
                        : "Change Password"}
                </Button>
            </form>
        </Form>
    );
}
