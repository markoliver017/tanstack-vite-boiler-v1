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
                "border-white/10 bg-white/60 backdrop-blur dark:bg-slate-950/40",
                className,
            )}
        >
            <CardContent className="px-6 py-5">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {value}
                </div>
                {hint ? (
                    <div className="mt-2 text-xs text-muted-foreground">{hint}</div>
                ) : null}
            </CardContent>
        </Card>
    );
}
