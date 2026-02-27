import { Link } from "@tanstack/react-router";
import HeaderAuth from "./HeaderAuth";
import MenuBar from "./MenuBar";

export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/50 bg-white/65 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/70">
            <div className="absolute left-0 top-0 h-[2px] w-full bg-linear-to-r from-amber-500 via-rose-500 to-sky-500" />
            <div className="container mx-auto flex h-16 flex-wrap items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative size-10 transition-transform duration-300 group-hover:scale-105">
                        <img
                            src="/project-logo.png"
                            alt="Project Logo"
                            className="object-contain"
                        />
                    </div>

                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                            {import.meta.env.VITE_APP_ABBREVIATION}
                        </span>
                        <span className="hidden text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 md:block dark:text-amber-300">
                            {import.meta.env.VITE_APP_NAME}
                        </span>
                    </div>
                </Link>
                <MenuBar />
                <HeaderAuth />
            </div>
        </header>
    );
}
