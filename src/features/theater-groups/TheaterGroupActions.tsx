import type { TheaterGroup } from "./zTheaterGroupSchema";
import { Button } from "@/components/shadcn-ui/button";
import { Pencil, Globe, Power } from "lucide-react";
import { Link } from "@tanstack/react-router";
import Swal from "sweetalert2";
import { useUpdateTheaterGroup } from "./mutations";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface TheaterGroupActionsProps {
    theaterGroup: TheaterGroup;
}

export function TheaterGroupActions({
    theaterGroup,
}: TheaterGroupActionsProps) {
    const updateTheaterGroup = useUpdateTheaterGroup();

    const handleToggleStatus = () => {
        const action = theaterGroup.isActive ? "deactivate" : "activate";
        const confirmButtonColor = theaterGroup.isActive ? "#d33" : "#3085d6";

        Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${action} this theater group?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: confirmButtonColor,
            cancelButtonColor: "#6c757d",
            confirmButtonText: `Yes, ${action} it!`,
        }).then((result) => {
            if (result.isConfirmed) {
                updateTheaterGroup.mutate({
                    id: theaterGroup.id,
                    data: { isActive: !theaterGroup.isActive },
                });
            }
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <Link
                    to="/theater-groups/$theaterGroupId"
                    params={{ theaterGroupId: theaterGroup.id.toString() }}
                >
                    <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Theater Group
                    </DropdownMenuItem>
                </Link>

                {theaterGroup.website && (
                    <a
                        href={theaterGroup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                    >
                        <DropdownMenuItem>
                            <Globe className="mr-2 h-4 w-4" />
                            Visit Website
                        </DropdownMenuItem>
                    </a>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleToggleStatus}
                    className={
                        theaterGroup.isActive
                            ? "text-red-600 focus:text-red-600"
                            : "text-green-600 focus:text-green-600"
                    }
                >
                    <Power className="mr-2 h-4 w-4" />
                    {theaterGroup.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
