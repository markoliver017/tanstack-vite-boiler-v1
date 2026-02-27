import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { MovieFormatActions } from "@/features/movie-format-map/MovieFormatActions";
import type { MovieFormatMapResponse } from "@/features/movie-format-map/zMovieFormatMapSchema";
import type { ColumnDef } from "@tanstack/react-table";

export const movieFormatMapColumns: ColumnDef<MovieFormatMapResponse>[] = [
    {
        id: "format",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Format" />
        ),
        cell: ({ row }) => row.original.cinemaFormat?.label || "-",
    },
    {
        id: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code" />
        ),
        cell: ({ row }) => row.original.cinemaFormat?.code || "-",
    },
    {
        accessorKey: "priceAdjustment",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price Adj." />
        ),
        cell: ({ row }) => row.original.priceAdjustment || "0.00",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <MovieFormatActions item={row.original} />,
    },
];
