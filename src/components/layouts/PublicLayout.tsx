import Header from "@/components/public/Header";

export function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[radial-gradient(1100px_circle_at_30%_-10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.14),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,0.03),rgba(2,6,23,0.10))] dark:bg-[radial-gradient(1100px_circle_at_30%_-10%,rgba(59,130,246,0.20),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.16),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(0,0,0,1))]">
            <div className="pointer-events-none fixed inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-15" />
            <div className="pointer-events-none fixed inset-0 [background:radial-gradient(800px_circle_at_50%_20%,transparent_30%,rgba(0,0,0,0.35))] dark:[background:radial-gradient(800px_circle_at_50%_20%,transparent_25%,rgba(0,0,0,0.60))]" />
            <Header />
            {children}
        </div>
    );
}
