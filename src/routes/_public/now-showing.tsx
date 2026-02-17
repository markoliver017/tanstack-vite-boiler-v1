import { createFileRoute } from "@tanstack/react-router";

import MovieCard from "@/components/public/MovieCard";
import MovieGrid from "@/components/public/MovieGrid";
import PublicPage from "@/components/public/PublicPage";
import PublicSection from "@/components/public/PublicSection";
import Reveal from "@/components/public/Reveal";
import { PUBLIC_MOVIES_MOCK } from "@/lib/data/public-movies.mock";

export const Route = createFileRoute("/_public/now-showing")({
    staticData: {
        breadcrumb: "Now Showing",
        title: "Now Showing",
    },
    component: NowShowingPage,
});

function NowShowingPage() {
    const movies = PUBLIC_MOVIES_MOCK.filter((m) => m.status === "now_showing");

    return (
        <PublicPage>
            <Reveal>
                <div className="relative overflow-hidden rounded-2xl border bg-white/60 px-6 py-10 backdrop-blur dark:bg-slate-950/40">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Now Showing
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        Current titles in rotation. Replace this mock feed with
                        your Movies API when ready.
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
                    <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(700px_circle_at_20%_20%,rgba(59,130,246,0.25),transparent_40%),radial-gradient(700px_circle_at_80%_60%,rgba(34,211,238,0.18),transparent_45%)]" />
                </div>
            </Reveal>

            <PublicSection
                title="In theaters"
                description="Futuristic card grid with consistent spacing and hover glow."
                className="pt-8"
            >
                {movies.length === 0 ? (
                    <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
                        No movies to show yet.
                    </div>
                ) : (
                    <MovieGrid>
                        {movies.map((movie, idx) => (
                            <Reveal key={movie.id} delay={idx * 0.05}>
                                <MovieCard movie={movie} />
                            </Reveal>
                        ))}
                    </MovieGrid>
                )}
            </PublicSection>
        </PublicPage>
    );
}
