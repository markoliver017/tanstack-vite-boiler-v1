import { Link } from "@tanstack/react-router";
import HeaderAuth from "./HeaderAuth";
import MenuBar from "./MenuBar";

export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md supports-backdrop-filter:bg-white/60">
            {/* Optional: Top border gradient for extra PCMC branding */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-blue-600 via-yellow-400 to-red-600" />
            <div className="container mx-auto flex flex-wrap h-16 items-center justify-between px-4">
                {/* --- Logo & Title --- */}
                <Link to="/" className="flex items-center gap-3 group">
                    {/* Logo Image */}
                    <div className="relative size-10 transition-transform duration-300 group-hover:scale-105">
                        {/* Make sure 'pcmc-logo.png' exists in your public folder */}
                        <img
                            src="/pcmc_logo.png"
                            alt="PCMC Logo"
                            className="object-contain"
                        />
                    </div>

                    {/* Text Styling */}
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-extrabold tracking-tight text-blue-900 dark:text-blue-100">
                            {import.meta.env.VITE_APP_ABBREVIATION}
                        </span>
                        <span className="hidden md:block text-sm font-bold text-red-600 dark:text-red-400">
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
