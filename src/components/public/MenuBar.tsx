import { Link, useLocation } from "@tanstack/react-router";
import { Home, Menu, MenuIcon, Popcorn, Sparkles, Timer } from "lucide-react";
import { useState } from "react";
import { isRouteActive } from "@/lib/utils";
import { Button } from "../shadcn-ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../shadcn-ui/sheet";

const navItems = [
    { name: "Home", href: "/", icon: <Home className="w-3" /> },
    { name: "About", href: "/about", icon: <MenuIcon className="w-3" /> },
    {
        name: "Now Showing",
        href: "/now-showing",
        icon: <Popcorn className="w-3" />,
    },
    { name: "Upcoming", href: "/upcoming", icon: <Timer className="w-3" /> },
    {
        name: "Recommended",
        href: "/recommended",
        icon: <Sparkles className="w-3" />,
    },
];

export default function MenuBar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            <nav className="hidden items-center space-x-6 lg:flex">
                {navItems.map((item) => {
                    const active = isRouteActive(location.pathname, item.href);
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300
                                ${
                                    active
                                        ? "bg-amber-100/70 text-amber-800 shadow-[0_6px_18px_-12px_rgba(0,0,0,0.65)] dark:bg-amber-300/15 dark:text-amber-100"
                                        : "text-neutral-600 hover:bg-white/60 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
                                }`}
                        >
                            {item?.icon || <MenuIcon className="w-2" />}
                            {item.name}
                            <span
                                className={`absolute -bottom-[7px] left-1/2 h-[2px] -translate-x-1/2 bg-amber-500 transition-all duration-300
                                ${
                                    active
                                        ? "w-8 opacity-100"
                                        : "w-0 opacity-0 group-hover:w-8 group-hover:opacity-100"
                                }`}
                            />
                        </Link>
                    );
                })}
            </nav>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral-900 dark:text-neutral-100"
                    >
                        <Menu className="size-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="right"
                    className="w-full border-l-white/60 bg-white/95 xs:w-1/2 dark:border-l-white/10 dark:bg-neutral-950/95"
                >
                    <SheetHeader>
                        <SheetTitle className="text-left flex items-center gap-2">
                            <div className="relative size-8">
                                <img
                                    src="/pcmc_logo.png"
                                    alt="Logo"
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-neutral-900 dark:text-white">
                                Explore
                            </span>
                        </SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col space-y-6 mt-8 p-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium text-neutral-700 transition-colors hover:text-amber-700 dark:text-neutral-200 dark:hover:text-amber-300"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </>
    );
}
