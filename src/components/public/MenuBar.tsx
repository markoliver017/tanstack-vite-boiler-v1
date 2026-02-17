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
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
                {navItems.map((item) => {
                    const active = isRouteActive(location.pathname, item.href);
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`relative group text-sm font-medium transition-colors flex items-center gap-1 duration-300 
                                ${
                                    active
                                        ? "text-blue-700 dark:text-blue-300 font-bold"
                                        : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300"
                                }`}
                        >
                            {item?.icon || <MenuIcon className="w-2" />}
                            {item.name}
                            {/* Underline animation (Yellow/Gold) */}
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 dark:bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                            <span
                                className={`absolute -bottom-1 left-0 w-full h-[2px] bg-yellow-400 transform transition-transform duration-300 origin-left
                                ${
                                    active
                                        ? "scale-x-100"
                                        : "scale-x-0 hover:scale-x-100"
                                }`}
                            />
                        </Link>
                    );
                })}
            </nav>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                {/* Mobile Menu */}
                <SheetTrigger asChild className="lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-900 dark:text-blue-100"
                    >
                        <Menu className="size-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="right"
                    className="border-l-blue-200 w-full xs:w-1/2 dark:border-l-blue-900"
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
                            <span className="text-blue-900 dark:text-white">
                                Menu
                            </span>
                        </SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col space-y-6 mt-8 p-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
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
