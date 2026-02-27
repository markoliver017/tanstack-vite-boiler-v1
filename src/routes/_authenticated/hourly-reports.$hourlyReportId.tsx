import BackButton from "@/components/shared/BackButton";
import { CreateHourlyReportForm } from "@/features/hourly-reports/CreateHourlyReportForm";
import { hourlyReportByIdOptions } from "@/features/hourly-reports/use-hourly-reports";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
    "/_authenticated/hourly-reports/$hourlyReportId",
)({
    validateSearch: (search) =>
        z
            .object({
                mode: z.enum(["view", "edit"]).optional(),
            })
            .parse(search),
    params: {
        parse: (params) => ({
            hourlyReportId: z
                .number()
                .int()
                .parse(Number(params.hourlyReportId)),
        }),
        stringify: ({ hourlyReportId }) => ({
            hourlyReportId: `${hourlyReportId}`,
        }),
    },
    loader: ({ context: { queryClient }, params: { hourlyReportId } }) =>
        queryClient.ensureQueryData(hourlyReportByIdOptions(hourlyReportId)),
    staticData: {
        title: "Hourly Report Details",
        breadcrumb: "Hourly Report Details",
    },
    component: HourlyReportDetailsPage,
});

function HourlyReportDetailsPage() {
    const { hourlyReportId } = Route.useParams();
    const { mode } = Route.useSearch();
    const { data } = useSuspenseQuery(hourlyReportByIdOptions(hourlyReportId));

    if (mode === "edit") {
        return (
            <div className="max-w-5xl mx-auto py-6 space-y-4">
                <BackButton />
                <h2 className="text-xl font-semibold">Edit Hourly Report #{data.id}</h2>
                <CreateHourlyReportForm initialData={data} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-6 space-y-4">
            <BackButton />
            <h2 className="text-xl font-semibold">Hourly Report #{data.id}</h2>
            <p>
                Cinema: {data.cinema?.name || data.cinemaId} | Movie: {data.movie?.title || data.movieId}
            </p>
            <p>
                Date: {data.reportDate} | Time: {data.reportTime} | Status: {data.status}
            </p>

            <div className="border rounded-md p-4 space-y-2">
                <h3 className="font-medium">Ticket Entries</h3>
                {(data.ticketEntries || []).map((entry) => (
                    <div key={entry.id} className="text-sm border-t pt-2">
                        <p>
                            {entry.ticketType?.name || `#${entry.ticketTypeId}`} x {entry.quantity} |
                            Effective: {entry.effectivePrice} | Gross: {entry.grossAmount} |
                            Tax: {entry.taxAmount} | Net: {entry.netAmount}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
