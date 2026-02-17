import { createFileRoute } from "@tanstack/react-router";
import { CreateAgencyForm } from "@/features/agencies/CreateAgencyForm";
import { NavHeader } from "@/components/layouts/NavHeader";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";

export const Route = createFileRoute("/_authenticated/agencies/create")({
    component: CreateAgencyPage,
    errorComponent: PageErrorComponent,
    pendingComponent: LoadingComponent,
    staticData: {
        breadcrumb: "Create Agency",
    },
});

function CreateAgencyPage() {
    return (
        <div className="flex flex-col gap-6">
            <NavHeader
                title="Create Agency"
                description="Add a new agency to the system"
            />

            <Card className="max-w-2xl">
                <CardContent className="pt-6">
                    <CreateAgencyForm />
                </CardContent>
            </Card>
        </div>
    );
}
