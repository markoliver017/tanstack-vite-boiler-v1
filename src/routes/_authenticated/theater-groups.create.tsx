import { createFileRoute } from "@tanstack/react-router";
import { CreateTheaterGroupForm } from "@/features/theater-groups/CreateTheaterGroupForm";
import { NavHeader } from "@/components/layouts/NavHeader";
import BackButton from "@/components/shared/BackButton";

export const Route = createFileRoute("/_authenticated/theater-groups/create")({
    component: CreateTheaterGroupPage,
});

function CreateTheaterGroupPage() {
    return (
        <div className="flex flex-col gap-6">
            <NavHeader
                title="Create Theater Group"
                description="Add a new theater group/chain"
            />

            <div className="container mx-auto p-4 md:p-6 lg:p-8 pt-0">
                <BackButton />
                <div className="mt-6 max-w-2xl">
                    <CreateTheaterGroupForm />
                </div>
            </div>
        </div>
    );
}
