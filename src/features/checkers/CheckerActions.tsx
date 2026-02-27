import { Button } from "@/components/shadcn-ui/button";
import { useDeleteChecker } from "@/features/checkers/mutations";
import type { CheckerResponse } from "@/features/checkers/zCheckerSchema";
import { Link } from "@tanstack/react-router";
import { Edit, MapPinCheck, ShieldCheck, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export function CheckerActions({ checker }: { checker: CheckerResponse }) {
    const removeChecker = useDeleteChecker();

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: checker.isActive ? "Deactivate checker?" : "Already inactive",
            icon: "warning",
            showCancelButton: checker.isActive,
            confirmButtonText: "Deactivate",
            confirmButtonColor: "#dc2626",
        });

        if (checker.isActive && result.isConfirmed) {
            removeChecker.mutate(checker.id);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link
                    to="/checkers/$checkerId/assignments"
                    params={{ checkerId: String(checker.id) }}
                >
                    <MapPinCheck className="h-4 w-4 mr-2" />
                    Assignments
                </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <Link
                    to="/checkers/$checkerId/authorizations"
                    params={{ checkerId: String(checker.id) }}
                >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Authorizations
                </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <Link to="/checkers/$checkerId" params={{ checkerId: checker.id }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
