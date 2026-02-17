import { createFileRoute } from "@tanstack/react-router";

import MovieCard from "@/components/public/MovieCard";
import MovieGrid from "@/components/public/MovieGrid";
import PublicPage from "@/components/public/PublicPage";
import PublicSection from "@/components/public/PublicSection";
import Reveal from "@/components/public/Reveal";
import { PUBLIC_MOVIES_MOCK } from "@/lib/data/public-movies.mock";

export const Route = createFileRoute("/_public/upcoming")({
    staticData: {
        breadcrumb: "Upcoming",
        title: "Upcoming Movies",
    },
    component: UpcomingPage,
});

function UpcomingPage() {
    const movies = PUBLIC_MOVIES_MOCK.filter((m) => m.status === "upcoming");

    return (
        <PublicPage>
            <Reveal>
                <div className="relative overflow-hidden rounded-2xl border bg-white/60 px-6 py-10 backdrop-blur dark:bg-slate-950/40">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Upcoming
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        What’s next in the pipeline. Later this page can be
                        driven by cutoff period + production company.
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
                    <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(700px_circle_at_30%_10%,rgba(168,85,247,0.22),transparent_40%),radial-gradient(700px_circle_at_80%_70%,rgba(59,130,246,0.20),transparent_45%)]" />
                </div>
            </Reveal>

            <PublicSection
                title="Coming soon"
                description="A consistent grid UI shared with Now Showing."
                className="pt-8"
            >
                {movies.length === 0 ? (
                    <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
                        No upcoming titles yet.
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
