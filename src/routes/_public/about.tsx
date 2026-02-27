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
                <section className="relative overflow-hidden rounded-3xl border border-white/55 bg-white/70 px-6 py-10 shadow-[0_28px_80px_-70px_rgba(0,0,0,1)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/55">
                    <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
                        About the system
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm text-neutral-700 sm:text-base dark:text-neutral-300">
                        A cinema gross reporting platform that enforces schedule
                        windows, validates attendance, automates tax and cultural
                        deductions, and keeps approved reports visible for production.
                    </p>
                    <div className="pointer-events-none absolute inset-0 opacity-45 [background:radial-gradient(900px_circle_at_20%_18%,rgba(245,158,11,0.2),transparent_40%),radial-gradient(900px_circle_at_88%_70%,rgba(14,165,233,0.16),transparent_44%)]" />
                </section>
            </Reveal>

            <PublicSection
                title="System scope"
                description="What the platform handles and why it stays audit-safe."
                className="pt-10"
            >
                <div className="grid gap-4 md:grid-cols-3">
                    <Reveal>
                        <FeatureCard
                            title="Hourly reporting"
                            description="Ticket counts are submitted in production-defined windows with validation guardrails."
                            icon={<Clock className="size-5" />}
                        />
                    </Reveal>
                    <Reveal delay={0.05}>
                        <FeatureCard
                            title="Daily consolidation"
                            description="Approved hourlies roll into day-end totals with cleaner reconciliation."
                            icon={<BadgeCheck className="size-5" />}
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <FeatureCard
                            title="Cinema-specific computations"
                            description="Discount, cultural tax, and production tax rules are snapshotted per entry."
                            icon={<Calculator className="size-5" />}
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
                            description="Uses GPS attendance and submits hourly plus day-end breakdown for authorized productions."
                            icon={<ShieldCheck className="size-5" />}
                        />
                    </Reveal>
                    <Reveal delay={0.05}>
                        <FeatureCard
                            title="Agency admin"
                            description="Onboards checkers, manages authorizations, and approves or overrides with reasons."
                            icon={<Building2 className="size-5" />}
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <FeatureCard
                            title="Production viewer"
                            description="Read-only access to approved reports with filters and export readiness."
                            icon={<Eye className="size-5" />}
                        />
                    </Reveal>
                </div>
            </PublicSection>

            <PublicSection
                title="Computation logic"
                description="Every ticket entry follows this strict order."
                className="pt-0"
            >
                <Reveal>
                    <div className="rounded-2xl border border-white/50 bg-white/75 p-6 text-sm text-neutral-700 backdrop-blur dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-300">
                        <ol className="grid gap-2 sm:grid-cols-2">
                            <li>
                                <span className="font-semibold">1.</span> Apply discount to get discounted price
                            </li>
                            <li>
                                <span className="font-semibold">2.</span> Deduct cultural tax for effective price
                            </li>
                            <li>
                                <span className="font-semibold">3.</span> Effective price x quantity for gross
                            </li>
                            <li>
                                <span className="font-semibold">4.</span> Apply resolved tax rule for tax amount
                            </li>
                            <li className="sm:col-span-2">
                                <span className="font-semibold">5.</span> Gross minus tax to get final net amount
                            </li>
                        </ol>
                    </div>
                </Reveal>
            </PublicSection>

            <PublicSection title="Next step" className="pt-0">
                <Reveal>
                    <CalloutCTA
                        title="Explore the public movie pages"
                        description="Visit Now Showing, Upcoming, and Recommended to review the refreshed UI and poster-first layout."
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
