import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MovieGridProps {
    children: ReactNode;
    className?: string;
}

export default function MovieGrid({ children, className }: MovieGridProps) {
    return (
        <div
            className={cn(
                "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                className,
            )}
        >
            {children}
        </div>
    );
}
