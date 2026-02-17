// Role type definition matching backend
export type UserRole =
    | "checker"
    | "agency_admin"
    | "production_viewer"
    | "system_admin";

// Role display names
export const ROLE_LABELS: Record<UserRole, string> = {
    checker: "Cinema Checker",
    agency_admin: "Agency Administrator",
    production_viewer: "Production Viewer",
    system_admin: "System Administrator",
};

// Role-based route access
export const ROLE_ROUTES: Record<UserRole, string[]> = {
    system_admin: [
        "/dashboard",
        "/agencies",
        "/cinemas",
        "/tax-rules",
        "/ticket-types",
        "/movies",
        "/hourly-reports",
        "/daily-summaries",
        "/audit-logs",
        "/users",
    ],
    agency_admin: [
        "/dashboard",
        "/cinemas",
        "/ticket-types",
        "/checker-attendance",
        "/hourly-reports",
        "/daily-summaries",
        "/audit-logs",
    ],
    checker: [
        "/dashboard",
        "/time-in",
        "/hourly-reports/create",
        "/my-reports",
    ],
    production_viewer: [
        "/dashboard",
        "/reports/hourly",
        "/reports/daily",
        "/reports/cumulative",
    ],
};

// Helper function to check if user can access route
export function canAccessRoute(userRole: UserRole, route: string): boolean {
    const allowedRoutes = ROLE_ROUTES[userRole];
    return allowedRoutes.some((allowed) => route.startsWith(allowed));
}

// Helper function to get user's default route after login
export function getDefaultRoute(userRole: UserRole): string {
    switch (userRole) {
        case "system_admin":
            return "/dashboard";
        case "agency_admin":
            return "/dashboard";
        case "checker":
            return "/time-in";
        case "production_viewer":
            return "/reports/hourly";
        default:
            return "/dashboard";
    }
}
