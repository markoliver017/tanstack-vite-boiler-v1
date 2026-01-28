import { Link } from "@tanstack/react-router";
import { Button } from "@/components/shadcn-ui/button";
import { ArrowLeft, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export function VerifiedUserComponent({ email }: { email?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center space-y-6 py-12 text-center"
        >
            <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-green-200/20 blur-lg" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-700">
                    <UserCheck size={40} />
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                    Already Verified
                </h2>
                <p className="text-muted-foreground max-w-[300px] mx-auto">
                    <span className="font-medium text-foreground italic">
                        {email}
                    </span>
                    .
                </p>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-[240px]">
                <Button asChild variant="default">
                    <Link to="/sign-in">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sign In
                    </Link>
                </Button>
            </div>
        </motion.div>
    );
}
