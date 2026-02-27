import BackButton from "@/components/shared/BackButton";
import { CreateCinemaTicketsTemplateForm } from "@/features/cinema-tickets-template/CreateCinemaTicketsTemplateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/cinema-tickets-template/create",
)({
    staticData: {
        title: "Create Cinema Ticket Template",
        breadcrumb: "Create Mapping",
    },
    component: CreateCinemaTicketsTemplatePage,
});

function CreateCinemaTicketsTemplatePage() {
    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateCinemaTicketsTemplateForm />
        </div>
    );
}
