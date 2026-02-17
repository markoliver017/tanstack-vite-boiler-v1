import { createFileRoute } from "@tanstack/react-router";
import { useTheaterGroup } from "@/features/theater-groups/use-theater-groups";
import { NavHeader } from "@/components/layouts/NavHeader";
import BackButton from "@/components/shared/BackButton";
import { Loader2 } from "lucide-react";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import { EditTheaterGroupForm } from "@/features/theater-groups/EditTheaterGroupForm";

export const Route = createFileRoute(
    "/_authenticated/theater-groups/$theaterGroupId",
)({
    component: EditTheaterGroupPage,
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
});

function EditTheaterGroupPage() {
    const { theaterGroupId } = Route.useParams();
    const {
        data: theaterGroup,
        isLoading,
        error,
    } = useTheaterGroup(Number(theaterGroupId));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !theaterGroup) {
        return (
            <div className="container mx-auto p-4">
                <PageErrorComponent
                    error={error || new Error("Theater group not found")}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <NavHeader
                title={`Edit ${theaterGroup.name}`}
                description="Update theater group details"
            />

            <div className="container mx-auto p-4 md:p-6 lg:p-8 pt-0">
                <BackButton />
                <div className="mt-6 max-w-2xl">
                    <EditTheaterGroupForm initialData={theaterGroup} />
                </div>
            </div>
        </div>
    );
}
