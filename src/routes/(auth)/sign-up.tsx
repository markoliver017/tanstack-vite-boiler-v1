import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { useState } from "react";
import {
    AlertCircle,
    User,
    Mail,
    Lock,
    ArrowRight,
    EyeOff,
    Eye,
} from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { signUpSchema, type SignUpValues } from "@/features/users/zUsersSchema";
import { getCallbackUrl } from "@/lib/utils";
import PreloaderAlert from "@/components/shared/PreloaderAlert";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import { motion } from "framer-motion";

export const Route = createFileRoute("/(auth)/sign-up")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [googleSigningIn, setGoogleSigningIn] = useState(false);

    const {
        mutate: signUp,
        isPending,
        error,
        isError,
    } = useMutation({
        mutationFn: async (values: SignUpValues) => {
            const response = await authClient.signUp.email(values);
            if (response.error) {
                throw response.error;
            }
            return {
                success: true,
                message: "Sign up successful",
            };
        },
        onSuccess: (response, variables) => {
            toast.success(response.message);
            navigate({ to: variables.callbackURL });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            callbackURL: getCallbackUrl("/auth-verification"),
        },
    });

    function onSubmit(values: SignUpValues) {
        const callbackURL = `/auth-verification?email=${values.email}`;
        signUp({ ...values, callbackURL });
    }

    const handleLoginProvider = async () => {
        setGoogleSigningIn(true);

        try {
            const res = await authClient.signIn.social({
                provider: "google",
                callbackURL: getCallbackUrl("/dashboard"),
                errorCallbackURL: getCallbackUrl("/auth-error"),
                // newUserCallbackURL: "/auth-welcome",
                disableRedirect: false,
            });
            setGoogleSigningIn(false);
            console.log("Better Auth Response:", res);
        } catch (error) {
            console.error("Login error:", error);
            setGoogleSigningIn(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
            {/* LEFT PANEL: Branding (Visible on Large Screens) */}
            <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-primary p-12 text-primary-foreground">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center space-y-6"
                >
                    <div className="h-48 w-48 rounded-full bg-white/10 p-4 backdrop-blur-sm border border-white/20 shadow-2xl">
                        <img
                            src="/pcmc_logo.png"
                            alt="PCMC Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="space-y-2">
                        <h1 className="h1 text-3xl font-bold tracking-tight">
                            Philippine Children's Medical Center
                        </h1>
                        <p className="text-xl font-light text-blue-100/80">
                            Anesthesia Electronic Scheduling System
                        </p>
                    </div>
                </motion.div>
                <div className="absolute bottom-10 text-blue-200/50 text-sm font-medium">
                    Department of Anesthesia
                </div>
            </div>

            {/* RIGHT PANEL: The Form */}
            <Card className="flex flex-1 items-center justify-center bg-slate-50">
                <CardContent className="w-full max-w-md space-y-8 rounded-3xl bg-white shadow-2xl shadow-slate-200 ring-1 ring-slate-100">
                    <div className="text-center">
                        <div className="lg:hidden tems-center justify-center ">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center space-y-6"
                            >
                                <div className="h-24 w-24 rounded-full bg-white/10 p-2 backdrop-blur-sm border border-white/20 shadow-2xl">
                                    <img
                                        src="/pcmc_logo.png"
                                        alt="PCMC Logo"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Philippine Children's Medical Center
                                    </h1>
                                    <p className="text-xl text-slate-500">
                                        Anesthesia Electronic Scheduling System
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                        <h2 className="hidden lg:block text-2xl font-bold text-slate-900">
                            Create an Account
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Please fill in the details to register.
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
                            {isError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-center animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    <span className="text-red-700 text-sm font-medium">
                                        {error?.message}
                                    </span>
                                </div>
                            )}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                                                <Input
                                                    placeholder="Enter your full name"
                                                    {...field}
                                                    className="pl-10 h-11 border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">
                                            Email Address
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                                                <Input
                                                    placeholder="Enter your email"
                                                    {...field}
                                                    className="pl-10 h-11 border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                                                <Input
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    className="pl-10 pr-10 h-11 border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword,
                                                        )
                                                    }
                                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
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
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full h-11 font-semibold shadow-md transition-all bg-primary hover:bg-blue-700"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    "Creating account..."
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Create Account{" "}
                                        <ArrowRight className="size-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full h-11"
                        onClick={handleLoginProvider}
                        disabled={googleSigningIn}
                    >
                        {googleSigningIn ? (
                            "Signing up..."
                        ) : (
                            <div className="flex items-center gap-2">
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22.5777 12.2592C22.5777 11.4592 22.5077 10.6892 22.3877 9.94922H12.0077V14.2592H18.0677C17.8077 15.6592 17.0277 16.8592 15.8677 17.6592V20.5392H19.7077C21.5677 18.8892 22.5777 15.8892 22.5777 12.2592Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12.0077 23.0001C15.1677 23.0001 17.8177 21.9301 19.7077 20.5401L15.8677 17.6601C14.7977 18.3901 13.4977 18.8301 12.0077 18.8301C9.13773 18.8301 6.72773 16.9501 5.86773 14.4301H1.91772V17.4101C3.80772 20.6901 7.59773 23.0001 12.0077 23.0001Z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.86773 14.4299C5.62773 13.7299 5.48773 12.9899 5.48773 12.2299C5.48773 11.4699 5.62773 10.7299 5.86773 10.0299V7.04992H1.91772C1.16772 8.54992 0.727725 10.3199 0.727725 12.2299C0.727725 14.1399 1.16772 15.9099 1.91772 17.4099L5.86773 14.4299Z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12.0077 5.61995C13.6177 5.61995 15.0077 6.16995 16.1377 7.23995L19.7777 3.76995C17.8077 1.95995 15.1577 0.889954 12.0077 0.889954C7.59773 0.889954 3.80772 3.19995 1.91772 6.47995L5.86773 9.45995C6.72773 6.93995 9.13773 5.61995 12.0077 5.61995Z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Sign up with Google
                            </div>
                        )}
                    </Button>

                    <div className="text-center pt-2">
                        <p className="text-sm text-slate-600">
                            Already have an account?{" "}
                            <Link
                                to="/sign-in"
                                className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                    <PreloaderAlert
                        isLoading={isPending || googleSigningIn}
                        linearBg={false}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
