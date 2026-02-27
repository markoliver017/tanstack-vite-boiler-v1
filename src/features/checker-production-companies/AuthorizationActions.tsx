import { Button } from "@/components/shadcn-ui/button";
import {
    useDeleteAuthorization,
    useUpdateAuthorization,
} from "@/features/checker-production-companies/mutations";
import type { AuthorizationResponse } from "@/features/checker-production-companies/zAuthorizationSchema";
import { Edit2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export function AuthorizationActions({ item }: { item: AuthorizationResponse }) {
    const remove = useDeleteAuthorization();
    const update = useUpdateAuthorization();

    const handleEdit = async () => {
        const result = await Swal.fire({
            title: "Update Authorized Until",
            input: "date",
            inputValue: item.authorizedUntil || "",
            showCancelButton: true,
            confirmButtonText: "Save",
        });

        if (result.isConfirmed) {
            update.mutate({
                id: item.id,
                data: {
                    authorizedUntil: result.value || undefined,
                },
            });
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Revoke authorization?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Revoke",
            confirmButtonColor: "#dc2626",
        });

        if (result.isConfirmed) {
            remove.mutate(item.id);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
