import { Button } from "@/components/shadcn-ui/button";
import { useDeleteCinemaTicketsTemplate } from "./mutations";
import type { CinemaTicketsTemplateResponse } from "./zCinemaTicketsTemplateSchema";
import { Link } from "@tanstack/react-router";
import { Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export function CinemaTicketsTemplateActions({
    item,
}: {
    item: CinemaTicketsTemplateResponse;
}) {
    const remove = useDeleteCinemaTicketsTemplate();

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Delete template mapping?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#dc2626",
        });

        if (result.isConfirmed) {
            remove.mutate(item.id);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link
                    to="/cinema-tickets-template/$templateId"
                    params={{ templateId: item.id }}
                >
                    <Edit className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
