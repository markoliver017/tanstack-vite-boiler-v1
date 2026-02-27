import { NavHeader } from "@/components/layouts/NavHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/shadcn-ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn-ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { MoreHorizontal, Pen, Plus, Trash } from "lucide-react";
import { CreateTheaterMovieTicketPriceForm } from "@/features/theater-movie-ticket-prices/CreateTheaterMovieTicketPriceForm";
import { theaterMovieTicketPricesListOptions } from "@/features/theater-movie-ticket-prices/use-theater-movie-ticket-prices";
import {
    useCreateCheckerAssignment,
    useDeleteCheckerAssignment,
} from "@/features/movie-checker-theater-assignments/mutations";
import { movieTheaterSlotsOptions } from "@/features/movie-checker-theater-assignments/use-checker-assignments";
import { movieByIdOptions } from "@/features/movies/use-movies";
import { fetchList } from "@/lib/api.client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { z } from "zod";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";

type SlotRow = {
    id: number;
    slotNo: number;
    checkerId: number;
    cinemaId: number | null;
    cinemaFormatId: number | null;
    remarks: string | null;
    checker?: { fullName?: string };
    cinema?: { name?: string };
    cinemaFormat?: { label?: string };
};

export const Route = createFileRoute(
    "/_authenticated/movies/$movieId_/theaters/$theaterId",
)({
    params: {
        parse: (params) => ({
            movieId: z.number().int().parse(Number(params.movieId)),
            theaterId: z.number().int().parse(Number(params.theaterId)),
        }),
        stringify: ({ movieId, theaterId }) => ({
            movieId: `${movieId}`,
            theaterId: `${theaterId}`,
        }),
    },
    loader: ({ context: { queryClient }, params: { movieId } }) =>
        queryClient.ensureQueryData(movieByIdOptions(movieId)),
    staticData: {
        title: "Theater Slots",
        breadcrumb: "Theater Slots",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: MovieTheaterSlotsPage,
});

function MovieTheaterSlotsPage() {
    const { movieId, theaterId } = Route.useParams();
    const navigate = useNavigate();
    const createSlot = useCreateCheckerAssignment();
    const deleteSlot = useDeleteCheckerAssignment();
    const [checkerId, setCheckerId] = useState<number | undefined>();
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: movie } = useQuery(movieByIdOptions(movieId));
    const { data: theaters } = useQuery({
        queryKey: ["theaters", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>(
                "/theaters?_page=1&_limit=500",
            ),
    });
    const theaterName =
        theaters?.data?.find((item) => item.id === theaterId)?.name ||
        `#${theaterId}`;

    const { data: slotsData, isFetching } = useQuery({
        ...movieTheaterSlotsOptions(movieId, theaterId),
        placeholderData: keepPreviousData,
    });

    const { data: ticketPrices } = useQuery(
        theaterMovieTicketPricesListOptions(1, 500, theaterId, movieId),
    );

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
                accessorKey: "slotNo",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                header: ({ column }: any) => (
                    <DataTableColumnHeader column={column} title="Slot" />
                ),
            },
            {
                id: "checker",
                accessorFn: (row: SlotRow) =>
                    row.checker?.fullName || `#${row.checkerId}`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                header: ({ column }: any) => (
                    <DataTableColumnHeader column={column} title="Checker" />
                ),
                cell: ({ row }: { row: { original: SlotRow } }) =>
                    row.original.checker?.fullName ||
                    `#${row.original.checkerId}`,
            },
            {
                id: "cinema",
                accessorFn: (row: SlotRow) => row.cinema?.name || "Unset",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                header: ({ column }: any) => (
                    <DataTableColumnHeader column={column} title="Cinema" />
                ),
                cell: ({ row }: { row: { original: SlotRow } }) =>
                    row.original.cinema?.name || "Unset",
            },
            {
                id: "format",
                accessorFn: (row: SlotRow) =>
                    row.cinemaFormat?.label || "Unset",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                header: ({ column }: any) => (
                    <DataTableColumnHeader column={column} title="Format" />
                ),
                cell: ({ row }: { row: { original: SlotRow } }) =>
                    row.original.cinemaFormat?.label || "Unset",
            },
            {
                accessorKey: "remarks",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                header: ({ column }: any) => (
                    <DataTableColumnHeader column={column} title="Remarks" />
                ),
                cell: ({ row }: { row: { original: SlotRow } }) =>
                    row.original.remarks || "-",
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }: { row: { original: SlotRow } }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() =>
                                    navigate({
                                        to: "/movies/$movieId/theaters/$theaterId/slot/$slotId",
                                        params: {
                                            movieId,
                                            theaterId,
                                            slotId: row.original.id,
                                        },
                                    })
                                }
                            >
                                <Pen className="mr-2 h-4 w-4" />
                                Edit Slot
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                    Swal.fire({
                                        title: "Are you sure?",
                                        text: "This will permanently delete the slot.",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonText: "Yes, delete it",
                                    }).then(async (result) => {
                                        if (result.isConfirmed) {
                                            await deleteSlot.mutateAsync(
                                                row.original.id,
                                            );
                                        }
                                    });
                                }}
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Slot
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [movieId, theaterId, navigate, deleteSlot],
    );

    const handleCreateSlot = async () => {
        if (!checkerId) {
            await Swal.fire({
                icon: "warning",
                title: "Checker is required",
            });
            return;
        }

        await createSlot.mutateAsync({
            checkerId,
            movieId,
            theaterId,
        });

        setIsDialogOpen(false);
        setCheckerId(undefined);
    };

    const filteredData = useMemo(() => {
        if (!slotsData?.data) return [];
        if (!searchQuery) return slotsData.data;
        const q = searchQuery.toLowerCase();
        return slotsData.data.filter(
            (item) =>
                item.checker?.fullName?.toLowerCase().includes(q) ||
                item.cinema?.name?.toLowerCase().includes(q) ||
                item.cinemaFormat?.label?.toLowerCase().includes(q),
        );
    }, [slotsData, searchQuery]);

    return (
        <div className="space-y-6">
            <NavHeader
                title={`${movie?.title || "Movie"} - ${theaterName}`}
                description="Manage slots, assigned checkers, and slot completion"
            />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Theater Movie Ticket Prices</CardTitle>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="success">
                                <Plus className="mr-2 h-4 w-4" /> Add Ticket
                                Price
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Create Ticket Price</DialogTitle>
                            </DialogHeader>
                            <CreateTheaterMovieTicketPriceForm
                                defaultMovieId={movieId}
                                defaultTheaterId={theaterId}
                                lockMovieAndTheater={true}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-3">
                    {(ticketPrices?.data || []).map((price) => (
                        <div
                            key={price.id}
                            className="border rounded-md p-3 flex items-center justify-between"
                        >
                            <div className="text-sm">
                                <p>
                                    <span className="font-medium">Format:</span>{" "}
                                    {price.cinemaFormat?.label || "Any"}
                                </p>
                                <p>
                                    <span className="font-medium">Base:</span>{" "}
                                    {price.basePrice}
                                </p>
                            </div>
                            <Button variant="outline" asChild>
                                <Link
                                    to="/theater-movie-ticket-prices/$priceId"
                                    params={{ priceId: price.id }}
                                >
                                    Edit
                                </Link>
                            </Button>
                        </div>
                    ))}
                    {!ticketPrices?.data?.length && (
                        <p className="text-sm text-muted-foreground">
                            No ticket prices yet for this movie/theater.
                        </p>
                    )}
                </CardContent>
            </Card>

            <DataTable
                columns={columns}
                data={filteredData}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search slots..."
                isLoading={isFetching}
                sideComponent={
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link
                                to="/movies/$movieId/theaters"
                                params={{ movieId }}
                            >
                                Back to Theaters
                            </Link>
                        </Button>
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button variant="success">
                                    <Plus className="mr-2 h-4 w-4" /> Add Slot
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Slot</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Select Checker
                                        </label>
                                        <Select
                                            value={
                                                checkerId
                                                    ? String(checkerId)
                                                    : undefined
                                            }
                                            onValueChange={(value) =>
                                                setCheckerId(Number(value))
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select checker" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(checkers?.data || []).map(
                                                    (item) => (
                                                        <SelectItem
                                                            key={item.id}
                                                            value={String(
                                                                item.id,
                                                            )}
                                                        >
                                                            {item.fullName}
                                                        </SelectItem>
                                                    ),
                                                )}
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
                                            : "Add Slot"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                }
            />
        </div>
    );
}
