import BackButton from "@/components/shared/BackButton";
import { CreateTheaterMovieTicketPriceForm } from "@/features/theater-movie-ticket-prices/CreateTheaterMovieTicketPriceForm";
import { theaterMovieTicketPriceByIdOptions } from "@/features/theater-movie-ticket-prices/use-theater-movie-ticket-prices";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
    "/_authenticated/theater-movie-ticket-prices/$priceId",
)({
    params: {
        parse: (params) => ({
            priceId: z.number().int().parse(Number(params.priceId)),
        }),
        stringify: ({ priceId }) => ({ priceId: `${priceId}` }),
    },
    loader: ({ context: { queryClient }, params: { priceId } }) =>
        queryClient.ensureQueryData(theaterMovieTicketPriceByIdOptions(priceId)),
    staticData: {
        title: "Edit Theater Ticket Price",
        breadcrumb: "Edit Price",
    },
    component: EditTheaterMovieTicketPricePage,
});

function EditTheaterMovieTicketPricePage() {
    const { priceId } = Route.useParams();
    const { data } = useSuspenseQuery(theaterMovieTicketPriceByIdOptions(priceId));

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateTheaterMovieTicketPriceForm initialData={data} />
        </div>
    );
}
