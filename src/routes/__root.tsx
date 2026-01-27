import {
    Outlet,
    Scripts,
    createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import type { AuthSession } from "@/types/auth";
import type { authClient } from "@/lib/auth/auth-client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { NotFoundComponent } from "@/components/shared/NotFoundComponent";

interface MyRouterContext {
    queryClient: QueryClient;
    auth: typeof authClient & {
        session: AuthSession | null;
        isPending: boolean;
    };
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: "Anesthesia Electronic Scheduling System",
            },
        ],
    }),
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
});

function RootComponent() {
    return (
        <MainLayout>
            <Outlet />
            <TanStackRouterDevtools />
            <Scripts />
        </MainLayout>
    );
}
