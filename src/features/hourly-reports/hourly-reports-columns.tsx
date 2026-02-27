import { Badge } from "@/components/shadcn-ui/badge";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { HourlyReportActions } from "./HourlyReportActions";
import type { HourlyReportResponse } from "./zHourlyReportSchema";

export const hourlyReportsColumns: ColumnDef<HourlyReportResponse>[] = [
    {
        id: "cinema",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cinema" />
        ),
        cell: ({ row }) => row.original.cinema?.name || `#${row.original.cinemaId}`,
    },
    {
        id: "movie",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Movie" />
        ),
        cell: ({ row }) => row.original.movie?.title || `#${row.original.movieId}`,
    },
    {
        accessorKey: "reportDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Report Date" />
        ),
        cell: ({ row }) => format(new Date(row.original.reportDate), "MMM dd, yyyy"),
    },
    {
        accessorKey: "reportTime",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Report Time" />
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge
                    variant={
                        status === "approved"
                            ? "default"
                            : status === "rejected"
                              ? "destructive"
                              : "secondary"
                    }
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <HourlyReportActions item={row.original} />,
    },
];
