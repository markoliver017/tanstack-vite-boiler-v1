import { authClient } from "@/lib/auth/auth-client";
import { useMutation } from "@tanstack/react-query";
import type { SignInValues } from "./zAuthSchema";

export function useSignIn() {
    return useMutation({
        mutationFn: async (values: SignInValues) => {
            const result = await authClient.signIn.email(values);
            if (result.error) {
                throw result.error;
            }

            return result;
        },
        onSuccess: (res) => {
            return {
                success: true,
                data: res,
            };
        },
    });
}
