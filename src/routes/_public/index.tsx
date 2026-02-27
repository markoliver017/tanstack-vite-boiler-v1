import { createFileRoute } from "@tanstack/react-router";

import CalloutCTA from "@/components/public/CalloutCTA";
import FeatureCard from "@/components/public/FeatureCard";
import MovieCard from "@/components/public/MovieCard";
import MovieGrid from "@/components/public/MovieGrid";
import PublicPage from "@/components/public/PublicPage";
import PublicSection from "@/components/public/PublicSection";
import Reveal from "@/components/public/Reveal";
import StatCard from "@/components/public/StatCard";
import { Button } from "@/components/shadcn-ui/button";
import { PUBLIC_MOVIES_MOCK } from "@/lib/data/public-movies.mock";
import {
    BadgeCheck,
    Camera,
    ChartLine,
    Clock,
    Fingerprint,
    GanttChart,
    ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/_public/")({
    staticData: {
        breadcrumb: "Home",
        title: "Home",
    },
    component: Index,
});

function Index() {
    const nowShowing = PUBLIC_MOVIES_MOCK.filter(
        (movie) => movie.status === "now_showing",
    ).slice(0, 3);

    return (
        <PublicPage className="py-0">
            <section className="relative overflow-hidden rounded-b-3xl border-x border-b border-white/50 bg-white/65 px-5 py-12 shadow-[0_35px_80px_-70px_rgba(0,0,0,0.9)] backdrop-blur sm:px-8 sm:py-16 dark:border-white/10 dark:bg-neutral-900/55">
                <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                    <div>
                        <Reveal>
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800 dark:bg-amber-300/15 dark:text-amber-100">
                                <span className="size-1.5 rounded-full bg-amber-500" />
                                Public Cinema Experience
                            </div>
                        </Reveal>

                        <Reveal delay={0.06}>
                            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
                                Poster-first movie discovery with a premium screening
                                floor aesthetic.
                            </h1>
                        </Reveal>

                        <Reveal delay={0.12}>
                            <p className="mt-4 max-w-2xl text-sm text-neutral-700 sm:text-base dark:text-neutral-300">
                                Your public routes now frame movies as featured titles,
                                with modern reveal motion, improved hover behavior, and
                                reusable blocks you can wire to your API later.
                            </p>
                        </Reveal>

                        <Reveal delay={0.18}>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Button
                                    asChild
                                    className="bg-amber-600 text-white hover:bg-amber-700"
                                >
                                    <a href="#now-showing">See Now Showing</a>
                                </Button>
                                <Button asChild variant="outline">
                                    <a href="#workflow">How It Works</a>
                                </Button>
                            </div>
                        </Reveal>
                    </div>

                    <Reveal delay={0.1}>
                        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/60 bg-black p-3 shadow-[0_30px_80px_-50px_rgba(0,0,0,1)] dark:border-white/20">
                            <img
                                src="/posters/sample-movie-poster.svg"
                                alt="Featured sample movie poster"
                                className="aspect-[2/3] w-full rounded-xl object-cover"
                            />
                            <div className="mt-3 rounded-xl bg-white/90 p-3 dark:bg-neutral-900/85">
                                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
                                    Featured Asset
                                </div>
                                <div className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                    Sample Movie Poster
                                </div>
                                <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                                    Saved in `public/posters` and used by mock movie cards.
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                <div className="pointer-events-none absolute inset-0 opacity-45 [background:radial-gradient(900px_circle_at_12%_8%,rgba(245,158,11,0.2),transparent_42%),radial-gradient(900px_circle_at_90%_35%,rgba(14,165,233,0.16),transparent_42%)]" />
            </section>

            <PublicSection
                title="Built for accuracy, speed, and trust"
                description="System guarantees that remove ambiguity from submissions and approvals."
                className="pt-12"
                headerClassName="scroll-mt-20"
            >
                <div className="grid gap-4 md:grid-cols-3">
                    <Reveal>
                        <FeatureCard
                            title="Schedule-enforced submissions"
                            description="Hourly reports are validated against production-company-defined slots with tolerance checks."
                            icon={<Clock className="size-5" />}
                        />
                    </Reveal>
                    <Reveal delay={0.05}>
                        <FeatureCard
                            title="Strict computation order"
                            description="Discount to cultural tax deduction, gross, tax rule, then net. Every run is reproducible."
                            icon={<GanttChart className="size-5" />}
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <FeatureCard
                            title="Audit and override trail"
                            description="Approvals, rejections, and overrides are tied to actor identity and time."
                            icon={<Fingerprint className="size-5" />}
                        />
                    </Reveal>
                </div>
            </PublicSection>

            <PublicSection
                title="Live operational pulse"
                description="A clean glance surface for checkers, agencies, and production viewers."
                className="pt-0"
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Reveal>
                        <StatCard
                            label="Cadence"
                            value="Hourly"
                            hint="Per schedule window"
                        />
                    </Reveal>
                    <Reveal delay={0.05}>
                        <StatCard
                            label="Validation"
                            value="GPS + Slot"
                            hint="Attendance gate"
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <StatCard
                            label="Computation"
                            value="Automated"
                            hint="Tax order enforced"
                        />
                    </Reveal>
                    <Reveal delay={0.15}>
                        <StatCard
                            label="Visibility"
                            value="Approved Only"
                            hint="Production read-only"
                        />
                    </Reveal>
                </div>
            </PublicSection>

            <PublicSection
                title="Workflow overview"
                description="A practical 3-step path from setup to approved reporting."
                className="pt-0"
                headerClassName="scroll-mt-20"
            >
                <div id="workflow" className="sr-only" />
                <div className="grid gap-4 md:grid-cols-3">
                    <Reveal>
                        <FeatureCard
                            title="1) Configure hierarchy"
                            description="Map theater groups, theaters, halls, formats, tax rules, and local cultural taxes."
                            icon={<ShieldCheck className="size-5" />}
                        />
                    </Reveal>
                    <Reveal delay={0.05}>
                        <FeatureCard
                            title="2) Authorize checkers"
                            description="Separate account identity from checker profile and scope each production assignment."
                            icon={<BadgeCheck className="size-5" />}
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <FeatureCard
                            title="3) Submit to approval"
                            description="Validated hourlies flow to agency review and become production-visible only after approval."
                            icon={<ChartLine className="size-5" />}
                        />
                    </Reveal>
                </div>
            </PublicSection>

            <PublicSection
                title="Now showing"
                description="Poster-forward card system with hover and reveal motion."
                className="pt-0"
            >
                <div id="now-showing" className="sr-only" />
                <MovieGrid>
                    {nowShowing.map((movie, index) => (
                        <Reveal key={movie.id} delay={index * 0.06}>
                            <MovieCard movie={movie} />
                        </Reveal>
                    ))}
                </MovieGrid>
            </PublicSection>

            <PublicSection title="Ready to launch your public experience?" className="pt-0">
                <Reveal>
                    <CalloutCTA
                        title="Roll out your poster-driven public pages"
                        description="Use this updated shell for discovery now, then replace the mock layer with real API responses when ready."
                        primaryHref="/sign-in"
                        primaryLabel="Sign in"
                        secondaryHref="/about"
                        secondaryLabel="System overview"
                    />
                </Reveal>
            </PublicSection>

            <div className="pointer-events-none fixed bottom-6 right-6 hidden items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-xs font-semibold text-neutral-700 shadow-xl backdrop-blur md:flex dark:border-white/15 dark:bg-neutral-900/70 dark:text-neutral-200">
                <Camera className="size-3.5 text-amber-500" />
                Cinematic Public Theme
            </div>
        </PublicPage>
    );
}
