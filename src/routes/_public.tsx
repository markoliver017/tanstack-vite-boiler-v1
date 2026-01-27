import { PublicLayout } from "@/components/layouts/PublicLayout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
    component: RouteComponent,
    notFoundComponent: () => (
        <div className="flex flex-col justify-between items-center border rounded p-5">
            <h1 className="text-2xl mb-4 font-extrabold">
                404 – Page Not Found
            </h1>
            <p>The page you're looking for doesn't exist.</p>
        </div>
    ),
});

function RouteComponent() {
    return (
        <PublicLayout>
            <Outlet />
        </PublicLayout>
    );
}
