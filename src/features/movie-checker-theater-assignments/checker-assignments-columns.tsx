import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { CheckerAssignmentActions } from "@/features/movie-checker-theater-assignments/CheckerAssignmentActions";
import type { CheckerAssignmentResponse } from "@/features/movie-checker-theater-assignments/zCheckerAssignmentSchema";
import type { ColumnDef } from "@tanstack/react-table";

export const checkerAssignmentsColumns: ColumnDef<CheckerAssignmentResponse>[] = [
    {
        accessorKey: "slotNo",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Slot" />
        ),
        cell: ({ row }) => `#${row.original.slotNo}`,
    },
    {
        id: "movie",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Movie" />
        ),
        cell: ({ row }) => row.original.movie?.title || "-",
    },
    {
        id: "theater",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Theater" />
        ),
        cell: ({ row }) => row.original.theater?.name || "-",
    },
    {
        id: "cinema",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cinema" />
        ),
        cell: ({ row }) => row.original.cinema?.name || "Unset",
    },
    {
        id: "cinemaFormat",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Format" />
        ),
        cell: ({ row }) => row.original.cinemaFormat?.label || "Unset",
    },
    {
        accessorKey: "remarks",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Remarks" />
        ),
        cell: ({ row }) => row.original.remarks || "-",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <CheckerAssignmentActions item={row.original} />,
    },
];
