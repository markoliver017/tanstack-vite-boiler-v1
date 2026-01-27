import { useRouterState } from "@tanstack/react-router";
import { motion, useIsomorphicLayoutEffect } from "framer-motion";
import { useState } from "react";

export function MainLayout({ children }: { children: React.ReactNode }) {
    const isLoading = useRouterState({ select: (s) => s.status === "pending" });
    const location = useRouterState({ select: (s) => s.location });

    const [isMounted, setIsMounted] = useState(false);

    useIsomorphicLayoutEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="flex min-h-screen" suppressHydrationWarning>
            {/* Loading Progress Bar */}
            {isLoading && isMounted && (
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="fixed top-0 left-0 h-1 bg-blue-600 z-100"
                />
            )}

            {/* Page Transition Wrapper */}
            <motion.main
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="flex-1"
                suppressHydrationWarning
            >
                {children}
            </motion.main>
        </div>
    );
}
