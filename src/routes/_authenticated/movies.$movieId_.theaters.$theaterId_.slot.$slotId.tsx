import { NavHeader } from "@/components/layouts/NavHeader";
import { Button } from "@/components/shadcn-ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/shadcn-ui/tabs";
import { EditCheckerAssignmentForm } from "@/features/movie-checker-theater-assignments/EditCheckerAssignmentForm";
import { checkerAssignmentByIdOptions } from "@/features/movie-checker-theater-assignments/use-checker-assignments";
import { useDeleteMovieScreeningTime } from "@/features/movie-screening-times/mutations";
import { movieScreeningTimesOptions } from "@/features/movie-screening-times/use-movie-screening-times";
import { CreateMovieScreeningTimeForm } from "@/features/movie-screening-times/CreateMovieScreeningTimeForm";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";

export const Route = createFileRoute(
    "/_authenticated/movies/$movieId_/theaters/$theaterId_/slot/$slotId",
)({
    params: {
        parse: (params) => ({
            movieId: z.number().int().parse(Number(params.movieId)),
            theaterId: z.number().int().parse(Number(params.theaterId)),
            slotId: z.number().int().parse(Number(params.slotId)),
        }),
        stringify: ({ movieId, theaterId, slotId }) => ({
            movieId: `${movieId}`,
            theaterId: `${theaterId}`,
            slotId: `${slotId}`,
        }),
    },
    loader: ({ context: { queryClient }, params: { slotId } }) =>
        queryClient.ensureQueryData(checkerAssignmentByIdOptions(slotId)),
    staticData: {
        title: "Slot Details",
        breadcrumb: "Slot",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: SlotDetailPage,
});

function SlotDetailPage() {
    const { movieId, theaterId, slotId } = Route.useParams();
    const { data: slot } = useQuery(checkerAssignmentByIdOptions(slotId));

    const { data: screeningTimes } = useQuery(
        movieScreeningTimesOptions(slotId),
    );
    const deleteScreening = useDeleteMovieScreeningTime();

    const canAddScreening = Boolean(slot?.cinemaId && slot?.cinemaFormatId);

    return (
        <div className="space-y-6">
            <NavHeader
                title={`Slot #${slot?.slotNo ?? slotId}`}
                description="Finalize cinema + format, then manage ticket prices and screening schedules"
            />

            <Tabs defaultValue="assignment" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="assignment">
                        Assignment Details
                    </TabsTrigger>
                    <TabsTrigger value="screenings">
                        Screening Times
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="assignment" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Slot Assignment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {slot ? (
                                <EditCheckerAssignmentForm
                                    assignment={slot}
                                    compact={true}
                                />
                            ) : null}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="screenings" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Movie Screening Times</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CreateMovieScreeningTimeForm
                                assignmentId={Number(slotId)}
                                disabled={!canAddScreening}
                            />

                            {!canAddScreening && (
                                <p className="text-sm text-amber-700">
                                    Set both cinema and cinema format in the
                                    slot assignment first.
                                </p>
                            )}

                            <div className="space-y-2">
                                {(screeningTimes?.data || []).map((item) => (
                                    <div
                                        key={item.id}
                                        className="border rounded-md p-3 flex items-center justify-between"
                                    >
                                        <div className="text-sm">
                                            <p>
                                                <span className="font-medium">
                                                    Time:
                                                </span>{" "}
                                                {item.time}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Range:
                                                </span>{" "}
                                                {item.dateStart} -{" "}
                                                {item.dateEnd || "Open"}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" asChild>
                                                <Link
                                                    to="/movies/$movieId/theaters/$theaterId/slot/$slotId/screening/$screeningId/tickets"
                                                    params={{
                                                        movieId,
                                                        theaterId,
                                                        slotId,
                                                        screeningId: Number(
                                                            item.id,
                                                        ),
                                                    }}
                                                    search={{
                                                        page: 1,
                                                        pageSize: 10,
                                                    }}
                                                >
                                                    Tickets
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() =>
                                                    deleteScreening.mutate({
                                                        id: item.id,
                                                        assignmentId:
                                                            Number(slotId),
                                                    })
                                                }
                                                disabled={
                                                    deleteScreening.isPending
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {!screeningTimes?.data?.length && (
                                    <p className="text-sm text-muted-foreground">
                                        No screening times yet.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Button variant="outline" asChild>
                <Link
                    to="/movies/$movieId/theaters/$theaterId"
                    params={{
                        movieId,
                        theaterId,
                    }}
                >
                    Back to Theater Slots
                </Link>
            </Button>
        </div>
    );
}
