import PrivateLayout from "@/components/layouts/PrivateLayout";
import {
    createFileRoute,
    Outlet,
    redirect,
    // redirect
} from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: async ({ context, location }) => {
        const { session, isPending } = context.auth;
        if (isPending) {
            return { isPending };
        }
        if (!session) {
            throw redirect({
                to: "/sign-in",
                search: {
                    // Redirect user back to where they were trying to go
                    redirect: location.href,
                },
            });
        }
        // // Pass the session down to all children routes via context
        return { session };
    },
    component: () => {
        return <AuthenticatedLayout />;
    },
    notFoundComponent: () => (
        <div className="flex flex-col justify-between items-center border rounded p-5">
            <h1 className="text-2xl mb-4 font-extrabold">
                404 – Page Not Found
            </h1>
            <p>The page you're looking for doesn't exist.</p>
        </div>
    ),
});

function AuthenticatedLayout() {
    // Access the data we returned from beforeLoad or the global context
    const context = Route.useRouteContext();
    const { isPending } = context;

    // console.log("AuthenticatedLayout Context>>>", context);

    if (isPending) {
        return (
            <div className="flex h-[calc(100dvh-4rem)] w-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="ml-4 text-lg font-medium">Verifying session...</p>
            </div>
        );
    }

    // If not pending, render the child routes
    return (
        <PrivateLayout>
            <Outlet />
        </PrivateLayout>
    );
}
