import BackButton from "@/components/shared/BackButton";
import { CreateCulturalTaxForm } from "@/features/cultural-taxes/CreateCulturalTaxForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/cultural-taxes/create")({
    staticData: {
        title: "Create Cultural Tax",
        breadcrumb: "Create Cultural Tax",
    },
    component: CreateCulturalTaxPage,
});

function CreateCulturalTaxPage() {
    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateCulturalTaxForm />
        </div>
    );
}
