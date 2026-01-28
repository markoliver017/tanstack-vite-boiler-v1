"use client";

import { Button } from "@/components/shadcn-ui/button";
import { useState } from "react";
import { Mail } from "lucide-react";
import PreloaderAlert from "@/components/shared/PreloaderAlert";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { getCallbackUrl } from "@/lib/utils";

interface ResendVerificationButtonProps {
    email: string;
}

export default function ResendVerificationButton({
    email,
}: ResendVerificationButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const handleResend = async () => {
        if (!email) return;
        setIsLoading(true);
        const result = await authClient.sendVerificationEmail({
            email,
            callbackURL: getCallbackUrl(`/auth-verification?email=${email}`),
        });
        console.log("authClient.sendVerificationEmail result", result);
        if (result.error) {
            toast.error(result.error.message);
        } else {
            toast.success("Verification email sent!");
        }
        setIsLoading(false);
    };

    return (
        <>
            <PreloaderAlert isLoading={isLoading} src="/loader/email.gif" />
            <Button onClick={handleResend} disabled={isLoading}>
                <Mail />
                Resend Verification Email
            </Button>
        </>
    );
}
