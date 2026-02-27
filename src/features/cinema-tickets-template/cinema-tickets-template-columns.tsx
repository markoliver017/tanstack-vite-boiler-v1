import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import type { ColumnDef } from "@tanstack/react-table";
import { CinemaTicketsTemplateActions } from "./CinemaTicketsTemplateActions";
import type { CinemaTicketsTemplateResponse } from "./zCinemaTicketsTemplateSchema";

export const cinemaTicketsTemplateColumns: ColumnDef<CinemaTicketsTemplateResponse>[] = [
    {
        id: "cinema",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cinema" />
        ),
        cell: ({ row }) => row.original.cinema?.name || `#${row.original.cinemaId}`,
    },
    {
        id: "ticketType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ticket Type" />
        ),
        cell: ({ row }) =>
            row.original.ticketType?.name || `#${row.original.ticketTypeId}`,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <CinemaTicketsTemplateActions item={row.original} />,
    },
];
