import { Badge } from "@/components/shadcn-ui/badge";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import { cn } from "@/lib/utils";
import type { PublicMovie } from "@/lib/data/public-movies.mock";
import { motion } from "framer-motion";

interface MovieCardProps {
    movie: PublicMovie;
    className?: string;
}

export default function MovieCard({ movie, className }: MovieCardProps) {
    return (
        <motion.article
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            <Card
                className={cn(
                    "group relative overflow-hidden border border-white/50 bg-white/75 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.8)] backdrop-blur transition-colors dark:border-white/10 dark:bg-neutral-900/60",
                    className,
                )}
            >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    {movie.posterSrc ? (
                        <img
                            src={movie.posterSrc}
                            alt={`${movie.title} poster`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <div className="rounded-xl border bg-background/60 px-3 py-2 text-xs font-medium text-muted-foreground">
                                Poster placeholder
                            </div>
                        </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-55 [background:radial-gradient(600px_circle_at_20%_20%,rgba(245,158,11,0.25),transparent_38%),radial-gradient(600px_circle_at_70%_70%,rgba(14,165,233,0.22),transparent_45%)]" />
                </div>
            

                <CardContent className="space-y-3 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-300">
                    {movie.releaseDateLabel}
                </div>
                    <div className="text-2xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-neutral-100">
                    {movie.title}
                </div>

                    <p className="line-clamp-3 text-sm text-neutral-600 dark:text-neutral-300">
                    {movie.synopsis}
                </p>

                    <div className="flex flex-wrap gap-2">
                    {movie.tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="border border-amber-600/20 bg-amber-50 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
                </CardContent>

                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-35 [background:radial-gradient(600px_circle_at_20%_10%,rgba(245,158,11,0.18),transparent_40%),radial-gradient(600px_circle_at_80%_60%,rgba(14,165,233,0.16),transparent_45%)]" />
            </Card>
        </motion.article>
    );
}
