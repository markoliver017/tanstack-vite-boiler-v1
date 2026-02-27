import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/shadcn-ui/card";

interface StatCardProps {
    label: string;
    value: string;
    hint?: string;
    className?: string;
}

export default function StatCard({ label, value, hint, className }: StatCardProps) {
    return (
        <Card
            className={cn(
                "border border-white/50 bg-white/75 backdrop-blur dark:border-white/10 dark:bg-neutral-900/60",
                className,
            )}
        >
            <CardContent className="px-6 py-5">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-300">
                    {label}
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
                    {value}
                </div>
                {hint ? (
                    <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
                        {hint}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
