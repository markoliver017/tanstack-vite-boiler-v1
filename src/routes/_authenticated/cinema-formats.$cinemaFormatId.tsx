import { createFileRoute } from "@tanstack/react-router";
import { NavHeader } from "@/components/layouts/NavHeader";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import { CreateCinemaFormatForm } from "@/features/cinema-formats/CreateCinemaFormatForm";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { cinemaFormatByIdOptions } from "@/features/cinema-formats/use-cinema-formats";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute(
    "/_authenticated/cinema-formats/$cinemaFormatId",
)({
    loader: ({ context: { queryClient }, params: { cinemaFormatId } }) => {
        return queryClient.ensureQueryData(
            cinemaFormatByIdOptions(Number(cinemaFormatId)),
        );
    },
    staticData: {
        title: "Edit Cinema Format",
        breadcrumb: "Edit Format",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: LoadingComponent,
    component: EditCinemaFormatPage,
});

function EditCinemaFormatPage() {
    const { cinemaFormatId } = Route.useParams();
    const { data: cinemaFormat } = useSuspenseQuery(
        cinemaFormatByIdOptions(Number(cinemaFormatId)),
    );

    return (
        <div className="space-y-6">
            <NavHeader
                title={`Edit ${cinemaFormat.label}`}
                description="Update cinema format details"
            />
            <Card>
                <CardHeader>
                    <CardTitle>Format Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <CreateCinemaFormatForm initialData={cinemaFormat} />
                </CardContent>
            </Card>
        </div>
    );
}
