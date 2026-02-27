import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { TaxRuleOverrideActions } from "@/features/theater-production-tax-rules/TaxRuleOverrideActions";
import type { TaxRuleOverrideResponse } from "@/features/theater-production-tax-rules/zTaxRuleOverrideSchema";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const taxRuleOverridesColumns: ColumnDef<TaxRuleOverrideResponse>[] = [
    {
        id: "theater",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Theater" />
        ),
        cell: ({ row }) => row.original.theater?.name || "-",
    },
    {
        id: "company",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Production Company" />
        ),
        cell: ({ row }) => row.original.productionCompany?.name || "-",
    },
    {
        id: "taxRule",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tax Rule" />
        ),
        cell: ({ row }) => row.original.taxRule?.name || "-",
    },
    {
        accessorKey: "effectiveDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Effective" />
        ),
        cell: ({ row }) =>
            format(new Date(row.original.effectiveDate), "MMM dd, yyyy"),
    },
    {
        accessorKey: "expiryDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Expiry" />
        ),
        cell: ({ row }) =>
            row.original.expiryDate
                ? format(new Date(row.original.expiryDate), "MMM dd, yyyy")
                : "Open",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <TaxRuleOverrideActions item={row.original} />,
    },
];
