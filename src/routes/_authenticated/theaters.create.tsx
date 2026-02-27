import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { NavHeader } from "@/components/layouts/NavHeader";
import TheaterForm from "@/features/theaters/CreateTheaterForm";
import BackButton from "@/components/shared/BackButton";

const createTheaterSearchSchema = z.object({
    theaterGroupId: z.number().optional(),
});

export const Route = createFileRoute("/_authenticated/theaters/create")({
    validateSearch: (search) => createTheaterSearchSchema.parse(search),
    staticData: {
        title: "Create Theater",
        breadcrumb: "Create",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: CreateTheaterPage,
});

function CreateTheaterPage() {
    const search = Route.useSearch();

    return (
        <div className="space-y-6">
            <NavHeader
                title="Create Theater"
                description="Add a new theater location"
            />
            <div className="px-6">
                <BackButton />
                <div className="mt-4">
                    <TheaterForm
                        defaultTheaterGroupId={search.theaterGroupId}
                        lockTheaterGroup={Boolean(search.theaterGroupId)}
                    />
                </div>
            </div>
        </div>
    );
}
