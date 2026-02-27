import { Button } from "@/components/shadcn-ui/button";
import { useDeleteDiscount } from "./mutations";
import type { DiscountResponse } from "./zDiscountSchema";
import { Link } from "@tanstack/react-router";
import { Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export function DiscountActions({ item }: { item: DiscountResponse }) {
    const remove = useDeleteDiscount();

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Delete discount?",
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
                <Link to="/discounts/$discountId" params={{ discountId: item.id }}>
                    <Edit className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
