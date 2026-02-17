import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import { Link } from "@tanstack/react-router";
import type { TheaterResponse } from "./zTheatersSchema";
import { Edit, Power } from "lucide-react";

export const theatersColumns = (
    onDelete: (id: string, currentStatus: boolean) => void,
): ColumnDef<TheaterResponse>[] => [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "theaterGroup.name",
        id: "theaterGroup",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Theater Group" />
        ),
    },
    {
        accessorKey: "city",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="City" />
        ),
    },
    {
        accessorKey: "taxRule.name",
        id: "taxRule",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tax Rule" />
        ),
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.isActive ? "default" : "secondary"}>
                {row.original.isActive ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button variant="outline" size="icon-sm" asChild>
                    <Link
                        to="/theaters/$theaterId"
                        params={{ theaterId: String(row.original.id) }}
                    >
                        <Edit className="h-4 w-4" />
                    </Link>
                </Button>
                <Button
                    variant={row.original.isActive ? "destructive" : "success"}
                    size="icon-sm"
                    onClick={() =>
                        onDelete(String(row.original.id), row.original.isActive)
                    }
                    title={row.original.isActive ? "Deactivate" : "Activate"}
                >
                    <Power className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];
