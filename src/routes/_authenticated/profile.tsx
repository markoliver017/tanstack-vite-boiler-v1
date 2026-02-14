import LoadingComponent from "@/components/shared/LoadingComponent";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/shadcn-ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import { Badge } from "@/components/shadcn-ui/badge";
import { Separator } from "@/components/shadcn-ui/separator";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/shadcn-ui/tabs";
import { EditUserForm } from "@/features/users/EditUserForm";
import { ChangePasswordForm } from "@/features/users/ChangePasswordForm";
import { AvatarUpload } from "@/features/users/AvatarUpload";
import { LinkedAccounts } from "@/features/users/LinkedAccounts";
import { useSession } from "@/lib/auth/auth-client";
import { createFileRoute } from "@tanstack/react-router";
import {
    KeyRound,
    ImageIcon,
    LinkIcon,
    User,
    Mail,
    Calendar,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
    staticData: {
        breadcrumb: "My Profile",
        title: "My Profile",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: ProfilePage,
});

function ProfilePage() {
    const { data: session, isPending } = useSession();

    if (isPending) return <LoadingComponent />;

    if (!session?.user) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Unable to load your profile. Please sign in again.
            </div>
        );
    }

    const user = session.user;
    const initials = user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="p-4 space-y-6 max-w-3xl mx-auto">
            {/* Profile header */}
            <Card>
                <CardContent className="flex items-center gap-6 pt-6">
                    <Avatar className="h-20 w-20 border-2 border-muted">
                        <AvatarImage
                            src={user.image || undefined}
                            alt={user.name}
                        />
                        <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex gap-2 pt-1">
                            <Badge variant="secondary">
                                {((user as Record<string, unknown>)
                                    .role as string) ?? "user"}
                            </Badge>
                            {user.emailVerified && (
                                <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-600"
                                >
                                    Verified
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                        value="info"
                        className="flex items-center gap-2"
                    >
                        <User className="w-4 h-4" />
                        Info
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="flex items-center gap-2"
                    >
                        <KeyRound className="w-4 h-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger
                        value="avatar"
                        className="flex items-center gap-2"
                    >
                        <ImageIcon className="w-4 h-4" />
                        Avatar
                    </TabsTrigger>
                    <TabsTrigger
                        value="linked"
                        className="flex items-center gap-2"
                    >
                        <LinkIcon className="w-4 h-4" />
                        Linked
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your name and email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditUserForm
                                userId={user.id}
                                defaultValues={{
                                    name: user.name,
                                    email: user.email,
                                }}
                            />

                            <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Created
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            user.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Updated
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            user.updatedAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your password. You'll need your current
                                password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChangePasswordForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="avatar">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Photo</CardTitle>
                            <CardDescription>
                                Click the photo or button to upload a new image.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center py-8">
                            <AvatarUpload
                                userId={user.id}
                                currentImage={user.image}
                                userName={user.name}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="linked">
                    <Card>
                        <CardHeader>
                            <CardTitle>Linked Accounts</CardTitle>
                            <CardDescription>
                                Connect or disconnect your Google account for
                                quick sign-in.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LinkedAccounts />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
