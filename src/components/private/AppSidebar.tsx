import {
    Home,
    Settings,
    Users,
    ChevronsUpDown,
    LogOut,
    User,
    ScrollText,
    Building2,
    Film,
} from "lucide-react";
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
} from "@/components/shadcn-ui/sidebar";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/shadcn-ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSession, authClient } from "@/lib/auth/auth-client";

// Menu items.
const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    // {
    //     title: "Patients",
    //     url: "/patients",
    //     icon: Inbox,
    // },
    // {
    //     title: "Cases",
    //     url: "/cases",
    //     icon: Calendar,
    // },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
];

const adminItems = [
    {
        title: "Theater Groups",
        url: "/theater-groups",
        icon: Building2,
    },
    {
        title: "Agencies",
        url: "/agencies",
        icon: Building2,
    },
    {
        title: "Theaters",
        url: "/theaters",
        icon: Building2,
    },
    {
        title: "Cinemas",
        url: "/cinemas",
        icon: Film,
    },
    {
        title: "Cinema Formats",
        url: "/cinema-formats",
        icon: Film,
    },
    {
        title: "Users",
        url: "/users",
        icon: Users,
    },
    {
        title: "Audit Trails",
        url: "/audit-trails",
        icon: ScrollText,
    },
];

export function AppSidebar() {
    const { open: isSidebarOpen } = useSidebar();
    const { data: session } = useSession();
    const navigate = useNavigate();
    const user = session?.user;

    const initials =
        user?.name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "?";

    const handleSignOut = async () => {
        await authClient.signOut();
        navigate({ to: "/sign-in" });
    };

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
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Administration</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {adminItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="h-auto py-2">
                                    <Avatar className="h-7 w-7">
                                        <AvatarImage
                                            src={user?.image || undefined}
                                            alt={user?.name || "User"}
                                        />
                                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isSidebarOpen && (
                                        <div className="flex-1 text-left text-sm leading-tight">
                                            <p className="font-medium truncate">
                                                {user?.name || "User"}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {user?.email || ""}
                                            </p>
                                        </div>
                                    )}
                                    {isSidebarOpen && (
                                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
                                    )}
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                side="top"
                                className="w-56"
                            >
                                <Link to="/profile">
                                    <DropdownMenuItem className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        My Profile
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="flex items-center gap-2 text-destructive"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
