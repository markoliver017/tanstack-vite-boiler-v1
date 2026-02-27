import { createFileRoute } from "@tanstack/react-router";
import { apiRequest } from "@/lib/api.client";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { NavHeader } from "@/components/layouts/NavHeader";
import EditTaxRuleForm from "@/features/tax-rules/EditTaxRuleForm";
import type { TaxRuleResponse } from "@/features/tax-rules/zTaxRuleSchema";

export const Route = createFileRoute("/_authenticated/tax-rules/$taxRuleId")({
    loader: async ({ params }) => {
        const item = await apiRequest<TaxRuleResponse>(
            `/tax-rules/${params.taxRuleId}`,
        );
        return {
            item,
            breadcrumb: item.name,
        };
    },
    errorComponent: PageErrorComponent,
    pendingComponent: LoadingComponent,
    component: EditTaxRulePage,
});

function EditTaxRulePage() {
    const { item } = Route.useLoaderData();

    return (
        <div>
            <NavHeader
                title="Edit Tax Rule"
                description="Modify existing tax rule details"
            />
            <div className="p-4 sm:p-6 lg:p-8">
                <EditTaxRuleForm initialData={item} />
            </div>
        </div>
    );
}
