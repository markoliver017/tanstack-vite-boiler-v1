import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
    staticData: {
        breadcrumb: "Dashboard",
    },
    component: Index,
});

function Index() {
    const context = Route.useRouteContext();
    const { auth } = context;
    console.log("Context", context);

    return (
        <div className="p-2">
            <h3>Welcome Home!</h3>
            <pre>{JSON.stringify(auth, null, 2)}</pre>
        </div>
    );
}
