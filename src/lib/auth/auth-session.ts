import type { AuthSession } from "@/types/auth";
import { wait } from "../utils";
import { authClient } from "./auth-client";

/**
 * REUSABLE AUTH HELPER
 */
export const getAuthSession = async (): Promise<AuthSession | null> => {
    await wait();
    const { data: session, error } = await authClient.getSession();

    if (!session || error) return null;

    return {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user?.role ?? undefined,
    };
    //     const authenticated = false;
    //     const role = "user";
    // if (!authenticated) return null;

    // return {
    //     userId: "asd01923ad",
    //     email: "mark@email.com",
    //     role: role,
    //     name: "Mark Roman",
    //     image: "/pcmc_logo.png",
    // };
};
