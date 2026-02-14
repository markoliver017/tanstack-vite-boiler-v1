import { Link, useMatches } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
    label: string;
    path?: string;
};

export function Breadcrumbs({
    className,
    items,
}: {
    className?: string;
    items?: BreadcrumbItem[];
}) {
    // 1. If explicit items are provided, use them.
    // 2. Otherwise default to useMatches() logic (good for nested routes).
    const matches = useMatches();

    let breadcrumbs: BreadcrumbItem[] = [];

    if (items) {
        breadcrumbs = items;
    } else {
        breadcrumbs = matches
            .filter(
                (match) =>
                    match.staticData?.breadcrumb ||
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (match.loaderData as any)?.breadcrumb,
            )
            .map((match) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dynamicLabel = (match.loaderData as any)?.breadcrumb;
                const staticLabel = match.staticData?.breadcrumb;

                return {
                    label: dynamicLabel || staticLabel,
                    path: match.pathname,
                };
            });
    }

    if (breadcrumbs.length === 0) return null;

    return (
        <nav
            aria-label="Breadcrumb"
            className={`flex items-center text-sm text-muted-foreground ${className}`}
        >
            {breadcrumbs.map((bc, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                    <div key={index} className="flex items-center">
                        {index > 0 && (
                            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                        )}
                        {bc.path && !isLast ? (
                            <Link
                                to={bc.path}
                                className="hover:text-foreground transition-colors font-medium hover:underline"
                            >
                                {bc.label}
                            </Link>
                        ) : (
                            <span
                                className={`font-semibold ${
                                    isLast ? "text-foreground" : ""
                                }`}
                            >
                                {bc.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
