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
                "relative overflow-hidden border-white/10 bg-white/60 backdrop-blur dark:bg-slate-950/40",
                className,
            )}
        >
            <CardHeader className="gap-3">
                {icon ? (
                    <div className="inline-flex size-10 items-center justify-center rounded-xl border bg-background/60">
                        {icon}
                    </div>
                ) : null}
                <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent />
            <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(600px_circle_at_20%_20%,rgba(59,130,246,0.35),transparent_40%),radial-gradient(600px_circle_at_80%_30%,rgba(168,85,247,0.25),transparent_40%)]" />
        </Card>
    );
}
