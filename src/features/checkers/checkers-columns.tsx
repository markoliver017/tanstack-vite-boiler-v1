import { Badge } from "@/components/shadcn-ui/badge";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CheckerActions } from "./CheckerActions";
import type { CheckerResponse } from "./zCheckerSchema";

export const checkersColumns: ColumnDef<CheckerResponse>[] = [
    {
        accessorKey: "fullName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Checker" />
        ),
    },
    {
        id: "agency",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Agency" />
        ),
        cell: ({ row }) => row.original.agency?.name || "-",
    },
    {
        accessorKey: "contactNo",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contact" />
        ),
    },
    {
        accessorKey: "employmentDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Employment Date" />
        ),
        cell: ({ row }) =>
            format(new Date(row.original.employmentDate), "MMM dd, yyyy"),
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
            <Badge variant={row.original.isActive ? "default" : "secondary"}>
                {row.original.isActive ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <CheckerActions checker={row.original} />,
    },
];
