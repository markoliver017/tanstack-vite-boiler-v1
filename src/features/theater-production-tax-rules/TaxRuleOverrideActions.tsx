import { Button } from "@/components/shadcn-ui/button";
import { useDeleteTaxRuleOverride } from "@/features/theater-production-tax-rules/mutations";
import type { TaxRuleOverrideResponse } from "@/features/theater-production-tax-rules/zTaxRuleOverrideSchema";
import { Link } from "@tanstack/react-router";
import { Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export function TaxRuleOverrideActions({
    item,
}: {
    item: TaxRuleOverrideResponse;
}) {
    const remove = useDeleteTaxRuleOverride();

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Delete override?",
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
                    to="/theater-production-tax-rules/$overrideId"
                    params={{ overrideId: item.id }}
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
