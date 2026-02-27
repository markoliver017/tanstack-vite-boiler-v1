import { createFileRoute } from "@tanstack/react-router";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import { NavHeader } from "@/components/layouts/NavHeader";
import CreateTaxRuleForm from "@/features/tax-rules/CreateTaxRuleForm";

export const Route = createFileRoute("/_authenticated/tax-rules/create")({
    staticData: {
        title: "Tax Rules",
        breadcrumb: "Create Tax Rule",
    },
    errorComponent: PageErrorComponent,
    component: CreateTaxRulePage,
});

function CreateTaxRulePage() {
    return (
        <div>
            <NavHeader
                title="Create Tax Rule"
                description="Add a new tax rule to the system"
            />
            <div className="p-4 sm:p-6 lg:p-8">
                <CreateTaxRuleForm />
            </div>
        </div>
    );
}
