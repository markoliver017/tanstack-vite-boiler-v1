import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shadcn-ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { updateUserSchema, type UpdateUserValues } from "./zUsersSchema";
import { useUpdateUser } from "./mutations";
import Swal from "sweetalert2";

interface EditUserFormProps {
    userId: string;
    defaultValues: UpdateUserValues;
    onSuccess?: () => void;
}

export function EditUserForm({
    userId,
    defaultValues,
    onSuccess,
}: EditUserFormProps) {
    const { mutate, isPending } = useUpdateUser();

    const form = useForm<UpdateUserValues>({
        resolver: zodResolver(updateUserSchema),
        defaultValues,
    });

    const onSubmit = (data: UpdateUserValues) => {
        mutate(
            { id: userId, data },
            {
                onSuccess: () => {
                    Swal.fire({
                        title: "Profile Updated",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    onSuccess?.();
                },
                onError: (err) => {
                    Swal.fire({
                        title: "Update Failed",
                        text: err.message,
                        icon: "error",
                    });
                },
            },
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="jane@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </form>
        </Form>
    );
}
