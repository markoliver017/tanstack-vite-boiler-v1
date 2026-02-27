import { createFileRoute } from "@tanstack/react-router";

import MovieCard from "@/components/public/MovieCard";
import MovieGrid from "@/components/public/MovieGrid";
import PublicPage from "@/components/public/PublicPage";
import PublicSection from "@/components/public/PublicSection";
import Reveal from "@/components/public/Reveal";
import { PUBLIC_MOVIES_MOCK } from "@/lib/data/public-movies.mock";
import { Sparkles } from "lucide-react";

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
                <section className="relative overflow-hidden rounded-3xl border border-white/55 bg-white/70 px-6 py-10 shadow-[0_28px_80px_-70px_rgba(0,0,0,1)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/55">
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:bg-sky-300/15 dark:text-sky-100">
                        <Sparkles className="size-3.5" />
                        Curated Picks
                    </div>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
                        Recommended
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-neutral-700 sm:text-base dark:text-neutral-300">
                        Curated discovery feed for featured movies. You can later
                        personalize this by territory, trend, or release performance.
                    </p>
                    <div className="pointer-events-none absolute inset-0 opacity-45 [background:radial-gradient(900px_circle_at_15%_20%,rgba(14,165,233,0.2),transparent_42%),radial-gradient(900px_circle_at_85%_62%,rgba(245,158,11,0.18),transparent_45%)]" />
                </section>
            </Reveal>

            <PublicSection
                title="Top picks"
                description="A polished recommendation layout using your shared movie card system."
                className="pt-8"
            >
                {movies.length === 0 ? (
                    <div className="rounded-xl border border-white/40 bg-white/70 p-6 text-sm text-neutral-600 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-300">
                        No recommendations yet.
                    </div>
                ) : (
                    <MovieGrid>
                        {movies.map((movie, index) => (
                            <Reveal key={movie.id} delay={index * 0.06}>
                                <MovieCard movie={movie} />
                            </Reveal>
                        ))}
                    </MovieGrid>
                )}
            </PublicSection>
        </PublicPage>
    );
}
