/* eslint-disable react-refresh/only-export-components */
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import {
    useDeleteSchedule,
    useUpdateSchedule,
} from "@/features/production-report-schedules/mutations";
import type { ScheduleResponse } from "@/features/production-report-schedules/zScheduleSchema";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parse } from "date-fns";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

function ScheduleStatusCell({ row }: { row: ScheduleResponse }) {
    const { mutate } = useUpdateSchedule();
    const isActive = row.isActive;

    const handleToggle = () => {
        mutate({
            id: row.id,
            data: { isActive: !isActive },
        });
    };

    return (
        <Badge
            variant={isActive ? "default" : "secondary"}
            className="cursor-pointer hover:opacity-80"
            onClick={handleToggle}
        >
            {isActive ? "Active" : "Inactive"}
        </Badge>
    );
}

function ScheduleActionsCell({ row }: { row: ScheduleResponse }) {
    const { mutate: deleteSchedule } = useDeleteSchedule();

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSchedule(row.id);
                Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
        });
    };

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/90"
                onClick={handleDelete}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

export const schedulesColumns: ColumnDef<ScheduleResponse>[] = [
    {
        accessorKey: "slotTime",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Slot Time" />
        ),
        cell: ({ row }) => {
            const timeDate = parse(
                row.original.slotTime,
                "HH:mm:ss",
                new Date(),
            );
            return (
                <span className="font-medium">
                    {format(timeDate, "hh:mm a")}
                </span>
            );
        },
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => <ScheduleStatusCell row={row.original} />,
    },
    {
        accessorKey: "notes",
        header: "Notes",
    },
    {
        id: "actions",
        cell: ({ row }) => <ScheduleActionsCell row={row.original} />,
    },
];
