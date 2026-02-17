import { createFileRoute } from "@tanstack/react-router";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { CinemaFormattedList } from "@/features/cinema-format-map/CinemaFormattedList";

export const Route = createFileRoute(
    "/_authenticated/cinemas/$cinemaId_/formats",
)({
    staticData: {
        title: "Cinema Formats",
        breadcrumb: "Formats",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: CinemaFormatsNestedPage,
});

function CinemaFormatsNestedPage() {
    const { cinemaId } = Route.useParams();
    const id = parseInt(cinemaId, 10);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Cinema Formats</h2>
            <CinemaFormattedList cinemaId={id} />
        </div>
    );
}
