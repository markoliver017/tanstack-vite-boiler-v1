import BackButton from "@/components/shared/BackButton";
import { CreateDiscountForm } from "@/features/discounts/CreateDiscountForm";
import { discountByIdOptions } from "@/features/discounts/use-discounts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/discounts/$discountId")({
    params: {
        parse: (params) => ({
            discountId: z.number().int().parse(Number(params.discountId)),
        }),
        stringify: ({ discountId }) => ({ discountId: `${discountId}` }),
    },
    loader: ({ context: { queryClient }, params: { discountId } }) =>
        queryClient.ensureQueryData(discountByIdOptions(discountId)),
    staticData: {
        title: "Edit Discount",
        breadcrumb: "Edit Discount",
    },
    component: EditDiscountPage,
});

function EditDiscountPage() {
    const { discountId } = Route.useParams();
    const { data } = useSuspenseQuery(discountByIdOptions(discountId));

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateDiscountForm initialData={data} />
        </div>
    );
}
