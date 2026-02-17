import { createFileRoute } from "@tanstack/react-router";

import CalloutCTA from "@/components/public/CalloutCTA";
import FeatureCard from "@/components/public/FeatureCard";
import PublicPage from "@/components/public/PublicPage";
import PublicSection from "@/components/public/PublicSection";
import Reveal from "@/components/public/Reveal";
import {
    BadgeCheck,
    Building2,
    Calculator,
    Clock,
    Eye,
    ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/_public/about")({
    staticData: {
        breadcrumb: "About",
        title: "About",
    },
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <PublicPage>
            <Reveal>
                <div className="relative overflow-hidden rounded-2xl border bg-white/60 px-6 py-10 backdrop-blur dark:bg-slate-950/40">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        About the system
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
                        A cinema gross reporting platform designed to enforce
                        schedule windows, validate attendance, automate tax and
                        cultural deductions, and provide production companies
                        with approved, exportable reports—without Excel.
                    </p>
                    <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(700px_circle_at_20%_20%,rgba(59,130,246,0.25),transparent_40%),radial-gradient(700px_circle_at_80%_70%,rgba(168,85,247,0.20),transparent_45%)]" />
                </div>
            </Reveal>

            <PublicSection
                title="System scope"
                description="What the platform does (and does not) handle."
                className="pt-10"
            >
                <div className="grid gap-4 md:grid-cols-3">
                    <Reveal>
                        <FeatureCard
                            title="Hourly reporting"
                            description="Ticket counts submitted on a production-defined schedule with guardrails."
                            icon={<Clock className="size-5 text-blue-700" />}
                        />
                    </Reveal>
                    <Reveal delay={0.05}>
                        <FeatureCard
                            title="Daily consolidation"
                            description="Approved hourlies roll up into day-end summaries—clean, audited totals."
                            icon={
                                <BadgeCheck className="size-5 text-blue-700" />
                            }
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <FeatureCard
                            title="Cinema-specific computations"
                            description="Discount + cultural tax + production tax rules computed and snapshotted per entry."
                            icon={
                                <Calculator className="size-5 text-blue-700" />
                            }
                        />
                    </Reveal>
                </div>
            </PublicSection>

            <PublicSection
                title="Roles"
                description="Clear responsibilities and permission boundaries."
                className="pt-0"
            >
                <div className="grid gap-4 md:grid-cols-3">
                    <Reveal>
                        <FeatureCard
                            title="Checker"
                            description="Time-in using GPS, then submit hourly and end-of-day breakdown—only if authorized for the production company."
                            icon={
                                <ShieldCheck className="size-5 text-blue-700" />
                            }
                        />
                    </Reveal>
                    <Reveal delay={0.05}>
                        <FeatureCard
                            title="Agency admin"
                            description="Onboards checkers, assigns production access, monitors attendance, and approves/rejects/overrides with audit trail."
                            icon={
                                <Building2 className="size-5 text-blue-700" />
                            }
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <FeatureCard
                            title="Production viewer"
                            description="Read-only access to approved reports only—filterable, exportable, and always available."
                            icon={<Eye className="size-5 text-blue-700" />}
                        />
                    </Reveal>
                </div>
            </PublicSection>

            <PublicSection
                title="Computation logic (strict order)"
                description="Every ticket entry follows a reproducible, auditable pipeline."
                className="pt-0"
            >
                <Reveal>
                    <div className="rounded-2xl border bg-white/60 p-6 text-sm backdrop-blur dark:bg-slate-950/40">
                        <ol className="grid gap-2 sm:grid-cols-2">
                            <li>
                                <span className="font-semibold">1.</span> Apply
                                discount → discounted price
                            </li>
                            <li>
                                <span className="font-semibold">2.</span> Deduct
                                cultural tax → effective price
                            </li>
                            <li>
                                <span className="font-semibold">3.</span>{" "}
                                Effective price × quantity → gross
                            </li>
                            <li>
                                <span className="font-semibold">4.</span> Apply
                                resolved tax rule → tax amount
                            </li>
                            <li className="sm:col-span-2">
                                <span className="font-semibold">5.</span> Gross
                                − tax → net amount (snapshotted)
                            </li>
                        </ol>
                    </div>
                </Reveal>
            </PublicSection>

            <PublicSection title="Next step" className="pt-0">
                <Reveal>
                    <CalloutCTA
                        title="Explore public movie pages"
                        description="Browse the demo pages for Now Showing, Upcoming, and Recommended—built with reusable components and scroll-reveal animations."
                        primaryHref="/now-showing"
                        primaryLabel="Now Showing"
                        secondaryHref="/upcoming"
                        secondaryLabel="Upcoming"
                    />
                </Reveal>
            </PublicSection>
        </PublicPage>
    );
}
