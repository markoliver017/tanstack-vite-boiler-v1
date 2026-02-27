import BackButton from "@/components/shared/BackButton";
import { CreateCulturalTaxForm } from "@/features/cultural-taxes/CreateCulturalTaxForm";
import { culturalTaxByIdOptions } from "@/features/cultural-taxes/use-cultural-taxes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
    "/_authenticated/cultural-taxes/$culturalTaxId",
)({
    params: {
        parse: (params) => ({
            culturalTaxId: z.number().int().parse(Number(params.culturalTaxId)),
        }),
        stringify: ({ culturalTaxId }) => ({ culturalTaxId: `${culturalTaxId}` }),
    },
    loader: ({ context: { queryClient }, params: { culturalTaxId } }) =>
        queryClient.ensureQueryData(culturalTaxByIdOptions(culturalTaxId)),
    staticData: {
        title: "Edit Cultural Tax",
        breadcrumb: "Edit Cultural Tax",
    },
    component: EditCulturalTaxPage,
});

function EditCulturalTaxPage() {
    const { culturalTaxId } = Route.useParams();
    const { data } = useSuspenseQuery(culturalTaxByIdOptions(culturalTaxId));

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateCulturalTaxForm initialData={data} />
        </div>
    );
}
