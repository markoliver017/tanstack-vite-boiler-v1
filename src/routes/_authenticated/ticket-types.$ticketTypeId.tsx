import BackButton from "@/components/shared/BackButton";
import { CreateTicketTypeForm } from "@/features/ticket-types/CreateTicketTypeForm";
import { ticketTypeByIdOptions } from "@/features/ticket-types/use-ticket-types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/ticket-types/$ticketTypeId")({
    params: {
        parse: (params) => ({
            ticketTypeId: z.number().int().parse(Number(params.ticketTypeId)),
        }),
        stringify: ({ ticketTypeId }) => ({ ticketTypeId: `${ticketTypeId}` }),
    },
    loader: ({ context: { queryClient }, params: { ticketTypeId } }) =>
        queryClient.ensureQueryData(ticketTypeByIdOptions(ticketTypeId)),
    staticData: {
        title: "Edit Ticket Type",
        breadcrumb: "Edit Ticket Type",
    },
    component: EditTicketTypePage,
});

function EditTicketTypePage() {
    const { ticketTypeId } = Route.useParams();
    const { data } = useSuspenseQuery(ticketTypeByIdOptions(ticketTypeId));

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateTicketTypeForm initialData={data} />
        </div>
    );
}
