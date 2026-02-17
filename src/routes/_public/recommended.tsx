import { createFileRoute } from "@tanstack/react-router";

import MovieCard from "@/components/public/MovieCard";
import MovieGrid from "@/components/public/MovieGrid";
import PublicPage from "@/components/public/PublicPage";
import PublicSection from "@/components/public/PublicSection";
import Reveal from "@/components/public/Reveal";
import { PUBLIC_MOVIES_MOCK } from "@/lib/data/public-movies.mock";

export const Route = createFileRoute("/_public/recommended")({
    staticData: {
        breadcrumb: "Recommended",
        title: "Recommended",
    },
    component: RecommendedPage,
});

function RecommendedPage() {
    const movies = PUBLIC_MOVIES_MOCK.slice(0, 3);

    return (
        <PublicPage>
            <Reveal>
                <div className="relative overflow-hidden rounded-2xl border bg-white/60 px-6 py-10 backdrop-blur dark:bg-slate-950/40">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Recommended
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        Curated picks (mock). Later this can be personalized by
                        viewer’s production company, territory, or trending
                        cinemas.
                    </p>
                    <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
                        Poster images can live in{" "}
                        <span className="font-medium">public/posters</span> and
                        be referenced as{" "}
                        <span className="font-medium">
                            /posters/&lt;file&gt;
                        </span>
                        .
                    </p>
                    <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(700px_circle_at_10%_20%,rgba(34,211,238,0.22),transparent_40%),radial-gradient(700px_circle_at_80%_60%,rgba(168,85,247,0.18),transparent_45%)]" />
                </div>
            </Reveal>

            <PublicSection
                title="Top picks"
                description="Reusable list components with scroll-reveal animations."
                className="pt-8"
            >
                {movies.length === 0 ? (
                    <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
                        No recommendations yet.
                    </div>
                ) : (
                    <MovieGrid>
                        {movies.map((movie, idx) => (
                            <Reveal key={movie.id} delay={idx * 0.06}>
                                <MovieCard movie={movie} />
                            </Reveal>
                        ))}
                    </MovieGrid>
                )}
            </PublicSection>
        </PublicPage>
    );
}
