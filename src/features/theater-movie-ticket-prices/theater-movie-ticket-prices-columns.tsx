import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { TheaterMovieTicketPriceActions } from "./TheaterMovieTicketPriceActions";
import type { TheaterMovieTicketPriceResponse } from "./zTheaterMovieTicketPriceSchema";

export const theaterMovieTicketPricesColumns: ColumnDef<TheaterMovieTicketPriceResponse>[] =
    [
        {
            id: "theater",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Theater" />
            ),
            cell: ({ row }) =>
                row.original.theater?.name || `#${row.original.theaterId}`,
        },
        {
            id: "movie",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Movie" />
            ),
            cell: ({ row }) =>
                row.original.movie?.title || `#${row.original.movieId}`,
        },
        {
            id: "format",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Format" />
            ),
            cell: ({ row }) => row.original.cinemaFormat?.label || "Any",
        },
        {
            accessorKey: "basePrice",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Base Price" />
            ),
        },
        {
            accessorKey: "validFrom",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Valid From" />
            ),
            cell: ({ row }) =>
                format(new Date(row.original.validFrom), "MMM dd, yyyy"),
        },
        {
            accessorKey: "validUntil",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Valid Until" />
            ),
            cell: ({ row }) =>
                row.original.validUntil
                    ? format(new Date(row.original.validUntil), "MMM dd, yyyy")
                    : "Open-ended",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <TheaterMovieTicketPriceActions item={row.original} />
            ),
        },
    ];
