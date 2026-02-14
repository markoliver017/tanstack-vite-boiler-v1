import BackButton from "@/components/shared/BackButton";
import LoadingComponent from "@/components/shared/LoadingComponent";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/shadcn-ui/tabs";
import { userDetailOptions } from "@/features/users/use-users";
import { EditUserForm } from "@/features/users/EditUserForm";
import { ChangePasswordForm } from "@/features/users/ChangePasswordForm";
import { AvatarUpload } from "@/features/users/AvatarUpload";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, KeyRound, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/users/$userId_/edit")({
    loader: async ({ params, context: { queryClient } }) => {
        const user = await queryClient.ensureQueryData(
            userDetailOptions(params.userId),
        );
        return {
            user,
            breadcrumb: `Edit ${user.name}`,
        };
    },
    staticData: {
        title: "Edit User",
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: EditUserPage,
});

function EditUserPage() {
    const { userId } = Route.useParams();
    const { data: user } = useSuspenseQuery(userDetailOptions(userId));

    return (
        <div className="p-4 space-y-4 max-w-3xl mx-auto">
            <BackButton />

            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">Edit User</h1>
                <span className="text-muted-foreground">{user.name}</span>
            </div>

            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                        value="info"
                        className="flex items-center gap-2"
                    >
                        <Pencil className="w-4 h-4" />
                        Profile Info
                    </TabsTrigger>
                    <TabsTrigger
                        value="password"
                        className="flex items-center gap-2"
                    >
                        <KeyRound className="w-4 h-4" />
                        Set Password
                    </TabsTrigger>
                    <TabsTrigger
                        value="avatar"
                        className="flex items-center gap-2"
                    >
                        <ImageIcon className="w-4 h-4" />
                        Avatar
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update the user's name and email address.
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
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Set Password</CardTitle>
                            <CardDescription>
                                Set a new password for this user. They will not
                                be notified.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChangePasswordForm targetUserId={user.id} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="avatar">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Avatar</CardTitle>
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
            </Tabs>
        </div>
    );
}
