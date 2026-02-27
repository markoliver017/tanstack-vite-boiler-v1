import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { AssignFormatToMovieForm } from "@/features/movie-format-map/AssignFormatToMovieForm";
import { movieFormatMapColumns } from "@/features/movie-format-map/movie-format-map-columns";
import { movieFormatsByMovieOptions } from "@/features/movie-format-map/use-movie-format-map";
import { movieByIdOptions } from "@/features/movies/use-movies";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/movies/$movieId_/formats")({
    loader: async ({ context: { queryClient }, params }) => {
        const movie = await queryClient.ensureQueryData(
            movieByIdOptions(params.movieId),
        );

        return {
            movie,
            breadcrumb: "Formats",
        };
    },
    staticData: {
        title: "Movie Formats",
        breadcrumb: "Movie Formats",
    },
    component: MovieFormatsPage,
});

function MovieFormatsPage() {
    const { movieId } = Route.useParams();
    const { movie } = Route.useLoaderData();

    const { data: mappings, isFetching } = useQuery({
        ...movieFormatsByMovieOptions(movieId),
        placeholderData: keepPreviousData,
    });

    return (
        <div className="space-y-6">
            <NavHeader
                title={`${movie.title} - Formats`}
                description="Assign and manage format coverage for this movie"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Assign Format</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AssignFormatToMovieForm movieId={Number(movieId)} />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Assigned Formats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={movieFormatMapColumns}
                            data={mappings?.data || []}
                            isLoading={isFetching}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
