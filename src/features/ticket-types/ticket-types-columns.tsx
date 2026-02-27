import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/shadcn-ui/badge";
import { TicketTypeActions } from "./TicketTypeActions";
import type { TicketTypeResponse } from "./zTicketTypeSchema";

export const ticketTypesColumns: ColumnDef<TicketTypeResponse>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        id: "theater",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Scope" />
        ),
        cell: ({ row }) => row.original.theater?.name || "Global",
    },
    {
        id: "discount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Discount" />
        ),
        cell: ({ row }) => row.original.discountId || "-",
    },

    {
        accessorKey: "isTaxable",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Taxable" />
        ),
        cell: ({ row }) => (
            <Badge variant={row.original.isTaxable ? "default" : "secondary"}>
                {row.original.isTaxable ? "Yes" : "No"}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <TicketTypeActions item={row.original} />,
    },
];
