import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn-ui/select";
import { fetchList } from "@/lib/api.client";
import { useCreateAuthorization } from "./mutations";
import {
    createAuthorizationSchema,
    type CreateAuthorizationValues,
} from "./zAuthorizationSchema";

export function CreateAuthorizationForm({ checkerId }: { checkerId: number }) {
    const createMutation = useCreateAuthorization();

    const { data: companies } = useQuery({
        queryKey: ["production-companies", "lookup"],
        queryFn: () =>
            fetchList<{ id: number; name: string }[]>(
                `/production-companies?_page=1&_limit=200`,
            ),
    });

    const form = useForm<CreateAuthorizationValues>({
        resolver: zodResolver(createAuthorizationSchema),
        defaultValues: {
            checkerId,
            productionCompanyId: 0,
            authorizedFrom: "",
            authorizedUntil: "",
            notes: "",
        },
    });

    const onSubmit = async (data: CreateAuthorizationValues) => {
        await createMutation.mutateAsync({ ...data, checkerId });
        form.reset({
            checkerId,
            productionCompanyId: 0,
            authorizedFrom: "",
            authorizedUntil: "",
            notes: "",
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="productionCompanyId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Production Company</FormLabel>
                            <Select
                                value={field.value ? String(field.value) : undefined}
                                onValueChange={(value) => field.onChange(Number(value))}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select production company" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {(companies?.data || []).map((company) => (
                                        <SelectItem key={company.id} value={String(company.id)}>
                                            {company.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="authorizedFrom"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Authorized From</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="authorizedUntil"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Authorized Until</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Input {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" variant="success" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Authorizing..." : "Authorize"}
                </Button>
            </form>
        </Form>
    );
}
