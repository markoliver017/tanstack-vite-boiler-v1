import { Link, useMatches } from "@tanstack/react-router";

export function Breadcrumbs() {
    // Get all currently active route matches
    const matches = useMatches();
    console.log("Matches", matches);
    // Filter out routes that don't have a breadcrumb label (like __root or pathless routes)
    const breadcrumbs = matches
        .filter(
            (match) =>
                match.staticData?.breadcrumb ||
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (match.loaderData as any)?.breadcrumb,
        )
        .map((match) => {
            // 1. Check if there is dynamic breadcrumb data in the loader
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dynamicLabel = (match.loaderData as any)?.breadcrumb;

            // 2. Fallback to the static label defined in the route config
            const staticLabel = match.staticData?.breadcrumb;

            return {
                label: dynamicLabel || staticLabel,
                path: match.pathname,
            };
        });

    if (breadcrumbs.length === 0) return null;

    return (
        <nav className="flex gap-2 text-xs text-gray-600 pl-5">
            {/* <Link to="/" className="hover:underline">
                Home
            </Link> */}
            {breadcrumbs.map((bc, index) => (
                <div key={bc.path} className="flex gap-2">
                    <Link
                        to={bc.path}
                        search={true}
                        className="hover:underline [&.active]:font-bold [&.active]:text-black"
                    >
                        {bc.label}
                    </Link>
                    {index + 1 === breadcrumbs.length ? null : <span>/</span>}
                </div>
            ))}
        </nav>
    );
}
