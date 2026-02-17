import { Button } from "@/components/shadcn-ui/button";
import { Link } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import type { Agency } from "./zAgencySchema";
import { useDeleteAgency } from "./mutations";
import Swal from "sweetalert2";

export function AgencyActions({ agency }: { agency: Agency }) {
    const deleteAgency = useDeleteAgency();

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Delete agency "${agency.name}"? This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            deleteAgency.mutate(agency.id);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link to="/agencies/$agencyId" params={{ agencyId: agency.id }}>
                    <Pencil className="h-4 w-4" />
                </Link>
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={deleteAgency.isPending}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
