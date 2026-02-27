import { createFileRoute } from "@tanstack/react-router";

import MovieCard from "@/components/public/MovieCard";
import MovieGrid from "@/components/public/MovieGrid";
import PublicPage from "@/components/public/PublicPage";
import PublicSection from "@/components/public/PublicSection";
import Reveal from "@/components/public/Reveal";
import { PUBLIC_MOVIES_MOCK } from "@/lib/data/public-movies.mock";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/_public/now-showing")({
    staticData: {
        breadcrumb: "Now Showing",
        title: "Now Showing",
    },
    component: NowShowingPage,
});

function NowShowingPage() {
    const movies = PUBLIC_MOVIES_MOCK.filter((movie) => movie.status === "now_showing");

    return (
        <PublicPage>
            <Reveal>
                <section className="relative overflow-hidden rounded-3xl border border-white/55 bg-white/70 px-6 py-10 shadow-[0_28px_80px_-70px_rgba(0,0,0,1)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/55">
                    <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700 dark:bg-rose-300/15 dark:text-rose-100">
                        <Flame className="size-3.5" />
                        In Theaters Now
                    </div>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
                        Now Showing
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-neutral-700 sm:text-base dark:text-neutral-300">
                        Public titles currently in rotation. This screen is tuned for
                        quick poster scanning and clear movie metadata.
                    </p>
                    <div className="pointer-events-none absolute inset-0 opacity-45 [background:radial-gradient(900px_circle_at_10%_15%,rgba(244,63,94,0.2),transparent_42%),radial-gradient(900px_circle_at_88%_55%,rgba(14,165,233,0.18),transparent_45%)]" />
                </section>
            </Reveal>

            <PublicSection
                title="Current lineup"
                description="Cinematic card grid with improved hover depth and reveal timing."
                className="pt-8"
            >
                {movies.length === 0 ? (
                    <div className="rounded-xl border border-white/40 bg-white/70 p-6 text-sm text-neutral-600 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-300">
                        No movies to show yet.
                    </div>
                ) : (
                    <MovieGrid>
                        {movies.map((movie, index) => (
                            <Reveal key={movie.id} delay={index * 0.05}>
                                <MovieCard movie={movie} />
                            </Reveal>
                        ))}
                    </MovieGrid>
                )}
            </PublicSection>
        </PublicPage>
    );
}
