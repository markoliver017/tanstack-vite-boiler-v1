import BackButton from "@/components/shared/BackButton";
import { CreateCinemaTicketsTemplateForm } from "@/features/cinema-tickets-template/CreateCinemaTicketsTemplateForm";
import { cinemaTicketsTemplateByIdOptions } from "@/features/cinema-tickets-template/use-cinema-tickets-template";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
    "/_authenticated/cinema-tickets-template/$templateId",
)({
    params: {
        parse: (params) => ({
            templateId: z.number().int().parse(Number(params.templateId)),
        }),
        stringify: ({ templateId }) => ({ templateId: `${templateId}` }),
    },
    loader: ({ context: { queryClient }, params: { templateId } }) =>
        queryClient.ensureQueryData(cinemaTicketsTemplateByIdOptions(templateId)),
    staticData: {
        title: "Edit Cinema Ticket Template",
        breadcrumb: "Edit Mapping",
    },
    component: EditCinemaTicketsTemplatePage,
});

function EditCinemaTicketsTemplatePage() {
    const { templateId } = Route.useParams();
    const { data } = useSuspenseQuery(
        cinemaTicketsTemplateByIdOptions(templateId),
    );

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateCinemaTicketsTemplateForm initialData={data} />
        </div>
    );
}
