import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
/**
 * AvatarButton
 * A reusable avatar button for headers/navigation bars.
 *
 * Props:
 * - src: string (image URL of the user)
 * - alt?: string
 * - size?: number (px, default 40)
 * - onClick?: () => void
 * - fallback?: string (initials, e.g. "MR")
 */

export default function AvatarButton({
    src,
    alt = "User avatar",
    size = 40,
    onClick,
    fallback = "U",
}: {
    src?: string;
    alt?: string;
    size?: number;
    onClick?: () => void;
    fallback?: string;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    onClick={onClick}
                    className="flex items-center justify-center rounded-full border border-gray-300 hover:ring-2 hover:ring-blue-500 transition focus:outline-none"
                    style={{ width: size, height: size }}
                    aria-label="User menu"
                >
                    {src ? (
                        <img
                            src={src}
                            alt={alt}
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <span className="text-sm font-semibold text-gray-600">
                            {fallback}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Billing
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Keyboard shortcuts
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Invite users
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>Email</DropdownMenuItem>
                                <DropdownMenuItem>Message</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>More...</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                        New Team
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
