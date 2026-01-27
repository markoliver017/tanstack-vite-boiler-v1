import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button } from "@/components/shadcn-ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { Input } from "@/components/shadcn-ui/input";
import { createUserSchema, type CreateUserValues } from "./zUsersSchema";
import { useCreateUser } from "./mutations";

export function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
    const { mutate, isPending } = useCreateUser();

    const form = useForm<CreateUserValues>({
        resolver: standardSchemaResolver(createUserSchema),
        defaultValues: { name: "", email: "", role: "user" },
    });

    const onSubmit = (data: CreateUserValues) => {
        mutate(data, {
            onSuccess: () => {
                form.reset();
                onSuccess();
            },
        });
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
                                    type="text"
                                    placeholder="jane@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        className="w-[180px]"
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            Admin
                                        </SelectItem>
                                        <SelectItem value="user">
                                            User
                                        </SelectItem>
                                        <SelectItem value="guest">
                                            Guest
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create User"}
                </Button>
            </form>
            {/* <pre>{JSON.stringify(form.watch(), null, 2)}</pre> */}
        </Form>
    );
}
