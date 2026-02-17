import { createFileRoute } from "@tanstack/react-router";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { NavHeader } from "@/components/layouts/NavHeader";
import TheaterForm from "@/features/theaters/CreateTheaterForm";
import BackButton from "@/components/shared/BackButton";

export const Route = createFileRoute("/_authenticated/theaters/create")({
    staticData: {
        title: "Create Theater",
        breadcrumb: "Create",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: CreateTheaterPage,
});

function CreateTheaterPage() {
    return (
        <div className="space-y-6">
            <NavHeader
                title="Create Theater"
                description="Add a new theater location"
            />
            <div className="px-6">
                <BackButton />
                <div className="mt-4">
                    <TheaterForm />
                </div>
            </div>
        </div>
    );
}
