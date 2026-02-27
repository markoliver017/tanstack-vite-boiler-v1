import BackButton from "@/components/shared/BackButton";
import { CreateCheckerForm } from "@/features/checkers/CreateCheckerForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/checkers/create")({
    staticData: {
        title: "Create Checker",
        breadcrumb: "Create Checker",
    },
    component: CreateCheckerPage,
});

function CreateCheckerPage() {
    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateCheckerForm />
        </div>
    );
}
