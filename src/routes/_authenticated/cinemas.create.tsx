import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { NavHeader } from "@/components/layouts/NavHeader";
import { CreateCinemaForm } from "@/features/cinemas/CreateCinemaForm";
import BackButton from "@/components/shared/BackButton";

const createCinemaSearchSchema = z.object({
    theaterId: z.number().optional(),
});

export const Route = createFileRoute("/_authenticated/cinemas/create")({
    validateSearch: (search) => createCinemaSearchSchema.parse(search),
    staticData: {
        title: "Create Cinema",
        breadcrumb: "Create New Cinema",
    },
    component: CreateCinemaPage,
});

function CreateCinemaPage() {
    const search = Route.useSearch();

    return (
        <div className="p-6 space-y-6">
            <BackButton />
            <NavHeader
                title="Create New Cinema"
                description="Add a new cinema location to the system"
            />
            <div className="max-w-2xl">
                <CreateCinemaForm
                    defaultTheaterId={search.theaterId}
                    lockTheater={Boolean(search.theaterId)}
                />
            </div>
        </div>
    );
}
