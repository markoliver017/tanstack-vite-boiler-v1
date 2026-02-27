import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CulturalTaxActions } from "./CulturalTaxActions";
import type { CulturalTaxResponse } from "./zCulturalTaxSchema";

export const culturalTaxesColumns: ColumnDef<CulturalTaxResponse>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        id: "location",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Location" />
        ),
        cell: ({ row }) =>
            row.original.city || row.original.province
                ? `${row.original.city || ""}${
                      row.original.city && row.original.province ? ", " : ""
                  }${row.original.province || ""}`
                : "-",
    },
    {
        accessorKey: "amountType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount Type" />
        ),
    },
    {
        accessorKey: "deductionValue",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Deduction" />
        ),
    },
    {
        accessorKey: "effectivityDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Effectivity" />
        ),
        cell: ({ row }) =>
            format(new Date(row.original.effectivityDate), "MMM dd, yyyy"),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <CulturalTaxActions item={row.original} />,
    },
];
