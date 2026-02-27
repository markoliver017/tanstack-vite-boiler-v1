import Header from "@/components/public/Header";

export function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="public-cinema-theme relative min-h-screen overflow-x-hidden bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(1000px_circle_at_15%_0%,rgba(245,158,11,0.22),transparent_55%),radial-gradient(900px_circle_at_90%_10%,rgba(14,165,233,0.16),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(228,228,231,0.95))] dark:bg-[radial-gradient(1000px_circle_at_15%_0%,rgba(245,158,11,0.18),transparent_55%),radial-gradient(900px_circle_at_90%_10%,rgba(14,165,233,0.14),transparent_45%),linear-gradient(180deg,rgba(20,20,24,0.96),rgba(6,6,10,1))]" />
            <div className="projector-sweep pointer-events-none fixed inset-0 z-0 opacity-40 dark:opacity-25" />
            <div className="film-grain pointer-events-none fixed inset-0 z-0 opacity-20 dark:opacity-30" />
            <div className="pointer-events-none fixed inset-0 z-0 [background:radial-gradient(900px_circle_at_50%_-5%,transparent_25%,rgba(0,0,0,0.28))] dark:[background:radial-gradient(900px_circle_at_50%_-5%,transparent_22%,rgba(0,0,0,0.62))]" />
            <Header />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
