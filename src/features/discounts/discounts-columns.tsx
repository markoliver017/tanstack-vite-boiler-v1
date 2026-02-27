import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DiscountActions } from "./DiscountActions";
import type { DiscountResponse } from "./zDiscountSchema";

export const discountsColumns: ColumnDef<DiscountResponse>[] = [
    {
        accessorKey: "discountPct",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Discount %" />
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
        cell: ({ row }) => <DiscountActions item={row.original} />,
    },
];
