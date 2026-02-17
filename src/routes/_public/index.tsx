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
        (m) => m.status === "now_showing",
    ).slice(0, 3);

    return (
        <PublicPage className="py-0">
            <div className="relative overflow-hidden border-b">
                <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20">
                    <Reveal>
                        <div className="inline-flex items-center gap-2 rounded-full border bg-white/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur dark:bg-slate-950/40">
                            <span className="size-1.5 rounded-full bg-blue-600" />
                            Cinema gross reporting, reimagined
                        </div>
                    </Reveal>

                    <Reveal delay={0.05}>
                        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                            Real-time hourly reporting with strict computations
                            and audit-grade traceability.
                        </h1>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <p className="mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
                            Replace texting and spreadsheets with a validated
                            workflow: schedule windows, GPS attendance, cultural
                            tax deductions, and production tax rules—computed in
                            the correct order, every time.
                        </p>
                    </Reveal>

                    <Reveal delay={0.12}>
                        <p className="mt-3 max-w-2xl text-pretty text-xs text-muted-foreground">
                            Designed with a theater-like feel: dark-vignette
                            backdrop, soft neon glows per section, and
                            poster-first discovery pages.
                        </p>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Button
                                asChild
                                className="bg-blue-700 hover:bg-blue-800"
                            >
                                <a href="#value">Explore value</a>
                            </Button>
                            <Button asChild variant="outline">
                                <a href="#workflow">How it works</a>
                            </Button>
                        </div>
                    </Reveal>
                </div>

                <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(900px_circle_at_20%_20%,rgba(59,130,246,0.28),transparent_45%),radial-gradient(900px_circle_at_80%_40%,rgba(168,85,247,0.20),transparent_45%),radial-gradient(900px_circle_at_60%_90%,rgba(34,211,238,0.18),transparent_50%)]" />
            </div>

            <PublicSection
                title="Built for accuracy, speed, and trust"
                description="These are the system guarantees that eliminate reporting ambiguity."
                className="pt-12"
                headerClassName="scroll-mt-20"
            >
                <div id="value" />
                <div className="grid gap-4 md:grid-cols-3">
                    <Reveal>
                        <FeatureCard
                            title="Schedule-enforced submissions"
                            description="Hourly reports are validated against production-company-defined slots (with tolerance)."
                            icon={<Clock className="size-5 text-blue-700" />}
                        />
                    </Reveal>
                    <Reveal delay={0.05}>
                        <FeatureCard
                            title="Strict computation order"
                            description="Discount → cultural tax deduction → gross → tax rule → net. Snapshotted per entry for audit."
                            icon={
                                <GanttChart className="size-5 text-blue-700" />
                            }
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <FeatureCard
                            title="Audit & override trail"
                            description="Approve, reject, or override with reasons—every change is traceable to a user and timestamp."
                            icon={
                                <Fingerprint className="size-5 text-blue-700" />
                            }
                        />
                    </Reveal>
                </div>
            </PublicSection>

            <PublicSection
                title="Operational clarity—at a glance"
                description="Designed for checkers, agency supervisors, and production viewers."
                className="pt-0"
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Reveal>
                        <StatCard
                            label="Reporting cadence"
                            value="Hourly"
                            hint="Per production schedule"
                        />
                    </Reveal>
                    <Reveal delay={0.05}>
                        <StatCard
                            label="Validation"
                            value="GPS + Slots"
                            hint="Attendance gatekeeping"
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <StatCard
                            label="Computation"
                            value="Auto"
                            hint="Tax + cultural deduction"
                        />
                    </Reveal>
                    <Reveal delay={0.15}>
                        <StatCard
                            label="Visibility"
                            value="Approved only"
                            hint="Production read-only"
                        />
                    </Reveal>
                </div>
            </PublicSection>

            <PublicSection
                title="Workflow (high-level)"
                description="A modern pipeline that enforces the process end-to-end."
                className="pt-0"
                headerClassName="scroll-mt-20"
            >
                <div id="workflow" />
                <div className="grid gap-4 md:grid-cols-3">
                    <Reveal>
                        <FeatureCard
                            title="1) Configure hierarchy"
                            description="Theater groups → theaters → halls → formats + tax rules and cultural taxes per city/province."
                            icon={
                                <ShieldCheck className="size-5 text-blue-700" />
                            }
                        />
                    </Reveal>
                    <Reveal delay={0.05}>
                        <FeatureCard
                            title="2) Onboard & authorize checkers"
                            description="Separate login vs checker profile and scope authorization per production company."
                            icon={
                                <BadgeCheck className="size-5 text-blue-700" />
                            }
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <FeatureCard
                            title="3) Submit → review → approve"
                            description="Validated submissions flow to agency review; approved reports become visible to production viewers."
                            icon={
                                <ChartLine className="size-5 text-blue-700" />
                            }
                        />
                    </Reveal>
                </div>
            </PublicSection>

            <PublicSection
                title="Now showing (UI demo)"
                description="This section is a visual placeholder for your public movie discovery pages."
                className="pt-0"
            >
                <MovieGrid>
                    {nowShowing.map((movie, idx) => (
                        <Reveal key={movie.id} delay={idx * 0.06}>
                            <MovieCard movie={movie} />
                        </Reveal>
                    ))}
                </MovieGrid>
            </PublicSection>

            <PublicSection title="Ready to see it in action?" className="pt-0">
                <Reveal>
                    <CalloutCTA
                        title="Bring reporting into real time"
                        description="Start with public exploration, then move into authenticated dashboards when you’re ready."
                        primaryHref="/sign-in"
                        primaryLabel="Sign in"
                        secondaryHref="/about"
                        secondaryLabel="Read the overview"
                    />
                </Reveal>
            </PublicSection>
        </PublicPage>
    );
}
