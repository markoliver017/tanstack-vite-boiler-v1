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
                "relative overflow-hidden rounded-2xl border border-white/50 bg-white/75 p-8 backdrop-blur dark:border-white/10 dark:bg-neutral-900/60",
                className,
            )}
        >
            <div className="relative z-10">
                <h3 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-100">
                    {title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-neutral-600 sm:text-base dark:text-neutral-300">
                    {description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                        asChild
                        className="bg-amber-600 text-white hover:bg-amber-700"
                    >
                        <Link to={primaryHref}>{primaryLabel}</Link>
                    </Button>
                    {secondaryHref && secondaryLabel ? (
                        <Button asChild variant="outline">
                            <Link to={secondaryHref}>{secondaryLabel}</Link>
                        </Button>
                    ) : null}
                </div>
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-45 [background:radial-gradient(700px_circle_at_20%_20%,rgba(245,158,11,0.22),transparent_40%),radial-gradient(700px_circle_at_80%_70%,rgba(14,165,233,0.24),transparent_40%),radial-gradient(700px_circle_at_60%_10%,rgba(244,63,94,0.20),transparent_45%)]" />
        </div>
    );
}
