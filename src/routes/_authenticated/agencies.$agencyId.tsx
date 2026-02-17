import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { agencyByIdOptions } from "@/features/agencies/use-agencies";
import { EditAgencyForm } from "@/features/agencies/EditAgencyForm";
import { NavHeader } from "@/components/layouts/NavHeader";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/agencies/$agencyId")({
    params: {
        parse: (params) => ({
            agencyId: z.number().int().parse(Number(params.agencyId)),
        }),
        stringify: ({ agencyId }) => ({ agencyId: `${agencyId}` }),
    },
    loader: ({ context: { queryClient }, params: { agencyId } }) =>
        queryClient.ensureQueryData(agencyByIdOptions(agencyId)),
    component: EditAgencyPage,
    errorComponent: PageErrorComponent,
    pendingComponent: LoadingComponent,
    staticData: {
        breadcrumb: "Edit Agency",
    },
});

function EditAgencyPage() {
    const { agencyId } = Route.useParams();
    const { data: agency } = useSuspenseQuery(agencyByIdOptions(agencyId));

    return (
        <div className="flex flex-col gap-6">
            <NavHeader
                title={`Edit Agency: ${agency.name}`}
                description="Update agency information"
            />

            <Card className="max-w-2xl">
                <CardContent className="pt-6">
                    <EditAgencyForm agency={agency} />
                </CardContent>
            </Card>
        </div>
    );
}
