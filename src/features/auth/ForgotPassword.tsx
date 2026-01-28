import { useState } from "react";

import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Mail,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { Link } from "@tanstack/react-router";
import { forgotPasswordSchema, type ForgotPasswordValues } from "./zAuthSchema";

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: ForgotPasswordValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const { data, error: resetError } =
                await authClient.requestPasswordReset({
                    email: values.email,
                    redirectTo: `${window.location.origin}/reset-password`,
                });
            console.log("requestPasswordReset data", data);

            if (resetError) {
                setError(
                    resetError.message ||
                        "Failed to send reset email. Please try again.",
                );
                toast.error("Error", {
                    description:
                        resetError.message || "Failed to send reset email",
                });
            } else {
                setIsSubmitted(true);
                setSubmittedEmail(values.email);
                toast.success("Success", {
                    description: "Password reset email sent. Check your inbox!",
                });
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
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
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
                        Check Your Email
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        We've sent a password reset link to your email
                    </p>
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
                                    Email Sent Successfully
                                </h3>
                                <p className="text-sm text-green-800 mb-3">
                                    We've sent a password reset link to{" "}
                                    <span className="font-medium">
                                        {submittedEmail}
                                    </span>
                                </p>
                                <p className="text-xs text-green-700">
                                    The link will expire in 24 hours. If you
                                    don't see the email, check your spam folder.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="bg-slate-50/50">
                    <CardHeader>
                        <CardTitle className="text-base">
                            What's Next?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-700">
                        <div className="flex gap-3">
                            <span className="shrink-0 font-semibold text-blue-600">
                                1.
                            </span>
                            <span>Click the reset link in your email</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="shrink-0 font-semibold text-blue-600">
                                2.
                            </span>
                            <span>Enter your new password</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="shrink-0 font-semibold text-blue-600">
                                3.
                            </span>
                            <span>Sign in with your new password</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Link to="/sign-in" className="w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sign In
                        </Button>
                    </Link>
                    <button
                        onClick={() => {
                            setIsSubmitted(false);
                            form.reset();
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                    >
                        Try another email
                    </button>
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
                    Reset Your Password
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enter your email address and we'll send you a link to reset
                    your password
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="your.email@pcmc.gov.ph"
                                            type="email"
                                            {...field}
                                            className="pl-10 h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-slate-50/50"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm transition-all"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Reset Link
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
