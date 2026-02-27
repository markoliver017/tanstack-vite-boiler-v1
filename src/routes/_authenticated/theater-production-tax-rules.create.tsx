import BackButton from "@/components/shared/BackButton";
import { CreateTaxRuleOverrideForm } from "@/features/theater-production-tax-rules/CreateTaxRuleOverrideForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/theater-production-tax-rules/create",
)({
    staticData: {
        title: "Create Theater Tax Override",
        breadcrumb: "Create Override",
    },
    component: CreateTheaterTaxOverridePage,
});

function CreateTheaterTaxOverridePage() {
    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateTaxRuleOverrideForm />
        </div>
    );
}
