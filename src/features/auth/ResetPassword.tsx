import { useState, useEffect } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Lock,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Eye,
    EyeOff,
    ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";

const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter",
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter",
            )
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage({ token }: { token: string }) {
    const navigate = useNavigate();

    const [isResetting, setIsResetting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!token) {
            setError(
                "Invalid or missing reset token. Please request a new password reset.",
            );
        }
    }, [token]);

    const onSubmit = async (values: ResetPasswordValues) => {
        if (!token) {
            setError("Invalid token. Please request a new password reset.");
            return;
        }

        setIsResetting(true);
        setError(null);

        try {
            const { data, error: resetError } = await authClient.resetPassword({
                newPassword: values.newPassword,
                token,
            });
            console.log("resetPassword data", data);

            if (resetError) {
                const errorMsg =
                    resetError.message ||
                    "Failed to reset password. The link may have expired. Please try again.";
                setError(errorMsg);
                toast.error("Error", {
                    description: errorMsg,
                });
            } else {
                setIsSuccess(true);
                toast.success("Success", {
                    description:
                        "Password reset successfully! Redirecting to sign in...",
                });
                // Redirect to sign-in after 2 seconds
                setTimeout(() => {
                    navigate({ to: "/sign-in" });
                }, 2000);
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred";
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
        } finally {
            setIsResetting(false);
        }
    };

    if (!token) {
        return (
            <div className="w-full space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="relative w-20 h-20">
                            <img
                                src="/pcmc_logo.png"
                                alt="PCMC Logo"
                                className="object-contain drop-shadow-md"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-blue-950 dark:text-blue-50">
                        Invalid Reset Link
                    </h1>
                </div>

                {/* Error Card */}
                <Card className="border-red-200 bg-red-50/50">
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <AlertCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-900 mb-1">
                                    Invalid or Expired Link
                                </h3>
                                <p className="text-sm text-red-800">
                                    The password reset link is missing or has
                                    expired. Please request a new one.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action */}
                <Link to="/forgot-password" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Request New Reset Link
                    </Button>
                </Link>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="w-full space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="relative w-20 h-20">
                            <img
                                src="/pcmc_logo.png"
                                alt="PCMC Logo"
                                className="object-contain drop-shadow-md"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-blue-950 dark:text-blue-50">
                        Password Reset Successful
                    </h1>
                </div>

                {/* Success Card */}
                <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="shrink-0">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-green-900 mb-1">
                                    Your password has been reset
                                </h3>
                                <p className="text-sm text-green-800">
                                    You can now sign in with your new password.
                                    Redirecting you to the sign-in page...
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Loading indicator */}
                <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>

                {/* Manual redirect link */}
                <div className="text-center">
                    <p className="text-sm text-slate-600">
                        Not redirected?{" "}
                        <Link
                            to="/sign-in"
                            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                    <div className="relative w-20 h-20">
                        <img
                            src="/pcmc_logo.png"
                            alt="PCMC Logo"
                            className="object-contain drop-shadow-md"
                        />
                    </div>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-blue-950 dark:text-blue-50">
                    Create New Password
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enter your new password below
                </p>
            </div>

            {/* Form */}
            <Form {...form}>
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-center animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                        <span className="text-red-700 text-sm font-medium">
                            {error}
                        </span>
                    </div>
                )}

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••••"
                                            {...field}
                                            className="pl-10 pr-10 h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-slate-50/50"
                                            disabled={isResetting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                <p className="text-xs text-slate-500 mt-1">
                                    At least 8 characters, with uppercase,
                                    lowercase, and numbers
                                </p>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••••"
                                            {...field}
                                            className="pl-10 pr-10 h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-slate-50/50"
                                            disabled={isResetting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
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
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm transition-all"
                        disabled={isResetting}
                    >
                        {isResetting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            <>
                                <Lock className="mr-2 h-4 w-4" />
                                Reset Password
                            </>
                        )}
                    </Button>
                </form>
            </Form>

            {/* Back to Sign In */}
            <div className="text-center pt-2">
                <p className="text-sm text-slate-600">
                    Remember your password?{" "}
                    <Link
                        to="/sign-in"
                        className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}
