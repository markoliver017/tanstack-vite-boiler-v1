import PageErrorComponent from "@/components/shared/PageErrorComponent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
    staticData: {
        title: "Dashboard",
        breadcrumb: "Dashboard",
    },
    // loader: async () => {
    //     throw { message: "Something went wrong" };
    // },
    errorComponent: ({ error }) => {
        return <PageErrorComponent error={error} />;
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_authenticated/dashboard"!</div>;
}
