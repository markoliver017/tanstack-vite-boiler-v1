import BackButton from "@/components/shared/BackButton";
import { CreateTaxRuleOverrideForm } from "@/features/theater-production-tax-rules/CreateTaxRuleOverrideForm";
import { taxRuleOverrideByIdOptions } from "@/features/theater-production-tax-rules/use-tax-rule-overrides";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
    "/_authenticated/theater-production-tax-rules/$overrideId",
)({
    params: {
        parse: (params) => ({
            overrideId: z.number().int().parse(Number(params.overrideId)),
        }),
        stringify: ({ overrideId }) => ({ overrideId: `${overrideId}` }),
    },
    loader: ({ context: { queryClient }, params: { overrideId } }) =>
        queryClient.ensureQueryData(taxRuleOverrideByIdOptions(overrideId)),
    staticData: {
        title: "Edit Theater Tax Override",
        breadcrumb: "Edit Override",
    },
    component: EditTheaterTaxOverridePage,
});

function EditTheaterTaxOverridePage() {
    const { overrideId } = Route.useParams();
    const { data } = useSuspenseQuery(taxRuleOverrideByIdOptions(overrideId));

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateTaxRuleOverrideForm initialData={data} />
        </div>
    );
}
