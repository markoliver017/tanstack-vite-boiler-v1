import { createFileRoute } from "@tanstack/react-router";
import { apiRequest } from "@/lib/api.client";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { NavHeader } from "@/components/layouts/NavHeader";
import TheaterForm from "@/features/theaters/CreateTheaterForm";
import BackButton from "@/components/shared/BackButton";
import type { TheaterResponse } from "@/features/theaters/zTheatersSchema";

export const Route = createFileRoute("/_authenticated/theaters/$theaterId")({
    loader: async ({ params }) => {
        const item = await apiRequest<TheaterResponse>(
            `/theaters/${params.theaterId}`,
        );
        return {
            item,
            breadcrumb: item.name,
        };
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: TheaterDetailPage,
});

function TheaterDetailPage() {
    const { item } = Route.useLoaderData();

    return (
        <div className="space-y-6">
            <NavHeader
                title={`Edit ${item.name}`}
                description="Update theater details"
            />
            <div className="px-6">
                <BackButton />
                <div className="mt-4">
                    <TheaterForm initialData={item} />
                </div>
            </div>
        </div>
    );
}
