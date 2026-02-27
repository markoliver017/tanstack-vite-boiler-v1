import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";

interface FeatureCardProps {
    title: string;
    description: string;
    icon?: ReactNode;
    className?: string;
}

export default function FeatureCard({
    title,
    description,
    icon,
    className,
}: FeatureCardProps) {
    return (
        <Card
            className={cn(
                "relative overflow-hidden border border-white/50 bg-white/75 shadow-[0_18px_45px_-35px_rgba(0,0,0,0.8)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/60",
                className,
            )}
        >
            <CardHeader className="gap-3">
                {icon ? (
                    <div className="inline-flex size-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-50/70 text-amber-700 dark:bg-amber-300/10 dark:text-amber-200">
                        {icon}
                    </div>
                ) : null}
                <CardTitle className="text-base text-neutral-900 sm:text-lg dark:text-neutral-100">
                    {title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent />
            <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(600px_circle_at_20%_20%,rgba(245,158,11,0.28),transparent_40%),radial-gradient(600px_circle_at_80%_30%,rgba(14,165,233,0.22),transparent_40%)]" />
        </Card>
    );
}
