import { Breadcrumbs } from "./Breadcrumbs";

export function NavHeader({ title, description }: { title: string; description: string }) {
    return (
        <header className="flex justify-between items-center py-1 px-4 border-b border-border/60">
            <div>   
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
            </div>
            {/* Maybe a quick create button if needed, but usually linked from patient */}
            <Breadcrumbs />
        </header>
    );
}