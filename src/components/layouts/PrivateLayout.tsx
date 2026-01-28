import { AppSidebar } from "@/components/private/AppSidebar";
import { Separator } from "@/components/shadcn-ui/separator";
import {
    SidebarProvider,
    SidebarTrigger,
} from "@/components/shadcn-ui/sidebar";
import AvatarButton from "../shared/AvatarButton";
import { useMatches, useRouteContext } from "@tanstack/react-router";
import { getInitials } from "@/lib/utils";
import { Breadcrumbs } from "./Breadcrumbs";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get the current route matches to find the title
    const matches = useMatches();
    const lastMatch = [...matches].reverse().find((d) => d.staticData?.title);
    const title = lastMatch?.staticData?.title || "Page Title";

    // Get the current route session context
    const context = useRouteContext({ from: "__root__" });
    const { auth } = context;
    if (!auth.session) {
        return null;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="w-full">
                <header className="flex justify-between p-3 sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md supports-backdrop-filter:bg-white/60">
                    <div className="flex items-center">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mx-2" />
                        <h1 className="text-xl font-semibold">{title}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Breadcrumbs />

                        <AvatarButton
                            src={auth.session.image || undefined}
                            fallback={getInitials(auth.session.name)}
                            onClick={() => console.log("Open profile menu")}
                        />
                    </div>
                </header>
                <main className="wrapper">{children}</main>
            </div>
            {/* <div className="fixed bottom-0 right-0 left-0 z-50">
                Context:
                <pre>{JSON.stringify(context, null, 2)}</pre>
            </div> */}
        </SidebarProvider>
    );
}
