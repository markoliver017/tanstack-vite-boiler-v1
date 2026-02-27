import BackButton from "../shared/BackButton";
import { Breadcrumbs } from "./Breadcrumbs";

export function NavHeader({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <header className="flex flex-wrap justify-between items-center py-1 md:px-4 border-b border-border/60">
            <div className="flex flex-wrap gap-1">
                <BackButton showLabel={false} />

                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {title}
                    </h2>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
            {/* Maybe a quick create button if needed, but usually linked from patient */}
            <Breadcrumbs />
        </header>
    );
}
