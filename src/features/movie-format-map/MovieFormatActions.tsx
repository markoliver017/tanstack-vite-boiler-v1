import { Button } from "@/components/shadcn-ui/button";
import {
    useDeleteMovieFormatMap,
    useUpdateMovieFormatMap,
} from "@/features/movie-format-map/mutations";
import type { MovieFormatMapResponse } from "@/features/movie-format-map/zMovieFormatMapSchema";
import { Edit2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export function MovieFormatActions({ item }: { item: MovieFormatMapResponse }) {
    const removeMap = useDeleteMovieFormatMap();
    const updateMap = useUpdateMovieFormatMap();

    const handleEdit = async () => {
        const result = await Swal.fire({
            title: "Edit price adjustment",
            input: "number",
            inputValue: item.priceAdjustment ?? "",
            inputAttributes: {
                step: "0.01",
            },
            showCancelButton: true,
            confirmButtonText: "Save",
        });

        if (result.isConfirmed) {
            const value =
                result.value === "" || result.value === null
                    ? undefined
                    : Number(result.value);

            updateMap.mutate({
                id: item.id,
                data: { priceAdjustment: value },
            });
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Remove format?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Remove",
            confirmButtonColor: "#dc2626",
        });

        if (result.isConfirmed) {
            removeMap.mutate(item.id);
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
