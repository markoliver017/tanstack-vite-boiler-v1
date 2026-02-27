import { NavHeader } from "@/components/layouts/NavHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn-ui/alert";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import { fetchList } from "@/lib/api.client";
import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Plus, TicketCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

type TheaterGroupLite = { id: number; isActive: boolean };
type TheaterLite = {
    id: number;
    name: string;
    isActive: boolean;
    taxRuleId?: number | null;
};
type CinemaLite = {
    id: number;
    theaterId: number;
    name: string;
    isActive: boolean;
};
type HourlyReportLite = {
    id: number;
    reportDate: string;
    reportTime: string;
    status: "pending" | "approved" | "rejected";
    cinema?: { id: number; name: string };
    movie?: { id: number; title: string };
};
type AssignmentLite = {
    id: number;
    theaterId: number;
    movieId: number;
    cinemaId: number | null;
    cinemaFormatId: number | null;
    movie?: { id: number; title: string };
    theater?: { id: number; name: string };
};
type TaxOverrideLite = { theaterId: number };

function formatDateLocal(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString();
}

export const Route = createFileRoute("/_authenticated/dashboard")({
    staticData: {
        title: "Dashboard",
        breadcrumb: "Dashboard",
    },
    // loader: async () => {
    //     throw { message: "Something went wrong" };
    // },
    errorComponent: ({ error }) => {
        return <PageErrorComponent error={error} />;
    },
    component: RouteComponent,
});

