import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    zAgencySchema,
    type AgencyFormData,
    type Agency,
} from "./zAgencySchema";
import { useUpdateAgency } from "./mutations";
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
import { useEffect } from "react";

export function EditAgencyForm({ agency }: { agency: Agency }) {
    const navigate = useNavigate();
    const updateAgency = useUpdateAgency();

    const form = useForm<AgencyFormData>({
        resolver: zodResolver(zAgencySchema),
        defaultValues: {
            name: agency.name,
            contactPerson: agency.contactPerson,
            email: agency.email,
            phone: agency.phone,
        },
    });

    // Reset form when agency data changes
    useEffect(() => {
        form.reset({
            name: agency.name,
            contactPerson: agency.contactPerson,
            email: agency.email,
            phone: agency.phone,
        });
    }, [agency, form]);

    const onSubmit = async (data: AgencyFormData) => {
        await updateAgency.mutateAsync({ id: agency.id, data });
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
                        disabled={updateAgency.isPending}
                        className="flex-1"
                    >
                        {updateAgency.isPending ? "Saving..." : "Save Changes"}
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
