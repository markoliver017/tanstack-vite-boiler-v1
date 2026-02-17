import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import { Link } from "@tanstack/react-router";
import type { ProductionCompanyResponse } from "./zProductionCompanySchema";
import { Eye } from "lucide-react";

export const productionCompaniesColumns: ColumnDef<ProductionCompanyResponse>[] =
    [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
        },
        {
            accessorKey: "shortCode",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Short Code" />
            ),
        },
        {
            accessorKey: "contactName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Contact Name" />
            ),
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.isActive ? "default" : "secondary"}
                >
                    {row.original.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="outline" size="icon-sm" asChild>
                        <Link
                            to="/production-companies/$companyId"
                            params={{ companyId: String(row.original.id) }}
                        >
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];
