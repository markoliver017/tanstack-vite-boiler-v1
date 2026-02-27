import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import {
    useDeleteCulturalTax,
    useUpdateCulturalTax,
} from "@/features/cultural-taxes/mutations";
import type { CulturalTaxResponse } from "@/features/cultural-taxes/zCulturalTaxSchema";
import { Link } from "@tanstack/react-router";
import { Edit, Power, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export function CulturalTaxActions({ item }: { item: CulturalTaxResponse }) {
    const update = useUpdateCulturalTax();
    const remove = useDeleteCulturalTax();

    const handleToggle = async () => {
        update.mutate({
            id: item.id,
            data: { isActive: !item.isActive },
        });
    };

    const handleDeactivate = async () => {
        const result = await Swal.fire({
            title: "Deactivate cultural tax?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Deactivate",
            confirmButtonColor: "#dc2626",
        });

        if (result.isConfirmed) {
            remove.mutate(item.id);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Badge
                className="cursor-pointer"
                variant={item.isActive ? "default" : "secondary"}
                onClick={handleToggle}
            >
                {item.isActive ? "Active" : "Inactive"}
            </Badge>
            <Button variant="outline" size="sm" asChild>
                <Link
                    to="/cultural-taxes/$culturalTaxId"
                    params={{ culturalTaxId: item.id }}
                >
                    <Edit className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleToggle}>
                <Power className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeactivate}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
