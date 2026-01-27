import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
    // SidebarMenuSkeleton,
} from "@/components/shadcn-ui/sidebar";

// Menu items.
const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
];

export function AppSidebar() {
    const { open: isSidebarOpen } = useSidebar();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex-row justify-center">
                <img src="/pcmc_logo.png" alt="Logo" className="h-8 w-8 " />
                {isSidebarOpen && (
                    <h1 className="text-lg font-semibold">
                        {import.meta.env.VITE_APP_ABBREVIATION}
                    </h1>
                )}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* {Array.from({ length: 5 }).map((_, index) => (
								<SidebarMenuItem key={`skeleton-${index}`}>
									<SidebarMenuSkeleton showIcon />
								</SidebarMenuItem>
							))} */}
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}
