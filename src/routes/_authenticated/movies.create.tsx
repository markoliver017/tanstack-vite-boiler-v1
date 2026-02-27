import BackButton from "@/components/shared/BackButton";
import { CreateMovieForm } from "@/features/movies/CreateMovieForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/movies/create")({
    staticData: {
        title: "Create Movie",
        breadcrumb: "Create Movie",
    },
    component: CreateMoviePage,
});

function CreateMoviePage() {
    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            <BackButton />
            <CreateMovieForm />
        </div>
    );
}