function RouteComponent() {
    const today = formatDateLocal(new Date());

    const { data: theaterGroupsData } = useQuery({
        queryKey: ["dashboard", "theater-groups"],
        queryFn: () =>
            fetchList<TheaterGroupLite[]>(
                "/theater-groups?_page=1&_limit=2000",
            ),
        placeholderData: keepPreviousData,
    });

    const { data: theatersData } = useQuery({
        queryKey: ["dashboard", "theaters"],
        queryFn: () => fetchList<TheaterLite[]>("/theaters?_page=1&_limit=2000"),
        placeholderData: keepPreviousData,
    });

    const { data: cinemasData } = useQuery({
        queryKey: ["dashboard", "cinemas"],
        queryFn: () => fetchList<CinemaLite[]>("/cinemas?_page=1&_limit=2000"),
        placeholderData: keepPreviousData,
    });

    const { data: reportsTodayData } = useQuery({
        queryKey: ["dashboard", "hourly-reports", "today", today],
        queryFn: () =>
            fetchList<HourlyReportLite[]>(
                `/hourly-reports?_page=1&_limit=1&report_date=${today}`,
            ),
        placeholderData: keepPreviousData,
    });

    const { data: reportsRecentData } = useQuery({
        queryKey: ["dashboard", "hourly-reports", "recent"],
        queryFn: () => fetchList<HourlyReportLite[]>("/hourly-reports?_page=1&_limit=8"),
        placeholderData: keepPreviousData,
    });

    const { data: assignmentsData } = useQuery({
        queryKey: ["dashboard", "assignments"],
        queryFn: () =>
            fetchList<AssignmentLite[]>(
                "/movie-checker-theater-assignments?_page=1&_limit=2000",
            ),
        placeholderData: keepPreviousData,
    });

    const { data: taxOverridesData } = useQuery({
        queryKey: ["dashboard", "tax-overrides"],
        queryFn: () =>
            fetchList<TaxOverrideLite[]>(
                "/theater-production-tax-rules?_page=1&_limit=2000",
            ),
        placeholderData: keepPreviousData,
    });

    const cinemas = cinemasData?.data || [];
    const cinemaFormatQueries = useQueries({
        queries: cinemas.slice(0, 120).map((cinema) => ({
            queryKey: ["dashboard", "cinema-format-map", cinema.id],
            queryFn: () =>
                fetchList<{ id: number }[]>(
                    `/cinema-format-map?cinema_id=${cinema.id}`,
                ),
            staleTime: 60_000,
        })),
    });

    const theaterGroups = theaterGroupsData?.data || [];
    const theaters = theatersData?.data || [];
    const reportsRecent = reportsRecentData?.data || [];
    const assignments = assignmentsData?.data || [];
    const taxOverrides = taxOverridesData?.data || [];

    const activeTheaterGroups = theaterGroups.filter((x) => x.isActive).length;
    const activeTheaters = theaters.filter((x) => x.isActive).length;
    const activeCinemas = cinemas.filter((x) => x.isActive).length;
    const reportsToday = reportsTodayData?.total || 0;
    const openCheckerAssignments = assignments.filter(
        (x) => !x.cinemaId || !x.cinemaFormatId,
    ).length;

    const missingCinemaFormats = cinemaFormatQueries.filter(
        (q) => !q.isLoading && !q.isError && (q.data?.total || 0) === 0,
    ).length;

    const inactiveTheaterIds = new Set(
        theaters.filter((x) => !x.isActive).map((x) => x.id),
    );
    const inactiveTheatersWithActiveCinemas = new Set(
        cinemas
            .filter((x) => x.isActive && inactiveTheaterIds.has(x.theaterId))
            .map((x) => x.theaterId),
    ).size;

    const overrideTheaterIds = new Set(taxOverrides.map((x) => x.theaterId));
    const activeAssignedTheaterIds = new Set(
        assignments
            .map((x) => x.theaterId)
            .filter((id) => theaters.some((t) => t.id === id && t.isActive)),
    );
    const theatersWithoutExpectedOverrides = Array.from(
        activeAssignedTheaterIds,
    ).filter((id) => !overrideTheaterIds.has(id)).length;

    const assignmentGapRows = Array.from(
        assignments.reduce((acc, row) => {
            const key = `${row.movieId}-${row.theaterId}`;
            const current = acc.get(key) || {
                key,
                movieTitle: row.movie?.title || `Movie #${row.movieId}`,
                theaterName: row.theater?.name || `Theater #${row.theaterId}`,
                totalSlots: 0,
                unfilledSlots: 0,
            };
            current.totalSlots += 1;
            if (!row.cinemaId || !row.cinemaFormatId) current.unfilledSlots += 1;
            acc.set(key, current);
            return acc;
        }, new Map<string, { key: string; movieTitle: string; theaterName: string; totalSlots: number; unfilledSlots: number }>()),
    )
        .map(([, value]) => value)
        .filter((row) => row.unfilledSlots > 0)
        .sort((a, b) => b.unfilledSlots - a.unfilledSlots)
        .slice(0, 6);

    const overduePendingReports = reportsRecent.filter(
        (report) => report.status === "pending" && report.reportDate < today,
    ).length;

    const deactivatedButReferenced = assignments.filter((row) =>
        inactiveTheaterIds.has(row.theaterId),
    ).length;

    return (
        <div className="space-y-6">
            <NavHeader
                title="Dashboard"
                description="Operational overview and monitoring"
            />

            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader>
                        <CardDescription>Active Theater Groups</CardDescription>
                        <CardTitle className="text-2xl">
                            {activeTheaterGroups}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Active Theaters</CardDescription>
                        <CardTitle className="text-2xl">{activeTheaters}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Active Cinemas</CardDescription>
                        <CardTitle className="text-2xl">{activeCinemas}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Reports Submitted Today</CardDescription>
                        <CardTitle className="text-2xl">{reportsToday}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Open Checker Assignments</CardDescription>
                        <CardTitle className="text-2xl">
                            {openCheckerAssignments}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Data Quality</CardTitle>
                        <CardDescription>
                            Integrity checks across theaters, cinemas, and tax setup
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between rounded border p-3">
                            <span>Missing cinema format mappings</span>
                            <Badge variant="secondary">{missingCinemaFormats}</Badge>
                        </div>
                        <div className="flex items-center justify-between rounded border p-3">
                            <span>Inactive theaters with active cinemas</span>
                            <Badge variant="secondary">
                                {inactiveTheatersWithActiveCinemas}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between rounded border p-3">
                            <span>Theaters without tax-rule overrides</span>
                            <Badge variant="secondary">
                                {theatersWithoutExpectedOverrides}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Fast entry points for the most common tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2 sm:grid-cols-2">
                        <Button asChild variant="outline">
                            <Link to="/theater-groups/create">
                                <Plus className="h-4 w-4" />
                                Create Theater Group
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link to="/theaters/create">
                                <Plus className="h-4 w-4" />
                                Add Theater
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link to="/cinemas/create">
                                <Plus className="h-4 w-4" />
                                Add Cinema
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link to="/hourly-reports/create">
                                <TicketCheck className="h-4 w-4" />
                                Submit Hourly Report
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Operations Board</CardTitle>
                        <CardDescription>Latest hourly reports</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {reportsRecent.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No reports yet.
                            </p>
                        )}
                        {reportsRecent.map((report) => (
                            <div
                                key={report.id}
                                className="flex items-center justify-between rounded border p-3"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {report.movie?.title || "Unknown Movie"}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {report.cinema?.name || "Unknown Cinema"} ·{" "}
                                        {formatDisplayDate(report.reportDate)}{" "}
                                        {report.reportTime}
                                    </p>
                                </div>
                                <Badge variant="outline">{report.status}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Assignment Gaps</CardTitle>
                        <CardDescription>
                            Movie-theater slots missing cinema/format
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {assignmentGapRows.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No checker assignment gaps detected.
                            </p>
                        )}
                        {assignmentGapRows.map((row) => (
                            <div
                                key={row.key}
                                className="flex items-center justify-between rounded border p-3"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">{row.movieTitle}</p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {row.theaterName}
                                    </p>
                                </div>
                                <Badge variant="destructive">
                                    {row.unfilledSlots}/{row.totalSlots} open
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Alerts</h2>
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Deactivated but Referenced</AlertTitle>
                    <AlertDescription>
                        {deactivatedButReferenced} assignment(s) still reference
                        deactivated theaters.
                    </AlertDescription>
                </Alert>
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Overdue Reporting</AlertTitle>
                    <AlertDescription>
                        {overduePendingReports} pending report(s) are older than{" "}
                        {today}.
                    </AlertDescription>
                </Alert>
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Rule Mismatch Warnings</AlertTitle>
                    <AlertDescription>
                        {theatersWithoutExpectedOverrides} active assigned
                        theater(s) have no tax-rule override configured.
                    </AlertDescription>
                </Alert>
            </section>
        </div>
    );
}
