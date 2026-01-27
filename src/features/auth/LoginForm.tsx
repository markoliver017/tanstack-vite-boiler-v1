import { useForm } from "react-hook-form";
import { useSignIn } from "./mutations";
import { signInSchema, type SignInValues } from "./zAuthSchema";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Link, useSearch } from "@tanstack/react-router";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Button } from "@/components/shadcn-ui/button";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/shadcn-ui/card";

export default function LoginForm() {
    const { redirect } = useSearch({ from: "/sign-in" });
    const [showPassword, setShowPassword] = useState(false);

    const { mutate, isPending } = useSignIn();
    const form = useForm<SignInValues>({
        resolver: standardSchemaResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            role: "user",
            rememberMe: false,
            callbackURL: redirect || "/dashboard",
        },
    });

    const onSubmit = (data: SignInValues) => {
        mutate(data, {
            onSuccess: (res) => {
                form.reset();
                if (typeof res === "string") {
                    toast.success(`Login successfull: ${res}`);
                } else {
                    toast.success(`Login successful: ${JSON.stringify(res)}`);
                }
            },
            onError: (err) => {
                toast.error(`Login failed: ${err?.message || "Unknown error"}`);
            },
        });
    };

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
            <Toaster position="top-center" />

            {/* LEFT PANEL: Branding (Visible on Large Screens) */}
            <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-primary p-12 text-primary-foreground">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center space-y-6"
                >
                    <div className="h-48 w-48 rounded-full bg-white/10 p-4 backdrop-blur-sm border border-white/20 shadow-2xl">
                        {/* Replace with your actual logo path */}
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
                                    {/* Replace with your actual logo path */}
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
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
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
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-slate-700 font-semibold">
                                                Password
                                            </FormLabel>
                                            <Link
                                                to="/sign-up" // Typically forgot-password route
                                                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                Forgot Password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                                                <Input
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="••••••••"
                                                    {...field}
                                                    className="pl-10 pr-10 h-11 border-slate-200 bg-slate-50/30 focus:bg-white"
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

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="rememberMe"
                                    // eslint-disable-next-line react-hooks/incompatible-library
                                    checked={form.watch("rememberMe")}
                                    onCheckedChange={(checked) =>
                                        form.setValue("rememberMe", !!checked)
                                    }
                                />
                                <label
                                    htmlFor="rememberMe"
                                    className="text-sm font-medium text-slate-600 cursor-pointer"
                                >
                                    Remember me
                                </label>
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-11 bg-primary hover:bg-[#003366] text-white font-bold transition-all shadow-lg active:scale-[0.98]"
                            >
                                {isPending ? "SIGNING IN..." : "SIGN IN"}
                            </Button>

                            <div className="relative flex items-center py-2">
                                <div className="grow border-t border-slate-200"></div>
                                <span className="mx-4 shrink text-xs font-bold text-slate-400">
                                    OR
                                </span>
                                <div className="grow border-t border-slate-200"></div>
                            </div>

                            <Button
                                variant="outline"
                                type="button"
                                className="w-full h-11 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                            >
                                Access Patient Portal Here
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 flex justify-center space-x-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                        <Link
                            to="/"
                            className="hover:text-slate-600 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <span>|</span>
                        <Link
                            to="/"
                            className="hover:text-slate-600 transition-colors"
                        >
                            System Status
                        </Link>
                    </div>
                    {/* <pre className="text-gray-400 text-sm">
                        {JSON.stringify(form.watch(), null, 2)}
                    </pre> */}
                </CardContent>
            </Card>
        </div>
    );
}
