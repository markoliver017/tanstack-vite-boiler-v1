"use client";

import { useEffect, useState } from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { getAuthSession } from "./lib/auth/auth-session";
import { authClient } from "./lib/auth/auth-client";
import type { AuthSession } from "./types/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
    interface StaticDataRouteOption {
        title?: string;
        breadcrumb?: string;
    }
}

const queryClient = new QueryClient();

const router = createRouter({
    routeTree,
    context: {
        queryClient,
        auth: undefined!,
    },
    defaultPreload: "intent",
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
});

function App() {
    const [session, setSession] = useState<AuthSession | null>(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const authSession = await getAuthSession();
                setSession(authSession);
            } catch (error) {
                console.error("Failed to load auth session:", error);
                setSession(null);
            } finally {
                setIsPending(false);
            }
        };

        loadSession();
    }, []);

    useEffect(() => {
        router.invalidate();
    }, [session, isPending]);

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider
                router={router}
                context={{
                    queryClient,
                    auth: {
                        ...authClient,
                        session,
                        isPending,
                    },
                }}
            />
        </QueryClientProvider>
    );
}

export default App;
