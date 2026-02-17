import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { Button } from "@/components/shadcn-ui/button";
import { Link } from "@tanstack/react-router";
import type { CinemaFormatResponse } from "./zCinemaFormatSchema";
import { Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useDeleteCinemaFormat } from "./mutations";

export const cinemaFormatsColumns: ColumnDef<CinemaFormatResponse>[] = [
    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code" />
        ),
    },
    {
        accessorKey: "label",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Label" />
        ),
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const { mutate: deleteFormat } = useDeleteCinemaFormat();

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
                        deleteFormat(row.original.id, {
                            onSuccess: () => {
                                Swal.fire(
                                    "Deleted!",
                                    "Cinema format has been deleted.",
                                    "success",
                                );
                            },
                            onError: (error) => {
                                Swal.fire(
                                    "Error!",
                                    error.message || "Failed to delete.",
                                    "error",
                                );
                            },
                        });
                    }
                });
            };

            return (
                <div className="flex gap-2">
                    <Button variant="outline" size="icon-sm" asChild>
                        <Link
                            to="/cinema-formats/$cinemaFormatId"
                            params={{
                                cinemaFormatId: row.original.id.toString(),
                            }}
                        >
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
