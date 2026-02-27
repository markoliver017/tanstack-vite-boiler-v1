import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { Button } from "@/components/shadcn-ui/button";
import { Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useDeleteScreeningTicketEntry } from "./mutations";
import type { ScreeningTicketEntryResponse } from "./zScreeningTicketEntrySchema";

// eslint-disable-next-line react-refresh/only-export-components
const ActionsCell = ({
    entry,
    onEdit,
}: {
    entry: ScreeningTicketEntryResponse;
    onEdit: (entry: ScreeningTicketEntryResponse) => void;
}) => {
    const { mutate: deleteEntry, isPending } = useDeleteScreeningTicketEntry();

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this ticket entry!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteEntry(entry.id, {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "The entry has been deleted.",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    },
                });
            }
        });
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="icon-sm"
                onClick={() => onEdit(entry)}
                title="Edit Entry"
            >
                <Edit className="h-4 w-4" />
            </Button>
            <Button
                variant="destructive"
                size="icon-sm"
                onClick={handleDelete}
                title="Delete Entry"
                disabled={isPending}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
};

export const getScreeningTicketEntriesColumns = (
    onEdit: (entry: ScreeningTicketEntryResponse) => void,
): ColumnDef<ScreeningTicketEntryResponse>[] => [
    {
        accessorKey: "ticketType.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ticket Type" />
        ),
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Quantity" />
        ),
    },
    {
        accessorKey: "remarks",
        header: "Remarks",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsCell entry={row.original} onEdit={onEdit} />,
    },
];
