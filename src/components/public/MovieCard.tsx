import { Badge } from "@/components/shadcn-ui/badge";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import { cn } from "@/lib/utils";
import type { PublicMovie } from "@/lib/data/public-movies.mock";

interface MovieCardProps {
    movie: PublicMovie;
    className?: string;
}

export default function MovieCard({ movie, className }: MovieCardProps) {
    return (
        <Card
            className={cn(
                "group relative overflow-hidden border-white/10 bg-white/60 backdrop-blur transition-colors dark:bg-slate-950/40",
                className,
            )}
        >
            <div className="relative">
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    {movie.posterSrc ? (
                        <img
                            src={movie.posterSrc}
                            alt={`${movie.title} poster`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <div className="rounded-xl border bg-background/60 px-3 py-2 text-xs font-medium text-muted-foreground">
                                Poster placeholder
                            </div>
                        </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-50 [background:radial-gradient(600px_circle_at_30%_20%,rgba(34,211,238,0.22),transparent_40%),radial-gradient(600px_circle_at_70%_70%,rgba(168,85,247,0.18),transparent_45%)]" />
                </div>
            </div>

            <CardContent className="p-5">
                <div className="text-xs font-medium text-muted-foreground">
                    {movie.releaseDateLabel}
                </div>
                <div className="mt-1 text-lg font-semibold tracking-tight">
                    {movie.title}
                </div>

                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {movie.synopsis}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {movie.tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>

            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40 [background:radial-gradient(600px_circle_at_20%_10%,rgba(34,211,238,0.20),transparent_40%),radial-gradient(600px_circle_at_80%_60%,rgba(168,85,247,0.18),transparent_45%)]" />
        </Card>
    );
}
