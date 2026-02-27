import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { AuthorizationActions } from "@/features/checker-production-companies/AuthorizationActions";
import type { AuthorizationResponse } from "@/features/checker-production-companies/zAuthorizationSchema";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const authorizationsColumns: ColumnDef<AuthorizationResponse>[] = [
    {
        id: "company",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Production Company" />
        ),
        cell: ({ row }) => row.original.productionCompany?.name || "-",
    },
    {
        accessorKey: "authorizedFrom",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Authorized From" />
        ),
        cell: ({ row }) =>
            format(new Date(row.original.authorizedFrom), "MMM dd, yyyy"),
    },
    {
        accessorKey: "authorizedUntil",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Authorized Until" />
        ),
        cell: ({ row }) =>
            row.original.authorizedUntil
                ? format(new Date(row.original.authorizedUntil), "MMM dd, yyyy")
                : "Open",
    },
    {
        accessorKey: "notes",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Notes" />
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <AuthorizationActions item={row.original} />,
    },
];
