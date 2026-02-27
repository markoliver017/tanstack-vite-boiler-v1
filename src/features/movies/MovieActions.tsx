import { Button } from "@/components/shadcn-ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { useDeleteMovie } from "@/features/movies/mutations";
import type { MovieResponse } from "@/features/movies/zMovieSchema";
import { Link } from "@tanstack/react-router";
import { Edit, ListTree, MoreHorizontal, Settings, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export function MovieActions({ movie }: { movie: MovieResponse }) {
    const deleteMovie = useDeleteMovie();

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Delete movie?",
            text: `Delete "${movie.title}" permanently?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#dc2626",
        });

        if (result.isConfirmed) {
            deleteMovie.mutate(movie.id);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem asChild>
                    <Link
                        to="/movies/$movieId/formats"
                        params={{ movieId: String(movie.id) }}
                        className="cursor-pointer flex items-center"
                    >
                        <ListTree className="mr-2 h-4 w-4" />
                        <span>Formats</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        to="/movies/$movieId/theaters"
                        params={{ movieId: movie.id }}
                        className="cursor-pointer flex items-center"
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Manage Theaters</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        to="/movies/$movieId"
                        params={{ movieId: movie.id }}
                        className="cursor-pointer flex items-center"
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
