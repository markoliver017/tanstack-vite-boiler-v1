import BackButton from "@/components/shared/BackButton";
import { CreateTheaterMovieTicketPriceForm } from "@/features/theater-movie-ticket-prices/CreateTheaterMovieTicketPriceForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/theater-movie-ticket-prices/create",
)({
    staticData: {
        title: "Create Theater Ticket Price",
        breadcrumb: "Create Price",
    },
    component: CreateTheaterMovieTicketPricePage,
});

function CreateTheaterMovieTicketPricePage() {
    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateTheaterMovieTicketPriceForm />
        </div>
    );
}
