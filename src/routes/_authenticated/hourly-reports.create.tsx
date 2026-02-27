import BackButton from "@/components/shared/BackButton";
import { CreateHourlyReportForm } from "@/features/hourly-reports/CreateHourlyReportForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/hourly-reports/create")({
    staticData: {
        title: "Create Hourly Report",
        breadcrumb: "Create Hourly Report",
    },
    component: CreateHourlyReportPage,
});

function CreateHourlyReportPage() {
    return (
        <div className="max-w-5xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateHourlyReportForm />
        </div>
    );
}
