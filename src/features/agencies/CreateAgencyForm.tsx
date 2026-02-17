import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zAgencySchema, type AgencyFormData } from "./zAgencySchema";
import { useCreateAgency } from "./mutations";
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
import { useNavigate } from "@tanstack/react-router";

export function CreateAgencyForm() {
    const navigate = useNavigate();
    const createAgency = useCreateAgency();

    const form = useForm<AgencyFormData>({
        resolver: zodResolver(zAgencySchema),
        defaultValues: {
            name: "",
            contactPerson: "",
            email: "",
            phone: "",
        },
    });

    const onSubmit = async (data: AgencyFormData) => {
        await createAgency.mutateAsync(data);
        navigate({ to: "/agencies", search: { page: 1, limit: 10 } });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Agency Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter agency name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Person</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter contact person name"
                                    {...field}
                                />
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
                                    placeholder="email@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="+63 917 123 4567"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={createAgency.isPending}
                        className="flex-1"
                    >
                        {createAgency.isPending
                            ? "Creating..."
                            : "Create Agency"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            navigate({
                                to: "/agencies",
                                search: { page: 1, limit: 10 },
                            })
                        }
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
