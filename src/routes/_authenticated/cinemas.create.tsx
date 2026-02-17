import { createFileRoute } from "@tanstack/react-router";
import { NavHeader } from "@/components/layouts/NavHeader";
import { CreateCinemaForm } from "@/features/cinemas/CreateCinemaForm";
import BackButton from "@/components/shared/BackButton";

export const Route = createFileRoute("/_authenticated/cinemas/create")({
    staticData: {
        title: "Create Cinema",
        breadcrumb: "Create New Cinema",
    },
    component: CreateCinemaPage,
});

function CreateCinemaPage() {
    return (
        <div className="p-6 space-y-6">
            <BackButton />
            <NavHeader
                title="Create New Cinema"
                description="Add a new cinema location to the system"
            />
            <div className="max-w-2xl">
                <CreateCinemaForm />
            </div>
        </div>
    );
}
