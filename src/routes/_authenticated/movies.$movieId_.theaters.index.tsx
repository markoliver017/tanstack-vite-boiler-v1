import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn-ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { Plus, Trash2 } from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/shadcn-ui/tabs";
import {
    useCreateCheckerAssignment,
    useDeleteCheckerAssignment,
} from "@/features/movie-checker-theater-assignments/mutations";
import {
    movieAssignmentsOptions,
    movieTheatersOptions,
} from "@/features/movie-checker-theater-assignments/use-checker-assignments";
import type { CheckerAssignmentResponse } from "@/features/movie-checker-theater-assignments/zCheckerAssignmentSchema";
import { movieByIdOptions } from "@/features/movies/use-movies";
import { fetchList } from "@/lib/api.client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { z } from "zod";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";

type MovieTheaterRow = {
    theaterId: number;
    theaterName: string;
    totalSlots: number;
    filledSlots: number;
};

export const Route = createFileRoute(
    "/_authenticated/movies/$movieId_/theaters/",
)({
    params: {
        parse: (params) => ({
            movieId: z.number().int().parse(Number(params.movieId)),
        }),
        stringify: ({ movieId }) => ({ movieId: `${movieId}` }),
    },
    loader: ({ context: { queryClient }, params: { movieId } }) =>
        queryClient.ensureQueryData(movieByIdOptions(movieId)),
    staticData: {
        title: "Movie Theater Lineup",
        breadcrumb: "Theaters",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: MovieTheatersPlanningPage,
});

function MovieTheatersPlanningPage() {
    const { movieId } = Route.useParams();
    const { data: movie } = useQuery(movieByIdOptions(movieId));
    const navigate = useNavigate();
    const createSlot = useCreateCheckerAssignment();
    const deleteSlot = useDeleteCheckerAssignment();
    const [theaterId, setTheaterId] = useState<number | undefined>();
    const [checkerId, setCheckerId] = useState<number | undefined>();
    const [searchQuery, setSearchQuery] = useState("");
    const [checkerSearch, setCheckerSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: theaterSummary, isFetching } = useQuery({
        ...movieTheatersOptions(movieId),
        placeholderData: keepPreviousData,
    });

    const { data: assignments, isFetching: isFetchingAssignments } = useQuery({
        ...movieAssignmentsOptions(movieId),
        placeholderData: keepPreviousData,
    });

    const { data: theaters } = useQuery({
        queryKey: ["theaters", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>(
                "/theaters?_page=1&_limit=500",
            ),
    });

    const { data: checkers } = useQuery({
        queryKey: ["checkers", "lookup", movie?.agencyId],
        queryFn: () =>
            fetchList<{ id: number; fullName: string; agencyId: number }[]>(
                `/checkers?_page=1&_limit=500${
                    movie?.agencyId ? `&agency_id=${movie.agencyId}` : ""
                }`,
            ),
        enabled: Boolean(movie),
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: "theaterName",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                header: ({ column }: any) => (
                    <DataTableColumnHeader column={column} title="Theater" />
                ),
            },
            {
                accessorKey: "totalSlots",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                header: ({ column }: any) => (
                    <DataTableColumnHeader column={column} title="Slots" />
                ),
            },
            {
                accessorKey: "filledSlots",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                header: ({ column }: any) => (
                    <DataTableColumnHeader column={column} title="Filled" />
                ),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }: { row: { original: MovieTheaterRow } }) => (
                    <Button
                        variant="outline"
                        onClick={() =>
                            navigate({
                                to: "/movies/$movieId/theaters/$theaterId",
                                params: {
                                    movieId,
                                    theaterId: row.original.theaterId,
                                },
                            })
                        }
                    >
                        Open
                    </Button>
                ),
            },
        ],
        [movieId, navigate],
    );

    const checkerColumns = useMemo(
        () => [
            {
                id: "checkerName",
                accessorFn: (row: CheckerAssignmentResponse) =>
                    row.checker?.fullName || "Unknown",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                header: ({ column }: any) => (
                    <DataTableColumnHeader column={column} title="Checker" />
                ),
            },
            {
                id: "theaterName",
                accessorFn: (row: CheckerAssignmentResponse) =>
                    row.theater?.name || "Unknown",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                header: ({ column }: any) => (
                    <DataTableColumnHeader column={column} title="Theater" />
                ),
            },
            {
                id: "cinemaName",
                accessorFn: (row: CheckerAssignmentResponse) =>
                    row.cinema?.name || "Unset",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                header: ({ column }: any) => (
                    <DataTableColumnHeader column={column} title="Cinema" />
                ),
            },
            {
                id: "cinemaFormat",
                accessorFn: (row: CheckerAssignmentResponse) =>
                    row.cinemaFormat?.label || "Unset",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                header: ({ column }: any) => (
                    <DataTableColumnHeader column={column} title="Format" />
                ),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({
                    row,
                }: {
                    row: { original: CheckerAssignmentResponse };
                }) => (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                navigate({
                                    to: "/movies/$movieId/theaters/$theaterId/slot/$slotId",
                                    params: {
                                        movieId,
                                        theaterId: row.original.theaterId,
                                        slotId: row.original.id,
                                    },
                                })
                            }
                        >
                            Open Slot
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                Swal.fire({
                                    title: "Delete Assignment?",
                                    text: "Are you sure you want to remove this checker from this slot?",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#d33",
                                    cancelButtonColor: "#3085d6",
                                    confirmButtonText: "Delete",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        deleteSlot.mutate(row.original.id);
                                    }
                                });
                            }}
                            disabled={deleteSlot.isPending}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ),
            },
        ],
        [movieId, navigate, deleteSlot],
    );

    const handleCreateSlot = async () => {
        if (!theaterId || !checkerId) {
            await Swal.fire({
                icon: "warning",
                title: "Missing required fields",
                text: "Select theater and checker first.",
            });
            return;
        }

        await createSlot.mutateAsync({
            checkerId,
            movieId,
            theaterId,
        });

        setIsDialogOpen(false);
        setTheaterId(undefined);
        setCheckerId(undefined);
        Swal.fire({
            icon: "success",
            title: "Slot created successfully",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
        });
    };

    const filteredData = useMemo(() => {
        if (!theaterSummary?.data) return [];
        if (!searchQuery) return theaterSummary.data;
        const q = searchQuery.toLowerCase();
        return theaterSummary.data.filter((item) =>
            item.theaterName.toLowerCase().includes(q),
        );
    }, [theaterSummary, searchQuery]);

    const filteredCheckerData = useMemo(() => {
        if (!assignments?.data) return [];
        if (!checkerSearch) return assignments.data;
        const q = checkerSearch.toLowerCase();
        return assignments.data.filter(
            (item) =>
                item.checker?.fullName.toLowerCase().includes(q) ||
                item.theater?.name.toLowerCase().includes(q) ||
                item.cinema?.name?.toLowerCase().includes(q),
        );
    }, [assignments, checkerSearch]);

    const creationSideComponent = (
        <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="success">
                        <Plus className="mr-2 h-4 w-4" /> Add Theater Slot
                    </Button>
                </DialogTrigger>
                <DialogContent id="add-theater-dialog">
                    <DialogHeader>
                        <DialogTitle>Add Theater Slot</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Select Theater
                            </label>
                            <Select
                                value={
                                    theaterId ? String(theaterId) : undefined
                                }
                                onValueChange={(value) =>
                                    setTheaterId(Number(value))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select theater" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(theaters?.data || []).map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={String(item.id)}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Select Checker
                            </label>
                            <Select
                                value={
                                    checkerId ? String(checkerId) : undefined
                                }
                                onValueChange={(value) =>
                                    setCheckerId(Number(value))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select checker" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(checkers?.data || []).map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={String(item.id)}
                                        >
                                            {item.fullName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            variant="success"
                            onClick={handleCreateSlot}
                            disabled={createSlot.isPending}
                            className="w-full"
                        >
                            {createSlot.isPending
                                ? "Creating..."
                                : "Create Slot"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );

    return (
        <div className="space-y-6">
            <NavHeader
                title={`${movie?.title || "Movie"} Theater Lineup`}
                description="Plan participating theaters and projected checker deployment"
            />

            <Tabs defaultValue="checker" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="checker">All</TabsTrigger>
                    <TabsTrigger value="theater">By Theater</TabsTrigger>
                </TabsList>

                <TabsContent value="theater" className="space-y-4 pt-2">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchPlaceholder="Search theaters..."
                        isLoading={isFetching}
                        sideComponent={creationSideComponent}
                    />
                </TabsContent>

                <TabsContent value="checker" className="space-y-4 pt-2">
                    <DataTable
                        columns={checkerColumns}
                        data={filteredCheckerData}
                        searchValue={checkerSearch}
                        onSearchChange={setCheckerSearch}
                        searchPlaceholder="Search checkers or theaters..."
                        isLoading={isFetchingAssignments}
                        sideComponent={creationSideComponent}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
