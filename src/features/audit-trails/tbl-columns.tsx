import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import type { AuditTrailResponse } from "./zAuditTrailSchema";

const columnHelper = createColumnHelper<AuditTrailResponse>();

export const auditTrailColumns = [
    columnHelper.accessor("id", {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: (info) => (
            <span className="font-mono text-xs">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor("controller", {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Module" />
        ),
        cell: (info) => <Badge variant="outline">{info.getValue()}</Badge>,
    }),
    columnHelper.accessor("action", {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Action" />
        ),
        cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    }),
    columnHelper.accessor("isError", {
        header: "Status",
        cell: (info) => {
            const isError = info.getValue();
            return isError ? (
                <Badge variant="destructive">Error</Badge>
            ) : (
                <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                >
                    Success
                </Badge>
            );
        },
    }),
    columnHelper.accessor("details", {
        header: "Details",
        cell: (info) => {
            const details = info.getValue();
            if (!details)
                return <span className="text-muted-foreground">—</span>;
            return (
                <span className="text-xs truncate max-w-[300px] block">
                    {details}
                </span>
            );
        },
    }),
    columnHelper.accessor("createdAt", {
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Timestamp" />
        ),
        cell: (info) => {
            const date = new Date(info.getValue());
            return (
                <span className="text-xs text-muted-foreground">
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                </span>
            );
        },
    }),
    columnHelper.accessor("id", {
        id: "actions",
        header: "",
        cell: (info) => (
            <Button variant="ghost" size="icon-sm" asChild>
                <Link
                    to="/audit-trails/$auditTrailId"
                    params={{ auditTrailId: String(info.getValue()) }}
                >
                    <Eye className="h-4 w-4" />
                </Link>
            </Button>
        ),
    }),
];
