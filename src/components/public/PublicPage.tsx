import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PublicPageProps {
    children: ReactNode;
    className?: string;
}

export default function PublicPage({ children, className }: PublicPageProps) {
    return (
        <div
            className={cn(
                "mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14",
                className,
            )}
        >
            {children}
        </div>
    );
}
