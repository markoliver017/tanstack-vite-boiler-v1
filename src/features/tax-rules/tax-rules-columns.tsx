import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import { Link } from "@tanstack/react-router";
import type { TaxRuleResponse } from "./zTaxRuleSchema";

export const taxRuleColumns: ColumnDef<TaxRuleResponse>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "formulaType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Formula Type" />
        ),
        cell: ({ row }) => {
            const formatType = (type: string) => {
                switch (type) {
                    case "gross_based":
                        return "Gross Based";
                    case "ticket_based":
                        return "Ticket Based";
                    case "custom":
                        return "Custom";
                    default:
                        return type;
                }
            };
            return (
                <Badge variant="outline">
                    {formatType(row.original.formulaType)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "taxRate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tax Rate (%)" />
        ),
    },
    {
        accessorKey: "divisor",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Divisor" />
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link
                        to="/tax-rules/$taxRuleId"
                        params={{ taxRuleId: row.original.id.toString() }}
                    >
                        Edit
                    </Link>
                </Button>
            </div>
        ),
    },
];
