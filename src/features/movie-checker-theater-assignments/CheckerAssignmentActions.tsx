import { Button } from "@/components/shadcn-ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn-ui/dialog";
import { useDeleteCheckerAssignment } from "@/features/movie-checker-theater-assignments/mutations";
import type { CheckerAssignmentResponse } from "@/features/movie-checker-theater-assignments/zCheckerAssignmentSchema";
import { EditCheckerAssignmentForm } from "@/features/movie-checker-theater-assignments/EditCheckerAssignmentForm";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

export function CheckerAssignmentActions({
    item,
}: {
    item: CheckerAssignmentResponse;
}) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const remove = useDeleteCheckerAssignment();

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Remove assignment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Remove",
            confirmButtonColor: "#dc2626",
        });

        if (result.isConfirmed) {
            remove.mutate(item.id);
        }
    };

    return (
        <div className="flex gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Assignment</DialogTitle>
                    </DialogHeader>
                    <EditCheckerAssignmentForm
                        assignment={item}
                        onSuccess={() => setIsEditDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
