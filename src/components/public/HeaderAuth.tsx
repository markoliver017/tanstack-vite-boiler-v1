import { Link, useRouteContext } from "@tanstack/react-router";
import { FileSignature, LogIn, LogOut } from "lucide-react";
import { Button } from "../shadcn-ui/button";
import AvatarButton from "../shared/AvatarButton";
import { getInitials } from "@/lib/utils";

export default function HeaderAuth() {
    const { auth } = useRouteContext({ from: "__root__" });
    // console.log("Session in headerAuth", auth);

    if (auth.isPending) {
        return (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
        );
    }

    if (!auth.session) {
        return (
            <div className="flex gap-2">
                <Button
                    asChild
                    variant="default"
                    // size="sm"
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                >
                    <Link to="/sign-up" className="flex items-center gap-2">
                        <FileSignature className="h-4 w-4" />
                        <span className="hidden sm:inline">Register</span>
                    </Link>
                </Button>

                <Button
                    asChild
                    variant="default"
                    // size="sm"
                    className="border border-blue-200 bg-green-100 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
                >
                    <Link to="/sign-in" className="flex items-center gap-2">
                        <span className="hidden sm:inline">Sign In</span>
                        <LogIn className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <Button
                asChild
                variant="default"
                // size="sm"
                className="bg-red-700 hover:bg-red-800 text-white"
            >
                <Link to="/sign-up" className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                </Link>
            </Button>

            <AvatarButton
                src={auth.session.image || undefined}
                fallback={getInitials(auth.session.name)}
                onClick={() => console.log("Open profile menu")}
            />
        </div>
    );
}
