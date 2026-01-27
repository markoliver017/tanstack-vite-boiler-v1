import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/users/$userId")({
    loader: async ({ params }) => {
        const user = { name: params.userId };
        return {
            user,
            // This is what the breadcrumb component will look for!
            breadcrumb: user.name,
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_authenticated/users/$userId"!</div>;
}
