import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PublicSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
    headerClassName?: string;
}

export default function PublicSection({
    title,
    description,
    children,
    className,
    headerClassName,
}: PublicSectionProps) {
    return (
        <section className={cn("py-10 sm:py-14", className)}>
            <header className={cn("mb-6", headerClassName)}>
                <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                    {title}
                </h2>
                {description ? (
                    <p className="mt-2 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
                        {description}
                    </p>
                ) : null}
            </header>
            {children}
        </section>
    );
}
