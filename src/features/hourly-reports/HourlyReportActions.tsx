import { Button } from "@/components/shadcn-ui/button";
import type { HourlyReportResponse } from "./zHourlyReportSchema";
import { Link } from "@tanstack/react-router";
import { Eye, Pencil } from "lucide-react";

export function HourlyReportActions({ item }: { item: HourlyReportResponse }) {
    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link to="/hourly-reports/$hourlyReportId" params={{ hourlyReportId: item.id }}>
                    <Eye className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <Link
                    to="/hourly-reports/$hourlyReportId"
                    params={{ hourlyReportId: item.id }}
                    search={{ mode: "edit" }}
                >
                    <Pencil className="h-4 w-4" />
                </Link>
            </Button>
        </div>
    );
}
