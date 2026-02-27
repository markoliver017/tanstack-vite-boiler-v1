import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MovieActions } from "./MovieActions";
import type { MovieResponse } from "./zMovieSchema";

export const moviesColumns: ColumnDef<MovieResponse>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
    },
    {
        id: "productionCompany",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Production Company" />
        ),
        cell: ({ row }) => row.original.productionCompany?.name || "-",
    },
    {
        id: "agency",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Agency" />
        ),
        cell: ({ row }) => row.original.agency?.name || "-",
    },
    {
        accessorKey: "startDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Start Date" />
        ),
        cell: ({ row }) => format(new Date(row.original.startDate), "MMM dd, yyyy"),
    },
    {
        accessorKey: "endDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="End Date" />
        ),
        cell: ({ row }) =>
            row.original.endDate
                ? format(new Date(row.original.endDate), "MMM dd, yyyy")
                : "Open",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <MovieActions movie={row.original} />,
    },
];
