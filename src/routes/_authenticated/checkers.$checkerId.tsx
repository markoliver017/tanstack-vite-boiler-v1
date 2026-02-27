import BackButton from "@/components/shared/BackButton";
import { CreateCheckerForm } from "@/features/checkers/CreateCheckerForm";
import { checkerByIdOptions } from "@/features/checkers/use-checkers";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/checkers/$checkerId")({
    params: {
        parse: (params) => ({
            checkerId: z.number().int().parse(Number(params.checkerId)),
        }),
        stringify: ({ checkerId }) => ({ checkerId: `${checkerId}` }),
    },
    loader: ({ context: { queryClient }, params: { checkerId } }) =>
        queryClient.ensureQueryData(checkerByIdOptions(checkerId)),
    staticData: {
        title: "Edit Checker",
        breadcrumb: "Edit Checker",
    },
    component: EditCheckerPage,
});

function EditCheckerPage() {
    const { checkerId } = Route.useParams();
    const { data } = useSuspenseQuery(checkerByIdOptions(checkerId));

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateCheckerForm initialData={data} />
        </div>
    );
}
