import { Button } from "@/components/shadcn-ui/button";
import { EditMovieForm } from "@/features/movies/EditMovieForm";
import { movieByIdOptions } from "@/features/movies/use-movies";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { NavHeader } from "@/components/layouts/NavHeader";

export const Route = createFileRoute("/_authenticated/movies/$movieId")({
    params: {
        parse: (params) => ({
            movieId: z.number().int().parse(Number(params.movieId)),
        }),
        stringify: ({ movieId }) => ({ movieId: `${movieId}` }),
    },
    loader: ({ context: { queryClient }, params: { movieId } }) =>
        queryClient.ensureQueryData(movieByIdOptions(movieId)),
    staticData: {
        title: "Edit Movie",
        breadcrumb: "Edit Movie",
    },
    component: EditMoviePage,
});

function EditMoviePage() {
    const { movieId } = Route.useParams();
    const { data: movie } = useSuspenseQuery(movieByIdOptions(movieId));

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <NavHeader
                title={`Edit Movie: ${movie.title}`}
                description="Update movie information"
            />
            <div className="flex justify-end">
                <Button asChild variant="outline">
                    <Link to="/movies/$movieId/theaters" params={{ movieId }}>
                        Theater Lineup & Slots
                    </Link>
                </Button>
            </div>
            <EditMovieForm movie={movie} />
        </div>
    );
}
