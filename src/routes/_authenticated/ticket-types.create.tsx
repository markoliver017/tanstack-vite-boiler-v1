import BackButton from "@/components/shared/BackButton";
import { CreateTicketTypeForm } from "@/features/ticket-types/CreateTicketTypeForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/ticket-types/create")({
    staticData: {
        title: "Create Ticket Type",
        breadcrumb: "Create Ticket Type",
    },
    component: CreateTicketTypePage,
});

function CreateTicketTypePage() {
    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateTicketTypeForm />
        </div>
    );
}
