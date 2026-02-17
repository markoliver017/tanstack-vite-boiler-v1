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

export const Route = createFileRoute("/_authenticated/cinema-formats/create")({
    staticData: {
        title: "Create Cinema Format",
        breadcrumb: "Create Format",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: LoadingComponent,
    component: CreateCinemaFormatPage,
});

function CreateCinemaFormatPage() {
    return (
        <div className="space-y-6">
            <NavHeader
                title="Create Cinema Format"
                description="Add a new cinema format to the system"
            />
            <Card>
                <CardHeader>
                    <CardTitle>Format Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <CreateCinemaFormatForm />
                </CardContent>
            </Card>
        </div>
    );
}
