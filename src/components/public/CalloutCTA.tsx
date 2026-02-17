import { Link } from "@tanstack/react-router";

import { Button } from "@/components/shadcn-ui/button";
import { cn } from "@/lib/utils";

interface CalloutCTAProps {
    title: string;
    description: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref?: string;
    secondaryLabel?: string;
    className?: string;
}

export default function CalloutCTA({
    title,
    description,
    primaryHref,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
    className,
}: CalloutCTAProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border bg-white/60 p-8 backdrop-blur dark:bg-slate-950/40",
                className,
            )}
        >
            <div className="relative z-10">
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                    {description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="bg-blue-700 hover:bg-blue-800">
                        <Link to={primaryHref}>{primaryLabel}</Link>
                    </Button>
                    {secondaryHref && secondaryLabel ? (
                        <Button asChild variant="outline">
                            <Link to={secondaryHref}>{secondaryLabel}</Link>
                        </Button>
                    ) : null}
                </div>
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(700px_circle_at_20%_20%,rgba(34,211,238,0.25),transparent_40%),radial-gradient(700px_circle_at_80%_70%,rgba(59,130,246,0.25),transparent_40%),radial-gradient(700px_circle_at_60%_10%,rgba(168,85,247,0.20),transparent_45%)]" />
        </div>
    );
}
