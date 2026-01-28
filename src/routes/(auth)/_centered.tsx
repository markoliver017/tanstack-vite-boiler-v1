import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_centered")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="container-center">
            <Outlet />
        </div>
    );
}
