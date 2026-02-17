import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import type { TheaterGroup } from "./zTheaterGroupSchema";
import { TheaterGroupActions } from "./TheaterGroupActions";
import { format } from "date-fns";
import { Badge } from "@/components/shadcn-ui/badge";

export const theaterGroupsColumns: ColumnDef<TheaterGroup>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Theater Group" />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "shortCode",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Short Code" />
        ),
        cell: ({ row }) => (
            <Badge variant="outline">{row.getValue("shortCode")}</Badge>
        ),
    },
    {
        accessorKey: "website",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Website" />
        ),
        cell: ({ row }) => {
            const website = row.getValue("website") as string | undefined;
            return website ? (
                <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    {website}
                </a>
            ) : (
                <span className="text-muted-foreground">—</span>
            );
        },
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const isActive = row.getValue("isActive") as boolean;
            return (
                <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            );
        },
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
        cell: ({ row }) => <TheaterGroupActions theaterGroup={row.original} />,
    },
];
