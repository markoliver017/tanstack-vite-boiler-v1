import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import type { Agency } from "./zAgencySchema";
import { AgencyActions } from "./AgencyActions";
import { format } from "date-fns";

export const agenciesColumns: ColumnDef<Agency>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Agency Name" />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "contactPerson",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contact Person" />
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "phone",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phone" />
        ),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as string;
            return format(new Date(date), "MMM dd, yyyy");
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <AgencyActions agency={row.original} />,
    },
];
