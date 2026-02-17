import { createFileRoute } from "@tanstack/react-router";
import { NavHeader } from "@/components/layouts/NavHeader";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { CreateProductionCompanyForm } from "@/features/production-companies/CreateProductionCompanyForm";

export const Route = createFileRoute(
    "/_authenticated/production-companies/create",
)({
    staticData: {
        title: "Create Production Company",
        breadcrumb: "Create",
    },
    component: CreateProductionCompanyPage,
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
});

function CreateProductionCompanyPage() {
    return (
        <div>
            <NavHeader
                title="Create Production Company"
                description="Add a new movie production company"
            />
            <div className="p-6">
                <CreateProductionCompanyForm />
            </div>
        </div>
    );
}
