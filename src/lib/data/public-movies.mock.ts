export type MovieStatus = "now_showing" | "upcoming";

export interface PublicMovie {
    id: string;
    title: string;
    status: MovieStatus;
    posterSrc?: string;
    tags: string[];
    synopsis: string;
    releaseDateLabel: string;
}

export const PUBLIC_MOVIES_MOCK: PublicMovie[] = [
    {
        id: "mv-aurora",
        title: "Aurora Protocol",
        status: "now_showing",
        posterSrc: "/posters/aurora-protocol.jpg",
        tags: ["IMAX", "Sci‑Fi", "Audit"],
        synopsis:
            "A high-velocity thriller about eliminating reporting blind spots with real-time validation.",
        releaseDateLabel: "Now Showing",
    },
    {
        id: "mv-ledger",
        title: "Ledger at Midnight",
        status: "now_showing",
        posterSrc: "/posters/ledger-at-midnight.jpg",
        tags: ["Drama", "Tax Rules", "Compliance"],
        synopsis:
            "When computations get complicated, only strict order and snapshots keep the story straight.",
        releaseDateLabel: "Now Showing",
    },
    {
        id: "mv-geofence",
        title: "Geofence Run",
        status: "now_showing",
        posterSrc: "/posters/geofence-run.jpg",
        tags: ["Thriller", "GPS", "Attendance"],
        synopsis:
            "A checker must be physically present—or the system refuses to accept the hour.",
        releaseDateLabel: "Now Showing",
    },
    {
        id: "mv-cutoff",
        title: "Cutoff Horizon",
        status: "upcoming",
        posterSrc: "/posters/cutoff-horizon.jpg",
        tags: ["Action", "Schedules", "Slots"],
        synopsis:
            "Reporting windows tighten as production schedules reshape the entire workflow.",
        releaseDateLabel: "Q2 2026",
    },
    {
        id: "mv-ordinance",
        title: "Ordinance Shift",
        status: "upcoming",
        posterSrc: "/posters/ordinance-shift.jpg",
        tags: ["Mystery", "Cultural Tax"],
        synopsis: "City rules change overnight—your snapshots shouldn't.",
        releaseDateLabel: "Q2 2026",
    },
];
