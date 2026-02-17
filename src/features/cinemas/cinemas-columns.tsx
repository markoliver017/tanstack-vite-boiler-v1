import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { Button } from "@/components/shadcn-ui/button";
import { Link } from "@tanstack/react-router";
import type { CinemaResponse } from "./zCinemaSchema";

export const cinemasColumns: ColumnDef<CinemaResponse>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cinema Name" />
        ),
    },
    {
        accessorKey: "theater.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Theater" />
        ),
        cell: ({ row }) => row.original.theater?.name || "N/A",
    },
    {
        accessorKey: "theater.theaterGroup.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Theater Group" />
        ),
        cell: ({ row }) => row.original.theater?.theaterGroup?.name || "N/A",
    },
    {
        accessorKey: "geofenceRadius",
        header: "Geofence (m)",
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <div
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    row.original.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                }`}
            >
                {row.original.isActive ? "Active" : "Inactive"}
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link
                        to="/cinemas/$cinemaId"
                        params={{ cinemaId: row.original.id.toString() }}
                    >
                        Edit
                    </Link>
                </Button>
            </div>
        ),
    },
];
